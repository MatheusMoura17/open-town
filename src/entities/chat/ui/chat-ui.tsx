import type { ChatMessage } from '../../room'

interface IChatProps {
    messages: ChatMessage[];
}

export const Chat = ({ messages }: IChatProps) => {
    return (
        <div>
            <h3>Chat</h3>
            {messages.map((msg, index) => (
                <div key={index}>
                    <strong>{msg.senderId}:</strong> {msg.content}
                </div>
            ))}
        </div>
    )
}