import { createRoomClientPeer } from '../api/room-peer-client'
import { useGuestRoomStateStore } from './guest-room-state-store'
import type { RoomMessage } from './room-message'

type JoinStatus = 'idle' | 'connecting' | 'connected' | 'error'

export const useRoomClientSession = () => {
  const { setMessages, clearMessages } = useGuestRoomStateStore()

  const joinSession = (
    hostId: string,
    onStatusChange: (status: JoinStatus) => void,
    onSendReady: (send: (message: RoomMessage) => void) => void,
  ): (() => void) => {
    clearMessages()
    onStatusChange('connecting')

    const clientPeer = createRoomClientPeer(hostId, {
      onStatusChange,
      onSnapshot: (snapshot) => setMessages(snapshot.messages),
      onSendReady,
    })

    return () => clientPeer.destroy()
  }

  return { joinSession }
}