import { create } from 'zustand'
import type { RoomState } from './room-state'
import type { RoomMessage } from './room-message'

type RoomStateStore = {
  roomState: RoomState | null
  initRoomState: (roomId: string) => void
  setRoomState: (state: RoomState) => void
  appendMessage: (message: RoomMessage) => void
}

export const useHostRoomStateStore = create<RoomStateStore>()((set) => ({
  roomState: null,

  initRoomState: (roomId: string) =>
    set({ roomState: { roomId, messages: [] } }),

  setRoomState: (state: RoomState) => set({ roomState: state }),

  appendMessage: (message: RoomMessage) =>
    set((store) => {
      if (!store.roomState) return store
      return {
        roomState: {
          ...store.roomState,
          messages: [...store.roomState.messages, message],
        },
      }
    }),
}))
