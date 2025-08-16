export const ROUTES = {
    home: "/",
    room: {
        base: "/room/:roomId",
        factory: (roomId: string)=>`/room/${roomId}`
    }
}