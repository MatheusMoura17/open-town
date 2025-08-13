import { useEffect } from "react";
import { generateId } from "../../../shared/lib/id"
import { getRoomsFromRepo, saveRoomFromRepo, removeRoomFromRepo } from "../api/room-repository";
import { useRoomStore } from "./room-store";
import { deserializeRoom, serializeRoom, type IRoom } from "./room";

export const useRoom = () => {
  const { rooms, setRooms } = useRoomStore();

  const fetchRooms = () => {
    setRooms(getRoomsFromRepo());
  }

  const addRoomFromHash = (hash: string) => {
    const room = deserializeRoom(hash)
    saveRoomFromRepo(room);
    fetchRooms();
  }

  const removeRoom = (room: IRoom) => {
    removeRoomFromRepo(room);
    fetchRooms();
  }

  const createRoom = (displayName: string) => {
    const room = {
      id: generateId(),
      displayName,
    }

    saveRoomFromRepo(room);
    fetchRooms()
  }

  const shareRoom = (room: IRoom) => {
    const roomHash = serializeRoom(room);
    alert(roomHash);
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  return { rooms, createRoom, addRoomFromHash, removeRoom, shareRoom }
}