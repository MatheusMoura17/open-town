export const ROUTES = {
    home: "/",
    quickStart: "/quick-start",
    room: {
        base: "/room/:roomId",
        factory: (roomId: string)=>`/room/${roomId}`
    }
}