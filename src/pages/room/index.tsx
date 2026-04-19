import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useUser } from '../../entities/user'
import { type IRoom } from '../../entities/room'
import { useRoomList } from '../../entities/room-list'
import { useHostRoom } from '../../features/host-room'
import { useJoinRoom } from '../../features/join-room'
import type { IUser } from '../../entities/user'

interface IHostProps {
  user: IUser
  room: IRoom
}

interface IClientProps {
  user: IUser
  hostId: string
}

export const Host: React.FC<IHostProps> = ({ user, room }) => {
  const { createRoom, sendMessage, messages } = useHostRoom()
  const [input, setInput] = useState('')

  useEffect(() => {
    createRoom(room.displayName)
  }, [])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
  }

  return (
    <>
      <h2>Sala: {room.displayName}</h2>
      <p>
        <strong>ID para convidar:</strong> {user.id}
      </p>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === user.id ? 'Você' : msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Mensagem..."
      />
      <button onClick={handleSend}>Enviar</button>
    </>
  )
}

export const Client: React.FC<IClientProps> = ({ hostId, user }) => {
  const { join, leave, sendMessage, messages, status } = useJoinRoom()
  const [input, setInput] = useState('')

  useEffect(() => {
    join(hostId)
    return () => { leave() }
  }, [hostId])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
  }

  return (
    <>
      <h2>Sala: {hostId}</h2>
      <p>Status: {status}</p>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === user.id ? 'Você' : msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Mensagem..."
        disabled={status !== 'connected'}
      />
      <button onClick={handleSend} disabled={status !== 'connected'}>Enviar</button>
    </>
  )
}

export const RoomPage = () => {
  const { roomId } = useParams()
  const { getRoomById } = useRoomList()
  const { user } = useUser()
  const room = useMemo(() => getRoomById(roomId ?? ''), [roomId])

  if (!user || !roomId) {
    return <div>Carregando…</div>
  }

  // Host: the room ID equals the host's user ID (by design)
  const isOwner = user.id === roomId

  if (isOwner) {
    if (!room) return <div>Carregando…</div>
    return <Host room={room} user={user} />
  }

  return <Client hostId={roomId} user={user} />
}