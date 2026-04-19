# Quickstart: Basic Room with Host-Guest Chat

**Feature**: `002-basic-room`  
**Date**: 2026-04-18

---

## Prerequisites

- Node.js 20 installed
- Dependencies installed: `yarn install`
- Two browser windows or two machines on the same network

---

## Running the App

```bash
yarn dev
```

The dev server starts at `http://localhost:5173` (or the IP printed in the terminal when using `--host 0.0.0.0`).

---

## Manual Test: Host Creates a Room

1. Open `http://localhost:5173` in **Browser A**.
2. Register or confirm your user identity (feature 001 prerequisite).
3. Navigate to **"Create Room"** (or the Add Room page at `/add-room`).
4. Fill in a display name and confirm. A room is created using your user ID as the PeerJS Peer ID.
5. You are redirected to the Room page. Your room's **join ID** is displayed — note it.

---

## Manual Test: Guest Joins the Room

1. Open `http://localhost:5173` in **Browser B** (use a different profile or incognito to avoid PeerJS ID collision).
2. Register or confirm your user identity in Browser B.
3. Navigate to **"Join Room"** (or enter the join ID on the home/quick-start page).
4. Enter the **join ID** from the host's room page and confirm.
5. Browser B is connected. The guest sees the full current message history (empty on first join).

---

## Manual Test: Real-Time Chat

1. In **Browser A** (host), type a message and send. The message appears immediately.
2. In **Browser B** (guest), the same message appears within ~1 second.
3. In **Browser B** (guest), type a message and send.
4. In **Browser A** (host) and all other guests, the message appears within ~1 second.

---

## Manual Test: State Recovery on Reconnect

1. With a room containing messages, close **Browser B** (guest tab).
2. Exchange a few more messages from the host.
3. Reopen **Browser B**, navigate to "Join Room", re-enter the same join ID.
4. The guest sees all messages including those sent during the disconnection.

---

## Running Unit Tests

```bash
yarn test
# or for a single run:
yarn test:run
```

Key test files for this feature:

| File | What it tests |
|------|---------------|
| `src/entities/room/model/commands/send-chat-handler.test.ts` | Pure handler logic |
| `src/entities/room/model/command-dispatcher.test.ts` | Dispatcher routing |

---

## Architecture at a Glance

```
Browser A (Host)                    Browser B (Guest)
┌─────────────────────────┐         ┌─────────────────────────┐
│  features/host-room     │         │  features/join-room      │
│  useHostRoom()          │         │  useJoinRoom()           │
│    ↓                    │         │    ↓                     │
│  entities/session       │  PeerJS │  entities/session        │
│  useSessionHost()  ←────┼─────────┼── useSessionClient()     │
│    ↓                    │DataChan │    ↑                     │
│  entities/room          │         │  entities/room           │
│  CommandDispatcher      │──snap──→│  room-state-store        │
│  RoomState (Zustand)    │         │  (read-only, from host)  │
└─────────────────────────┘         └─────────────────────────┘
```

- The **host** owns `RoomState` and is the only party that mutates it.
- The **guest** receives `RoomStateSnapshot` and renders it read-only.
- Both sides use the same `RoomMessage` types for consistent rendering.
