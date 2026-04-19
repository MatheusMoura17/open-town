# Contract: Room RPC — PeerJS DataChannel Protocol

**Feature**: `002-basic-room`  
**Date**: 2026-04-18  
**Transport**: PeerJS `DataConnection` (JSON-serialized plain objects)

---

## Overview

All messages sent over the PeerJS DataChannel are plain JavaScript objects
serialized as JSON. There are two communication directions:

| Direction | Payload Type | Purpose |
|-----------|-------------|---------|
| Guest → Host (over DataChannel) | `RoomMessage` | Guest sends a message to be processed by the host's CommandDispatcher |
| Host (local dispatch) | `RoomMessage` | Host sends a message processed locally — no network hop |
| Host → Guest (unicast on join) | `RoomStateSnapshot` | Deliver full current state |
| Host → Guests (broadcast after command) | `RoomStateSnapshot` | Deliver updated state to all guests |

---

## Participant → Host: `RoomCommand`

Commands follow a discriminated union pattern. The `type` field determines
which handler processes the command. New command types can be added without
breaking existing handlers.

> **Host sends too**: When the host sends a message, the `RoomCommand` is
> dispatched directly to `CommandDispatcher` in the same process — no PeerJS
> DataChannel is involved. The resulting `RoomStateSnapshot` is broadcast to
> all connected guests exactly as for any other command.

### `send_chat`

Requests the host to append a new chat message to the room state.

```json
{
  "type": "send_chat",
  "senderId": "<userId>",
  "content": "<non-empty plain text>"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `type` | `"send_chat"` | ✅ | Literal value |
| `senderId` | `string` | ✅ | Non-empty; must match the sender's user ID |
| `content` | `string` | ✅ | Non-empty, non-whitespace-only |

**Error handling**: Commands that fail validation are silently dropped by the
host. No error response is sent to the guest in this version.

---

## Host → Guest: `RoomStateSnapshot`

Sent by the host whenever any guest connects, or after processing any command.
Contains the complete ordered message history.

```json
{
  "type": "state_snapshot",
  "messages": [
    {
      "type": "chat",
      "senderId": "<userId>",
      "content": "<text>",
      "timestamp": 1713398400000
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"state_snapshot"` | ✅ | Discriminator |
| `messages` | `RoomMessage[]` | ✅ | Full ordered log; index 0 is oldest |

### `RoomMessage` schema (element of `messages[]`)

#### `ChatMessage`

```json
{
  "type": "chat",
  "senderId": "<userId>",
  "content": "<text>",
  "timestamp": 1713398400000
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"chat"` | Literal discriminator |
| `senderId` | `string` | ID of the user who sent the message |
| `content` | `string` | Plain text body |
| `timestamp` | `number` | Unix epoch milliseconds (`Date.now()`) assigned by host at processing time |

---

## Extensibility Notes

To add a new message type (e.g., `movement`):

1. Add a new interface to the `RoomMessage` union in `room-message.ts`.
2. Implement a handler in `entities/room/model/commands/` and register it in `CommandHandlerMap`.
3. Update this contract document.

No changes are required to the dispatcher, the snapshot delivery mechanism, or
any existing handler.

---

## Connection Lifecycle

```
Guest                                     Host (also a chat participant)
  |                                         |
  |-- peer.connect(hostPeerId) -----------> |
  |                                         | stores connection in activeConnections
  |<-- RoomStateSnapshot (full history) --- |
  |                                         |
  |-- { type:"chat", ... } ---------------> |
  |                                         | CommandDispatcher routes to chatHandler
  |                                         | chatHandler → new RoomState
  |<-- RoomStateSnapshot (updated) -------- | (broadcast to ALL guests)
  |                                         |
  |                        [host types msg] |
  |                                         | local: CommandDispatcher routes to chatHandler
  |                                         | chatHandler → new RoomState
  |<-- RoomStateSnapshot (updated) -------- | (broadcast to ALL guests)
  |                                         | host UI also re-renders
  |                                         |
  |-- peer.disconnect() -----------------> |
  |                                         | removes connection from activeConnections
```

---

## Notes

- All payloads MUST be valid JSON-serializable plain objects.
- `timestamp` is set by the sender at send time (`Date.now()`).
- The host MUST NOT trust the `senderId` field for authorization; it is used
  only for display purposes.
- There is no message acknowledgement in this version; delivery is best-effort
  over the WebRTC DataChannel.
