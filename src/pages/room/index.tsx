import { useParams } from "react-router";

import { useSession } from "../../entities/session";
import { useUser } from "../../entities/user";
import { useEffect } from "react";

export const RoomPage = () => {
  const { roomId } = useParams();
  const { user } = useUser();
  const { joinSession } = useSession();

  useEffect(() => {
    if (!user || !roomId) return;

    joinSession(roomId, user?.id)
  }, [roomId])

  return (
    <>
      {roomId}
    </>
  )
}