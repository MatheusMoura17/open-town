import { create } from 'zustand'
import type { RoomMessage } from './room-message'

type GuestRoomStateStore = {
  messages: RoomMessage[]
  setMessages: (messages: RoomMessage[]) => void
  clearMessages: () => void
}

export const useGuestRoomStateStore = create<GuestRoomStateStore>()((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}))
