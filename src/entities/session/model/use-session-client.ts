import Peer from 'peerjs'
import { useGuestRoomStateStore } from '../../room/model/guest-room-state-store'
import type { RoomMessage, RoomStateSnapshot } from '../../room'

type JoinStatus = 'idle' | 'connecting' | 'connected' | 'error'


export const useSessionClient = () => {
    const { setMessages, clearMessages } = useGuestRoomStateStore()

    const joinSession = (
        hostId: string,
        onStatusChange: (status: JoinStatus) => void,
        onSendReady: (send: (message: RoomMessage) => void) => void,
    ): (() => void) => {
        clearMessages()
        onStatusChange('connecting')

        // Use a random peer ID — the guest's peer ID is not meaningful for routing
        const peer = new Peer()

        peer.on('error', () => {
            onStatusChange('error')
        })

        peer.on('open', () => {
            const connection = peer.connect(hostId)

            onSendReady((message: RoomMessage) => {
                if (connection.open) connection.send(message)
            })

            connection.on('open', () => {
                onStatusChange('connected')
            })

            connection.on('data', (data) => {
                const snapshot = data as RoomStateSnapshot
                if (snapshot.type === 'state_snapshot') {
                    setMessages(snapshot.messages)
                }
            })

            connection.on('error', () => {
                onStatusChange('error')
            })

            connection.on('close', () => {
                onStatusChange('idle')
            })

            peer.on('disconnected', () => {
                onStatusChange('connecting')
                peer.reconnect()
            })
        })

        return () => {
            peer.destroy()
        }
    }

    return { joinSession }
}