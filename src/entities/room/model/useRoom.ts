import { useEffect } from "react";
import { generateId } from "../../../shared/lib/id"
import { getRoomsFromRepo, saveRoomFromRepo, removeRoomFromRepo, getRoomByIdFromRepo } from "../api/room-repository";
import { useRoomStore } from "./room-store";
import { deserializeRoom, serializeRoom, type IRoom } from "./room";

export const useRoom = () => {
  const { rooms, setRooms } = useRoomStore();

  const fetchRooms = () => {
    setRooms(getRoomsFromRepo());
  }

  const addRoomFromHash = (hash?: string): boolean => {
    const room = deserializeRoom(hash)

    if (!room) return false;

    saveRoomFromRepo(room);
    fetchRooms();

    return true;
  }

  const removeRoom = (room: IRoom) => {
    removeRoomFromRepo(room);
    fetchRooms();
  }

  const createRoom = (displayName: string, ownerId: string) => {
    const room = {
      id: generateId(),
      ownerId,
      displayName,
    }

    saveRoomFromRepo(room);
    fetchRooms()
  }

  const getRoomById = (roomId: string) => {
    return getRoomByIdFromRepo(roomId);
  }

  const shareRoom = (room: IRoom) => {
    const roomHash = serializeRoom(room);
    const { origin } = window.location;
    const url = `${origin}${import.meta.env.BASE_URL}#/add-room/${roomHash}`;
    navigator.clipboard.writeText(url)
    alert(`${url} copiado para area de transferencia!`);
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  return { rooms, createRoom, addRoomFromHash, removeRoom, shareRoom, getRoomById }
}