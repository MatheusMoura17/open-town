import { useRoom } from "../../entities/room/model/useRoom";

export const RoomListPage = () => {
  const { rooms, createRoom, joinRoomFromHash, shareRoom, removeRoom } = useRoom();

  const register = (formData: FormData) => {
    const displayName = formData.get("displayName");

    if (!displayName) return;

    createRoom(displayName as string);
  }

  const join = (formData: FormData) => {
    const roomHash = formData.get("roomHash");

    if (!roomHash) return;

    joinRoomFromHash(roomHash as string);
  }

  return (
    <>
      <h1>Lista de salas</h1>
      <h2>Criar nova sala</h2>
      <form action={register}>
        <input type="text" name="displayName" placeholder="Nome da sala" />
        <button type="submit">Criar</button>
      </form>
      <h2>Adicionar sala</h2>
      <form action={join}>
        <input type="text" name="roomHash" placeholder="Hash da sala" />
        <button type="submit">Adicionar</button>
      </form>
      <h2>Salas</h2>
      <table>
        <thead>
          <tr>
            <th align="left" style={{ width: 300 }}>Nome</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <th align="left">{room.displayName}</th>
              <th>
                <button>Entrar</button>
                <button onClick={() => shareRoom(room)}>Compartilhar</button>
                <button onClick={() => removeRoom(room)}>Remover</button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}