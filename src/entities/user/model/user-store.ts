import { create } from 'zustand'
import type { IUser } from './user'

export type UserStore = {
  user?: IUser | null
  setUser: (user?: IUser | null) => void
}

export const useUserStore = create<UserStore>()((set) => ({
  setUser: (value?: IUser | null) => set({ user: value }),
}))