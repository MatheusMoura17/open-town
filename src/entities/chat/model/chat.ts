export interface IChatMessage {
    sender: string;
    text: string;
}

export interface IChat {
    messages: IChatMessage
}