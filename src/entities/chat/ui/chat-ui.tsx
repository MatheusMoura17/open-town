import type { IChat } from "../model/chat";

interface IChatProps {
    data: IChat;
}

export const Chat = ({ data }: IChatProps) => {
    return (
        <div>
            <h3>Chat</h3>
            <div>{JSON.stringify(data)}</div>
        </div>
    )
}