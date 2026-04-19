import Peer from 'peerjs'
import type { RoomMessage } from '../model/room-message'
import type { RoomStateSnapshot } from '../model/room-state'

export type ClientPeerStatus = 'connecting' | 'connected' | 'error' | 'idle'

export type ClientPeerCallbacks = {
  onStatusChange: (status: ClientPeerStatus) => void
  onSnapshot: (snapshot: RoomStateSnapshot) => void
  onSendReady: (send: (message: RoomMessage) => void) => void
}

export type ClientPeer = {
  destroy: () => void
}

export const createRoomClientPeer = (hostId: string, callbacks: ClientPeerCallbacks): ClientPeer => {
  // Random peer ID — the guest's peer ID is not meaningful for routing
  const peer = new Peer()

  peer.on('error', () => {
    callbacks.onStatusChange('error')
  })

  peer.on('open', () => {
    callbacks.onStatusChange('connecting')
    const connection = peer.connect(hostId)

    callbacks.onSendReady((message: RoomMessage) => {
      if (connection.open) connection.send(message)
    })

    connection.on('open', () => {
      callbacks.onStatusChange('connected')
    })

    connection.on('data', (data) => {
      const snapshot = data as RoomStateSnapshot
      if (snapshot.type === 'state_snapshot') {
        callbacks.onSnapshot(snapshot)
      }
    })

    connection.on('error', () => {
      callbacks.onStatusChange('error')
    })

    connection.on('close', () => {
      callbacks.onStatusChange('idle')
    })

    peer.on('disconnected', () => {
      callbacks.onStatusChange('connecting')
      peer.reconnect()
    })
  })

  return { destroy: () => peer.destroy() }
}
