import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useSessionClient, useSessionHost } from "../../entities/session";
import { useUser, type IUser } from "../../entities/user";
import { useRoom, type IRoom } from "../../entities/room";

interface IProps {
  user: IUser
  room: IRoom
}

export const Host: React.FC<IProps> = ({ user }) => {
  const { hostSession } = useSessionHost();

  useEffect(() => {
    hostSession(user.id);
  }, [])

  return (<>
    <h2>
      Você é o host
    </h2>
  </>
  )
}

export const Client: React.FC<IProps> = ({ room, user }) => {
  const { joinSession } = useSessionClient();

  useEffect(() => {
    joinSession(user.id, room.ownerId);
  }, [])

  return (
    <>
      <h2>Você é o cliente</h2>
    </>
  )
}


export const RoomPage = () => {
  const { roomId } = useParams();
  const { getRoomById } = useRoom();
  const { user } = useUser();
  const room = useMemo(() => getRoomById(roomId || ""), [roomId]);

  const isOwner = user?.id === room?.ownerId

  if (!room || !user) {
    return <div>"loading..."</div>
  }

  return (
    <>
      {isOwner
        ? <Host room={room} user={user} />
        : <Client room={room} user={user} />
      }
    </>
  )
}