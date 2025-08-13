export interface IRoom {
  id: string
  displayName: string
}

export const serializeRoom = (room: IRoom) => {
  return `${room.id}:${btoa(room.displayName)}`
}

export const deserializeRoom = (hash: string) => {
  const [id, base64] = hash.split(":");
  const room: IRoom = {
    id,
    displayName: atob(base64)
  }
  return room;
}