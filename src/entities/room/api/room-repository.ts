import type { IRoom } from "../model/room";

const ROOMS_KEY = "rooms";

export const saveRoomFromRepo = (room: IRoom) => {
  const rooms = getRoomsFromRepo();
  const exists = rooms.findIndex((r) => r.id === room.id) !== -1

  if (exists) return;

  rooms.push(room);

  const raw = JSON.stringify(rooms);
  localStorage.setItem(ROOMS_KEY, raw);
}

export const removeRoomFromRepo = (room: IRoom) => {
  let rooms = getRoomsFromRepo();

  rooms = rooms.filter(r => r.id !== room.id);

  const raw = JSON.stringify(rooms);
  localStorage.setItem(ROOMS_KEY, raw);
}

export const getRoomsFromRepo = () => {
  const raw = localStorage.getItem(ROOMS_KEY);
  const rooms = raw ? JSON.parse(raw) as IRoom[] : [];
  return rooms;
}

export const getRoomByIdFromRepo = (roomId: string) => {
  const raw = localStorage.getItem(ROOMS_KEY);
  const rooms = raw ? JSON.parse(raw) as IRoom[] : [];
  return rooms.find(room => room.id === roomId);
}