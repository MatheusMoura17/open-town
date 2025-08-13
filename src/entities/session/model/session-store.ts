import type Peer from 'peerjs'
import { create } from 'zustand'

export enum SessionStatus {
    idle,
    connecting,
    connected,
    error
}

export type RoomStore = {
    peer?: Peer
    status: SessionStatus
    setPeer: (peer: Peer) => void
    setStatus: (status: SessionStatus) => void
}

export const useRoomStore = create<RoomStore>()((set) => ({
    status: SessionStatus.idle,
    setPeer: (peer: Peer) => set(state => ({ ...state, peer })),
    setStatus: (status: SessionStatus) => set(state => ({ ...state, status })),
}))