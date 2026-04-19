import { useRef, useState } from 'react'
import { useRoomClientSession, useGuestRoomStateStore, type RoomMessage } from '../../../entities/room'
import { useUser } from '../../../entities/user'

type JoinStatus = 'idle' | 'connecting' | 'connected' | 'error'

export const useJoinRoom = () => {
  const { joinSession } = useRoomClientSession()
  const { user } = useUser()
  const { messages } = useGuestRoomStateStore()
  const [status, setStatus] = useState<JoinStatus>('idle')
  const sendRef = useRef<((message: RoomMessage) => void) | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const join = (hostId: string) => {
    if (!user) return
    cleanupRef.current?.()
    const cleanup = joinSession(
      hostId,
      setStatus,
      (send) => { sendRef.current = send },
    )
    cleanupRef.current = cleanup
  }

  const sendMessage = (content: string) => {
    if (!user || !sendRef.current) return
    const message: RoomMessage = {
      type: 'chat',
      senderId: user.id,
      content,
      timestamp: Date.now(),
    }
    sendRef.current(message)
  }

  const leave = () => {
    cleanupRef.current?.()
    cleanupRef.current = null
    sendRef.current = null
    setStatus('idle')
  }

  return { join, sendMessage, leave, status, messages }
}
