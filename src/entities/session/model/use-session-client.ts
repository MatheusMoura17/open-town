import Peer from "peerjs"

export const useSessionClient = () => {
    const joinSession = (uid: string, roomOwnerId: string) => {
        const peer = new Peer(uid);
        peer.on("open", () => {
            console.log("Conectado à sala")

            const connection = peer.connect(roomOwnerId);

            connection.on("open", () => {
                connection.send("olá!")
            });
            connection.on("error", console.log);
            
        });
    }

    // const hostSession = (roomId: string) =>{
    //     const peer = new Peer(uid);
    //     peer.on("open", () => console.log("Conectado à sala"));

    //     const connection = peer.connect(roomId);

    //     connection.on("open", console.log);
    //     connection.on("error", console.log);
    // }

    return { joinSession }
}