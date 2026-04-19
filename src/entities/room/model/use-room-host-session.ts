import { createRoomHostPeer } from '../api/room-peer-host'
import { createCommandDispatcher } from './command-dispatcher'
import { chatHandler } from './commands/chat-handler'
import { useHostRoomStateStore } from './host-room-state-store'
import type { RoomStateSnapshot } from './room-state'

const buildDispatcher = () =>
  createCommandDispatcher({ chat: chatHandler })

export const useRoomHostSession = () => {
  const { initRoomState, setRoomState, roomState } = useHostRoomStateStore()

  const hostSession = (userId: string) => {
    initRoomState(userId)
    const dispatcher = buildDispatcher()

    const hostPeer = createRoomHostPeer(userId, {
      onGuestConnected: (): RoomStateSnapshot => ({
        type: 'state_snapshot',
        messages: useHostRoomStateStore.getState().roomState?.messages ?? [],
      }),

      onGuestMessage: (message) => {
        const currentState = useHostRoomStateStore.getState().roomState
        if (!currentState) return
        const nextState = dispatcher(message, currentState)
        setRoomState(nextState)
        hostPeer.broadcast({ type: 'state_snapshot', messages: nextState.messages })
      },

      onGuestDisconnected: () => { },
    })

    const sendMessage = (content: string) => {
      const currentState = useHostRoomStateStore.getState().roomState
      if (!currentState) return
      const message = { type: 'chat' as const, senderId: userId, content, timestamp: Date.now() }
      const nextState = dispatcher(message, currentState)
      setRoomState(nextState)
      hostPeer.broadcast({ type: 'state_snapshot', messages: nextState.messages })
    }

    return { sendMessage }
  }

  return { hostSession, roomState }
}