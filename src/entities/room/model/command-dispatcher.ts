import type { RoomMessage } from './room-message'
import type { RoomState } from './room-state'

export type CommandHandler<T extends RoomMessage> = (
  message: T,
  state: RoomState,
) => RoomState

export type CommandHandlerMap = {
  [K in RoomMessage['type']]: CommandHandler<Extract<RoomMessage, { type: K }>>
}

export type CommandDispatcher = (message: RoomMessage, state: RoomState) => RoomState

export const createCommandDispatcher = (handlers: CommandHandlerMap): CommandDispatcher => {
  return (message, state) => {
    const handler = handlers[message.type] as CommandHandler<typeof message>
    return handler(message, state)
  }
}
