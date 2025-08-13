import { create } from 'zustand'
import type { IRoom } from './room'

export type RoomStore = {
  rooms: IRoom[]
  setRooms: (rooms: IRoom[]) => void
}

export const useRoomStore = create<RoomStore>()((set) => ({
  rooms: [],
  setRooms: (rooms: IRoom[]) => set(state => ({ ...state, rooms })),
}))