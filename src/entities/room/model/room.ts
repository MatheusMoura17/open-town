export interface IRoom {
  id: string
  displayName: string
  ownerId: string
}

export const serializeRoom = (room: IRoom) => {
  return btoa(JSON.stringify(room))
}

export const deserializeRoom = (hash?: string): IRoom | null => {
  if (!hash) return null;

  try {
    const room = JSON.parse(atob(hash)) as IRoom
    return room;
  } catch (error) {
    console.error(error);
    return null;
  }
}