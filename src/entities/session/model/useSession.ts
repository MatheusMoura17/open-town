import Peer from "peerjs"

export const useSession = () => {
    const joinSession = (roomId: string, uid: string) => {
        const peer = new Peer(uid);
        peer.on("open", () => console.log("Conectado à sala"));

        const connection = peer.connect(roomId);
    
        connection.on("open", console.log);
        connection.on("error", console.log);
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