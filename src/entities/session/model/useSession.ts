import Peer from "peerjs"

export const useSession = () => {
    const joinSession = (roomId: string, uid: string) => {
        const peer = new Peer(uid);

        peer.on("open", () => console.log("Conectado à sala"));
        const connection = peer.connect(roomId);

        connection.on("open", console.log);
        connection.on("error", console.log);

        // peer.on("error", err => {
        //     if (err.type === "unavailable-id") {
        //         const tempPeer = new Peer(uid);
        //         const conn = tempPeer.connect(roomId);
        //         conn.on("open", () => console.log("Conectado à sala existente"));
        //     } else {
        //         console.error(err);
        //     }
        // });
    }

    return { joinSession }
}