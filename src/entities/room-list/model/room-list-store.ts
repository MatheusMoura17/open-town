import { create } from 'zustand'
import type { IRoom } from '../../room/model/room'

type RoomListStore = {
  rooms: IRoom[]
  setRooms: (rooms: IRoom[]) => void
}

export const useRoomListStore = create<RoomListStore>()((set) => ({
  rooms: [],
  setRooms: (rooms: IRoom[]) => set((state) => ({ ...state, rooms })),
}))
