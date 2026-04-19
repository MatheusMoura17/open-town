import { useRef } from 'react'
import { useRoomHostSession } from '../../../entities/room'
import { useRoomList } from '../../../entities/room-list'
import { useUser } from '../../../entities/user'

type SendMessageFn = (content: string) => void

export const useHostRoom = () => {
  const { hostSession, roomState } = useRoomHostSession()
  const { createRoom: saveRoom } = useRoomList()
  const { user } = useUser()
  const sendMessageRef = useRef<SendMessageFn | null>(null)
  const isHostingRef = useRef(false)

  const createRoom = (displayName: string): string | null => {
    if (!user || isHostingRef.current) return null
    isHostingRef.current = true
    saveRoom(displayName, user.id, user.id)
    const session = hostSession(user.id)
    sendMessageRef.current = session.sendMessage
    return user.id
  }

  const sendMessage = (content: string) => {
    sendMessageRef.current?.(content)
  }

  const messages = roomState?.messages ?? []

  return { createRoom, sendMessage, messages, roomId: roomState?.roomId ?? null }
}
