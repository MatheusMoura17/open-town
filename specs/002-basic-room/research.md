# Research: Basic Room with Host-Guest Chat

**Phase**: 0 — Pre-design research  
**Branch**: `002-basic-room`  
**Date**: 2026-04-18

---

## Decision 1: Command Pattern as a Host-Internal Processing Mechanism

**Decision**: The Command pattern lives **exclusively inside the host**.
Participants (guests and the host-as-sender) only send `RoomMessage` — they have
no knowledge of dispatchers or handlers. When the host receives an incoming
`RoomMessage` (from a guest via DataChannel, or from its own UI), it passes it
to a `CommandDispatcher`. The dispatcher is a typed handler map keyed by
`RoomMessage["type"]`. Each handler is a pure function `(message, state) => state`.

**Rationale**:
- Clear separation: the wire protocol is just messages; the host owns its own
  processing logic entirely.
- The single focal point for all state mutations is the host's `CommandDispatcher`.
- Pure handler functions are trivially testable in isolation with no PeerJS
  or network involvement.
- Adding a new message type (e.g., `movement`) requires only a new handler
  and a one-line registration — no changes to the dispatcher or the wire protocol.
- Discriminated unions on `type` give TypeScript exhaustive checking, so
  forgetting to register a handler is a compile-time error.

**Alternatives Considered**:
- **Single `switch` in a service**: Rejected — not extensible; new message types
  require modifying the existing switch tree, violating Open/Closed.
- **Middleware chain (Express-style)**: Rejected — overkill for the current scale;
  adds execution-order complexity without benefit at this stage.
- **Event emitter (`EventEmitter` / `mitt`)**: Rejected — loose coupling makes
  tracing message flow harder; handlers are registered imperatively and can be
  duplicated accidentally. Pure map is simpler.

---

## Decision 2: Discriminated Union Message Type System

**Decision**: All messages use a discriminated union with a mandatory `type`
string literal field. `RoomMessage` is the **single type** used for both the
wire payload (what participants send) and the stored state (what the host keeps
in `RoomState.messages`). For this feature, only `"chat"` is implemented.

```
RoomMessage = ChatMessage | ... (future: MovementMessage, etc.)
```

There is no separate `RoomCommand` wire type. The `CommandHandlerMap` is keyed
directly by `RoomMessage["type"]`.

**Rationale**:
- Explicitly requested by the team.
- TypeScript's narrowing on `type` eliminates runtime null checks.
- `switch (message.type)` with `default: assertNever(message)` catches
  unhandled types at compile time.
- Backward-compatible: adding a new union member is non-breaking for
  existing handlers.

**Alternatives Considered**:
- **Single `IMessage` with optional fields**: Rejected — requires nullable checks
  on every field access; `content?: string` in a MovementMessage makes no sense.
- **Class hierarchy with instanceof checks**: Rejected — classes serialize poorly
  over PeerJS DataChannel (JSON round-trip loses prototype chain). Plain objects
  are safer.

---

## Decision 3: RoomState In-Memory Storage

**Decision**: `RoomState` stores messages as an ordered `RoomMessage[]` array in
a Zustand store on the host side. No hard cap on the array length for this
version. A full snapshot (the entire array) is sent to guests on connect and
after each processed command.

**Rationale**:
- O(1) append for new messages; O(n) full broadcast is acceptable at the current
  scale (single-room, reasonable message volumes per session).
- State recovery on reconnect is free: the guest receives the same full snapshot.
- Simple to reason about; no pagination or cursor logic required for MVP.

**Alternatives Considered**:
- **Map keyed by message ID**: Rejected — introduces ordering complexity; chat
  messages are naturally time-ordered so an array is more natural.
- **Ring buffer with a fixed cap**: Rejected — premature optimization. If a cap
  is ever needed it can be applied in the `send_chat` handler without changing
  the storage shape.
- **GunDB**: Rejected — existing codebase uses PeerJS DataChannel directly;
  adding GunDB would be a new runtime dependency violating Principle V.

---

## Decision 4: Host-to-Guest Broadcast Strategy

**Decision**: The host maintains a `Map<connectionId, DataConnection>` for all
connected guests. The host is also a regular chat participant: when the host
sends a message, the command is dispatched locally (no network hop) and the
resulting state update is broadcast to all guests. After processing any command
(from a guest or from the host), the host serializes the full `RoomStateSnapshot`
as JSON and calls `connection.send()` on every entry. A new guest connecting
triggers an immediate snapshot for that peer only.

**Rationale**:
- PeerJS DataChannel `send()` is the only P2P primitive available; there is no
  native multicast. Iterating over all connections is the correct approach.
- Full-snapshot broadcast avoids differential sync complexity for the MVP;
  delta sync can be introduced later without changing the contract shape
  (add an optional `since: number` field to the snapshot).

**Alternatives Considered**:
- **Delta broadcast (send only new messages)**: Rejected for MVP — requires
  each guest to track a sequence number and the host to correlate per-guest
  positions. Adds state and error-handling complexity.
- **Shared relay server**: Rejected — violates Principle II (Serverless-First).

---

## Decision 5: FSD Layer Placement

**Decision**:

| Artefact | FSD Layer | Slice |
|----------|-----------|-------|
| `RoomMessage`, `RoomCommand`, `RoomState`, `CommandDispatcher` | `entities/room` | `model/` |
| Individual command handlers | `entities/room` | `model/commands/` |
| Host PeerJS session (room creation, broadcast) | `entities/session` | `model/` |
| Guest PeerJS session (join, receive snapshot) | `entities/session` | `model/` |
| "Create and host a room" use-case hook | `features/host-room` | `model/` |
| "Join a room as guest" use-case hook | `features/join-room` | `model/` |
| Room page composition | `pages/room` | — |

**Rationale**:
- `entities/` holds domain models and stores (no user-facing interactions).
- `features/` holds use-case orchestration hooks that wire entities together
  (`use-host-room` calls session + room-state entity APIs).
- `pages/` composes feature slices into a full route, with zero business logic.
- FSD layer import rules are fully respected: `features/` imports from
  `entities/`, `pages/` import from `features/` and `entities/`.

**Alternatives Considered**:
- Putting `CommandDispatcher` in `features/`: Rejected — it is a domain
  mechanism (pure business logic), not a UI use-case.
- Putting session hooks directly in `pages/`: Rejected — violates FSD rule
  "business logic MUST reside in entities/ or features/".
