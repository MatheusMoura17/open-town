export interface ChatMessage {
  type: 'chat'
  senderId: string
  content: string
  timestamp: number
}

export type RoomMessage = ChatMessage
// Future: | MovementMessage | EmoteMessage | ...
