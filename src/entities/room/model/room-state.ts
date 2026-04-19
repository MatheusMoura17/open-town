import type { RoomMessage } from './room-message'

export interface RoomState {
  roomId: string
  messages: RoomMessage[]
}

export interface RoomStateSnapshot {
  type: 'state_snapshot'
  messages: RoomMessage[]
}
