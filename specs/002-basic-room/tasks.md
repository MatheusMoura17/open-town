# Tasks: Basic Room with Host-Guest Chat

**Branch**: `002-basic-room`  
**Input**: Design documents from `specs/002-basic-room/`  
**Prerequisites**: spec.md ✅ | plan.md ✅ | research.md ✅ | data-model.md ✅ | contracts/room-rpc.md ✅ | quickstart.md ✅

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[Story]**: User story label — US1/US2/US3/US4
- All tasks reference exact file paths

---

## Phase 1: Setup

**Purpose**: Align existing conflicting types before new domain code is written.

- [x] T001 Remove stale `IChatMessage` and `IChat` types from `src/entities/chat/model/chat.ts` and clear dead exports from `src/entities/chat/index.tsx`

---

## Phase 2: Foundational — Domain Types & Command Pipeline

**Purpose**: Core domain types and host-internal Command pipeline. ALL user story work is blocked until this phase is complete.

**⚠️ CRITICAL**: No user story can be implemented without these types.

- [x] T002 [P] Define `ChatMessage` interface and `RoomMessage` discriminated union in `src/entities/room/model/room-message.ts`
- [x] T003 [P] Define `RoomState` and `RoomStateSnapshot` interfaces in `src/entities/room/model/room-state.ts`
- [x] T004 Implement `CommandHandler<T>`, `CommandHandlerMap`, and `createCommandDispatcher` factory in `src/entities/room/model/command-dispatcher.ts` (depends on T002, T003)
- [x] T005 Implement `chatHandler` pure function `(message: ChatMessage, state: RoomState) => RoomState` in `src/entities/room/model/commands/chat-handler.ts` (depends on T002, T003)
- [x] T006 Implement `useRoomStateStore` Zustand store (host-side `RoomState`, append-only) in `src/entities/room/model/room-state-store.ts` (replaces old store; depends on T002, T003)
- [x] T007 Update barrel `src/entities/room/index.ts` to export all new types (`RoomMessage`, `ChatMessage`, `RoomState`, `RoomStateSnapshot`, `createCommandDispatcher`, `useRoomStateStore`) (depends on T002–T006)

**Checkpoint**: Domain types and command pipeline are in place — user story implementation can begin.

---

## Phase 3: User Story 1 — Host Creates a Room (Priority: P1) 🎯 MVP

**Goal**: A user creates a room, becomes the host, sees the chat UI with the join ID, and can send/receive messages locally.

**Independent Test**: Open the app, create a room — you see the room page with the room's join ID displayed and an empty chat. Type a message and send it; it appears instantly in the chat list, stored in `useRoomStateStore`. No guests needed.

### Implementation for User Story 1

- [x] T008 [US1] Refactor `useSessionHost` to create the PeerJS `Peer` with the user's ID, initialise `RoomState` via `useRoomStateStore`, wire `createCommandDispatcher`, and expose `sendMessage(content: string)` for local dispatch in `src/entities/session/model/use-session-host.ts`
- [x] T009 [US1] Implement `useHostRoom` feature hook that orchestrates room creation, exposes `sendMessage()`, and exposes `messages` from `useRoomStateStore` in `src/features/host-room/model/use-host-room.ts`
- [x] T010 [US1] Create feature barrel `src/features/host-room/index.ts` exporting `useHostRoom`
- [x] T011 [US1] Update `src/pages/add-room/index.tsx` to call `useHostRoom().createRoom()` on submit and navigate to the room page on success
- [x] T012 [US1] Implement host view in `src/pages/room/index.tsx`: display room join ID, render `ChatMessage[]` list from `useHostRoom().messages`, connect send input to `useHostRoom().sendMessage()`

**Checkpoint**: US1 is fully functional — a host can create a room and chat locally. Deliver as MVP.

---

## Phase 4: User Story 2 — Guest Joins an Existing Room (Priority: P2)

**Goal**: A second user enters a room ID and joins, immediately receiving the full current message history. Invalid room IDs show an error.

**Independent Test**: With a host room open in Browser A, open Browser B, enter the host's room ID on the join page, and confirm connection. The guest should see all messages the host has sent. Enter a bogus ID — the UI shows a "room not found" error.

### Implementation for User Story 2

- [x] T013 [P] [US2] Implement `useGuestRoomStateStore` Zustand store (read-only; stores `RoomMessage[]` populated from incoming `RoomStateSnapshot`) in `src/entities/room/model/guest-room-state-store.ts`
- [x] T014 [US2] Refactor `useSessionClient` to create a peer, connect to host, receive `RoomStateSnapshot` via `connection.on("data")`, and write messages to `useGuestRoomStateStore` in `src/entities/session/model/use-session-client.ts`
- [x] T015 [US2] Implement `useJoinRoom` feature hook: exposes `join(roomId: string)`, connection `status` (`idle | connecting | connected | error`), and `messages` from `useGuestRoomStateStore` in `src/features/join-room/model/use-join-room.ts`
- [x] T016 [US2] Create feature barrel `src/features/join-room/index.ts` exporting `useJoinRoom`
- [X] T017 [US2] Update join flow in `src/pages/quick-start/index.tsx` to call `useJoinRoom().join(roomId)`, handle `status === "error"` with a "room not found" message, and navigate to room page on `status === "connected"`
- [X] T018 [US2] Add guest view to `src/pages/room/index.tsx`: render `ChatMessage[]` from `useJoinRoom().messages` when the user is a guest

