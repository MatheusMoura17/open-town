# Data Model: Basic Room with Host-Guest Chat

**Phase**: 1 — Design  
**Branch**: `002-basic-room`  
**Date**: 2026-04-18

---

## Overview

The data model is built around three concerns:

1. **Messages** (`RoomMessage`) — what participants send over the wire and what the host stores in state; same type in both directions
2. **Command Pattern** — the host's **internal** processing mechanism; the `CommandDispatcher` receives an incoming `RoomMessage` and routes it to the correct handler based on `type`; participants are not aware of this
3. **RoomState** — what the host maintains in memory and broadcasts as a snapshot

All types are plain objects (no class instances) to survive JSON serialization
over the PeerJS DataChannel.

---

## 1. Message Types (Host → Guest broadcast payload)

### `ChatMessage`

The only concrete message type in this version. Represents a single chat
message stored in the room's history.

```ts
interface ChatMessage {
  type: "chat";
  senderId: string;   // User ID of the sender
  content: string;    // Plain text message body
  timestamp: number;  // Unix epoch milliseconds (Date.now())
}
```

### `RoomMessage` (union)

The discriminated union of all message types. Extend this union to add new
message categories in the future without changing any existing handler.

```ts
type RoomMessage = ChatMessage;
// Future: | MovementMessage | EmoteMessage | ...
```

**State transitions**: None — messages are immutable once appended.

---

## 2. Host Command Processing (internal)

Participants — guests and host alike — simply **send `RoomMessage`**. They have
no knowledge of commands, dispatchers, or handlers. The Command pattern exists
exclusively inside the host:

1. An incoming `RoomMessage` arrives (via DataChannel from a guest, or directly
   from the host's own UI).
2. The `CommandDispatcher` reads the `type` field and looks up the matching
   handler in `CommandHandlerMap`.
3. The handler returns a new `RoomState`.
4. The host broadcasts the updated state snapshot to all connected guests.

This separation ensures that adding a new message type only requires adding a
new handler — the rest of the pipeline never changes.

**Validation rules** (applied inside each handler, before mutating state):
- `content` MUST be a non-empty, non-whitespace-only string.
- `senderId` MUST be a non-empty string.
- Messages that fail validation are silently dropped (no error is sent back
  to the participant in this version).

---

## 3. RoomState

Held exclusively in the host's memory. Never persisted to storage.

```ts
interface RoomState {
  roomId: string;          // Matches IRoom.id — the host's PeerJS Peer ID
  messages: RoomMessage[]; // Append-only ordered log; index 0 is oldest
}
```

**Invariants**:
- `messages` is append-only. No message is deleted or mutated.
- `roomId` is set once at room creation and never changes.
- The initial state is `{ roomId: <hostId>, messages: [] }`.

---

## 4. RoomStateSnapshot

Sent from host → guest(s). Carries the full current state required for
a guest to render the room.

```ts
interface RoomStateSnapshot {
  type: "state_snapshot";
  messages: RoomMessage[]; // Full ordered copy of RoomState.messages
}
```

Sent in two scenarios:
1. **On guest connect** — to the newly connected guest only.
2. **After every processed command** — broadcast to all connected guests.

---

## 5. CommandHandler & CommandDispatcher

### `CommandHandler<T>`

A pure function that takes an incoming message and the current state, and
returns the next state. No side effects.

```ts
type CommandHandler<T extends RoomMessage> = (
  message: T,
  state: RoomState
) => RoomState;
```

### `CommandHandlerMap`

A map covering every key in `RoomMessage["type"]`. TypeScript will produce a
compile error if a new `RoomMessage` union member is added without a
corresponding handler.

```ts
type CommandHandlerMap = {
  [K in RoomMessage["type"]]: CommandHandler<Extract<RoomMessage, { type: K }>>;
};
```

### `CommandDispatcher`

A function that wraps `CommandHandlerMap` and dispatches at runtime.

```ts
type CommandDispatcher = (
  message: RoomMessage,
  state: RoomState
) => RoomState;
```

---

## 6. Entity Relationships

```
IRoom ──────────────── RoomState
  id          ←→       roomId
  ownerId              messages[]
  displayName                └── RoomMessage (discriminated by type)
                                      └── ChatMessage
                                          type: "chat"
                                          senderId
                                          content
                                          timestamp


RoomMessage (sent by any participant — guest via DataChannel, host locally)
  └── ChatMessage
        type: "chat"
        senderId
        content
        timestamp

CommandDispatcher (host-internal only)
  CommandHandlerMap["chat"] → chatHandler(message, state) → RoomState

RoomStateSnapshot (broadcast from host to all guests)
  type: "state_snapshot"
  messages: RoomMessage[]
```

---

## 7. State Transitions

```
Host creates room
  → RoomState { roomId, messages: [] }

Guest connects
  → Host sends RoomStateSnapshot (full current messages) to new guest only

Any participant sends a ChatMessage
  → Guest: ChatMessage travels over PeerJS DataChannel to host
  → Host: ChatMessage is passed directly to CommandDispatcher (no network hop)
  → CommandDispatcher looks up CommandHandlerMap["chat"]
  → chatHandler appends the ChatMessage to RoomState.messages
  → Host broadcasts RoomStateSnapshot to ALL connected guests
  → Host's own UI also re-renders from the updated RoomState

Guest disconnects
  → Host removes connection from active connections map
  → RoomState is unchanged (messages retained)

Host closes room (browser tab closed / peer destroyed)
  → RoomState is garbage-collected
  → All guests receive a PeerJS "close" event
```

---

## 8. File Locations (FSD)

| Type / Artifact | File |
|-----------------|------|
| `ChatMessage`, `RoomMessage` | `src/entities/room/model/room-message.ts` |
| `SendChatCommand`, `RoomCommand` | `src/entities/room/model/room-command.ts` |
| `RoomState`, `RoomStateSnapshot` | `src/entities/room/model/room-state.ts` |
| `CommandHandler`, `CommandHandlerMap`, `CommandDispatcher` | `src/entities/room/model/command-dispatcher.ts` |
| `sendChatHandler` | `src/entities/room/model/commands/send-chat-handler.ts` |
| `createCommandDispatcher` (factory) | `src/entities/room/model/command-dispatcher.ts` |
| Zustand store for `RoomState` | `src/entities/room/model/room-state-store.ts` |
