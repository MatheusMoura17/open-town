import Peer from "peerjs"

export const useSessionHost = () => {
    const hostSession = (uid: string) => {
        const peer = new Peer(uid);
        peer.on("open", () => console.log("Sala criada!"));

        peer.on("connection", connection => {
            console.log("connection received")
            connection.on("data", (data) => {
                console.log(connection.connectionId, data);
            })
        });
    }

    return { hostSession }
}