**Checkpoint**: US1 and US2 both work independently — a host+guest pair can connect and the guest sees the full history on join.

---

## Phase 5: User Story 3 — Real-Time Chat (Priority: P3)

**Goal**: Any connected participant (host or guest) sends a message and it appears for all participants within ~2 seconds.

**Independent Test**: With a host (Browser A) and guest (Browser B) connected, send a message from Browser B — it appears in Browser A and Browser B. Send from Browser A — it appears in both. Add a third browser as guest; all three see all messages.

### Implementation for User Story 3

- [X] T019 [P] [US3] Expose `sendMessage(content: string)` in `useJoinRoom` that constructs a `ChatMessage` and calls `connection.send()` over the DataChannel in `src/features/join-room/model/use-join-room.ts`
- [X] T020 [US3] Update `useSessionHost` to handle `connection.on("data")`: receive each `RoomMessage` from a guest, dispatch it through `CommandDispatcher`, then broadcast the updated `RoomStateSnapshot` to every entry in the active connections `Map` in `src/entities/session/model/use-session-host.ts`
- [X] T021 [US3] Connect the chat input send handler to `sendMessage()` for both host and guest roles in `src/pages/room/index.tsx` (host calls `useHostRoom().sendMessage()`, guest calls `useJoinRoom().sendMessage()`)

**Checkpoint**: Full real-time bidirectional chat works — all connected participants see all messages.

---

## Phase 6: User Story 4 — Guest Reconnects and Recovers State (Priority: P4)

**Goal**: A guest who disconnects and reconnects receives the full current chat history without missing any messages.

**Independent Test**: Guest joins, host sends several messages, guest closes and reopens the tab, re-enters the room ID — the guest sees all messages including those sent while they were away.

### Implementation for User Story 4

- [X] T022 [P] [US4] Handle `peer.on("disconnected")` in `useSessionClient` to call `peer.reconnect()` automatically and reset `status` to `"connecting"` in `src/entities/session/model/use-session-client.ts`
- [X] T023 [US4] After `peer.reconnect()` fires `peer.on("open")`, re-call `peer.connect(hostId)` to re-establish the DataChannel (triggering the host to send a fresh snapshot) in `src/features/join-room/model/use-join-room.ts`

**Checkpoint**: A reconnecting guest receives the complete current state — recovery is transparent.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T024 [P] Update `src/entities/chat/ui/chat-ui.tsx` to accept `messages: ChatMessage[]` (imported from `src/entities/room`) and remove any stale `IChatMessage` prop dependency
- [X] T025 [P] Update `src/entities/session/index.ts` to export the refactored `useSessionHost` and `useSessionClient`
- [X] T026 Run `npm run lint` and resolve all TypeScript strict-mode and ESLint errors across the feature
- [ ] T027 Manual end-to-end verification following `specs/002-basic-room/quickstart.md` (two browser windows: one host, one guest)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)       — No dependencies; start immediately
Phase 2 (Foundational) — Depends on Phase 1; BLOCKS all user stories
Phase 3 (US1 — P1)   — Depends on Phase 2; no other story dependency
Phase 4 (US2 — P2)   — Depends on Phase 2; no dependency on US1
Phase 5 (US3 — P3)   — Depends on Phase 3 (US1) AND Phase 4 (US2)
Phase 6 (US4 — P4)   — Depends on Phase 4 (US2)
Phase 7 (Polish)      — Depends on all desired phases complete
```

### User Story Dependencies

| Story | Depends on | Parallel with |
|-------|------------|---------------|
| US1 (P1) | Phase 2 only | US2, US4 |
| US2 (P2) | Phase 2 only | US1, US4 |
| US3 (P3) | US1 + US2 | — |
| US4 (P4) | US2 | US1 |

### Parallel Execution Opportunities

- **T002 ‖ T003**: Different files, no dependency between them
- **T013 ‖ T019**: Different files, no dependency between them
- **T022 ‖ T024 ‖ T025**: All target different files in the Polish phase
- **US1 ‖ US2**: Entire Phase 3 and Phase 4 can proceed in parallel after Phase 2

---

## Parallel Example: After Phase 2 completes

```
Developer A                Developer B
──────────────────────     ──────────────────────
T008 useSessionHost (US1)  T013 useGuestRoomStateStore (US2)
T009 useHostRoom (US1)     T014 useSessionClient (US2)
T010 barrel (US1)          T015 useJoinRoom (US2)
T011 add-room page (US1)   T016 barrel (US2)
T012 host Room page (US1)  T017 quick-start page (US2)
                           T018 guest Room page (US2)
──────────────────────     ──────────────────────
Both merge → Phase 5 (US3) begins
```

---

## Implementation Strategy

**Suggested MVP scope**: Complete Phase 1 + Phase 2 + Phase 3 (US1) only.  
This delivers a working room with local host chat — no guests yet — but exercises the entire Command pipeline and proves the architecture is sound.

Add Phase 4 (US2) next for the first multi-user milestone, then Phase 5 (US3) for full real-time messaging. Phase 6 (US4) is an enhancement that can be deferred.
