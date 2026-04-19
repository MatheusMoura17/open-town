import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'
import type { RoomMessage } from '../model/room-message'
import type { RoomStateSnapshot } from '../model/room-state'

export type HostPeerCallbacks = {
  onGuestConnected: () => RoomStateSnapshot
  onGuestMessage: (message: RoomMessage) => void
  onGuestDisconnected: (connectionId: string) => void
}

export type HostPeer = {
  broadcast: (snapshot: RoomStateSnapshot) => void
  destroy: () => void
}

export const createRoomHostPeer = (peerId: string, callbacks: HostPeerCallbacks): HostPeer => {
  const peer = new Peer(peerId)
  const activeConnections = new Map<string, DataConnection>()

  peer.on('connection', (connection) => {
    activeConnections.set(connection.connectionId, connection)

    connection.on('open', () => {
      const snapshot = callbacks.onGuestConnected()
      connection.send(snapshot)
    })

    connection.on('data', (data) => {
      callbacks.onGuestMessage(data as RoomMessage)
    })

    connection.on('close', () => {
      activeConnections.delete(connection.connectionId)
      callbacks.onGuestDisconnected(connection.connectionId)
    })
  })

  const broadcast = (snapshot: RoomStateSnapshot) => {
    activeConnections.forEach((conn) => {
      try {
        conn.send(snapshot)
      } catch {
        activeConnections.delete(conn.connectionId)
      }
    })
  }

  const destroy = () => peer.destroy()

  return { broadcast, destroy }
}
