import type { ChatMessage } from '../room-message'
import type { RoomState } from '../room-state'

const isValidChatMessage = (message: ChatMessage): boolean =>
  message.senderId.trim().length > 0 && message.content.trim().length > 0

export const chatHandler = (message: ChatMessage, state: RoomState): RoomState => {
  if (!isValidChatMessage(message)) return state

  return {
    ...state,
    messages: [...state.messages, message],
  }
}
