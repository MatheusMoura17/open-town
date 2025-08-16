import { useRoom } from "../../entities/room/model/useRoom";
import { useUser } from "../../entities/user";

export const HomePage = () => {
  const { user } = useUser();
  const { rooms, createRoom, addRoomFromHash, shareRoom, removeRoom } = useRoom();

  const register = (formData: FormData) => {
    const displayName = formData.get("displayName");

    if (!displayName) return;
    if (!user) return;

    createRoom(displayName as string, user?.id);
  }

  const add = (formData: FormData) => {
    const roomHash = formData.get("roomHash");

    if (!roomHash) return;

    addRoomFromHash(roomHash as string);
  }

  if (!user) {
    return <div>Usuário não cadastrado!</div>
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
      <form action={add}>
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
                <button onClick={() => console.log(room.id)}>Entrar</button>
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