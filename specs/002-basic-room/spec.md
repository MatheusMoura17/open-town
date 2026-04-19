# Feature Specification: Basic Room with Host-Guest Chat

**Feature Branch**: `002-basic-room`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Uma sala é criada por um usuário 'host' que é responsável por processar todos os dados recebidos localmente e enviar os RPCs para outros clientes. Os outros usuários 'guests' se conectam à sala do host e recebem os dados processados por ele. O host é o único responsável por processar os dados, enquanto os guests apenas recebem os dados processados e exibem as informações na interface do usuário. Vamos iniciar criando um chat simples para gerenciar essa conexão entre host e guests."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Host Creates a Room (Priority: P1)

A user acts as host and creates a room. The host's unique identifier becomes the room's address that guests can use to connect. Once the room is created, the host is ready to receive messages from guests and see the chat.

**Why this priority**: This is the foundational entry point — without a room, no connection or messaging is possible. All other stories depend on this one.

**Independent Test**: A user opens the app, creates a room, and can see an empty chat with the room's join identifier displayed. The host can verify the room is active and waiting for guests.

**Acceptance Scenarios**:

1. **Given** a logged-in user is on the home page, **When** they choose to create a room, **Then** a room is created with a unique identifier and the user becomes the host of that room.
2. **Given** the host has created a room, **When** the host views the room, **Then** they see the chat interface with their room's join ID clearly visible.
3. **Given** a room is created, **When** the host sends a message, **Then** the message is saved and visible in the chat.

---

### User Story 2 - Guest Joins an Existing Room (Priority: P2)

A user acts as guest and connects to an existing room by entering the host's unique room identifier. Upon joining, the guest immediately receives the full current message history so they are caught up with all prior conversation.

**Why this priority**: Guest connection is the second essential capability — it enables the multi-user aspect of the feature.

**Independent Test**: With a room already created by a host, a second user enters the host's room ID and joins the room. They can see all messages that existed before they joined.

**Acceptance Scenarios**:

1. **Given** a room exists with messages, **When** a guest enters the room's identifier and joins, **Then** the guest is connected to the room and sees all existing messages.
2. **Given** a guest is connected, **When** the host has not yet processed any messages, **Then** the guest sees an empty chat ready to receive messages.
3. **Given** a guest enters an invalid or non-existent room ID, **When** they attempt to join, **Then** the system informs them the room was not found and no connection is established.

---

### User Story 3 - Real-Time Chat Between Host and Guests (Priority: P3)

Once host and guests are connected in the same room, all participants can exchange messages in real time. The host processes each incoming message and broadcasts the processed state back to all connected guests.

**Why this priority**: Real-time messaging is the core value of the room feature; however it requires both P1 and P2 to be in place first.

**Independent Test**: With a host and at least one guest in a room, a guest sends a message. The host receives it, processes it, and the message appears in the chat for all participants including the sender.

**Acceptance Scenarios**:

1. **Given** a host and at least one guest are in the same room, **When** a guest sends a message, **Then** the message is received and processed by the host and the updated chat history is delivered to all connected guests.
2. **Given** multiple guests are connected, **When** any guest sends a message, **Then** all connected guests (and the host) see the new message.
3. **Given** a guest is in a room, **When** the host sends a message, **Then** all guests receive and display the host's message.

---

### User Story 4 - Guest Reconnects and Recovers State (Priority: P4)

A guest who disconnects and reconnects to a room recovers the full current chat state from the host immediately upon rejoining, without missing any messages that occurred during the disconnection.

**Why this priority**: State recovery is important for reliability but not required for the MVP. It extends P2 with resilience.

**Independent Test**: A guest joins a room, disconnects, new messages are exchanged, then the guest reconnects. The guest sees all messages including those sent during their absence.

**Acceptance Scenarios**:

1. **Given** a guest disconnects from an active room, **When** they rejoin using the same room ID, **Then** they receive the complete current message history.
2. **Given** a guest reconnects, **When** they receive the current state, **Then** the chat is indistinguishable from one that never disconnected.

---

### Edge Cases

- What happens when the host closes or leaves the room while guests are connected?
- How does the system handle a guest sending a message if the connection to the host is temporarily lost?
- What happens when two users try to join a room simultaneously?
- How does the system handle very long messages or a very large number of messages in the history?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create a room, becoming the host of that room.
- **FR-002**: Each room MUST have a unique identifier that guests can use to connect.
- **FR-003**: Users MUST be able to join a room by entering its unique identifier, becoming a guest.
- **FR-004**: The host MUST be the sole processor of all incoming data within a room; guests only receive processed output.
- **FR-005**: When a guest joins a room, the system MUST deliver the complete current message history to them.
- **FR-006**: Guests MUST be able to send messages to the host.
- **FR-007**: The host MUST broadcast the updated message state to all connected guests after processing each message.
- **FR-008**: The host MUST be able to send messages visible to all guests.
- **FR-009**: The system MUST notify the user if a room with the provided identifier does not exist.
- **FR-010**: The room state (message history) MUST be maintained in the host's memory for the duration of the session.

### Key Entities

- **Room**: Represents a communication session; has a unique identifier, a host, and a list of connected guests.
- **Message**: A unit of communication in the chat; has content, a sender identifier, and a timestamp.
- **Host**: A user who owns and manages a room; responsible for processing all messages and maintaining state.
- **Guest**: A user who connects to a room via the room's identifier; receives processed state from the host.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A host can create a room and receive the join identifier in under 5 seconds.
- **SC-002**: A guest can join a room and view the full message history within 3 seconds of submitting the room ID.
- **SC-003**: Messages sent by any participant appear in all connected participants' chat views within 2 seconds.
- **SC-004**: A guest who reconnects to an active room receives the complete current state within 3 seconds.
- **SC-005**: 100% of messages sent by guests are processed by the host and reflected in the shared chat state.

## Assumptions

- Users are already identified in the system (relies on the existing user identification, 001-user-identification).
- The room session is ephemeral: room state persists only as long as the host is connected; there is no persistent storage of rooms or messages across sessions.
- Only one host per room is supported; the first user to create a room is always the host.
- The number of concurrent guests per room is not bounded for this feature version.
- Message content is plain text only; rich media (images, files) is out of scope.
- The host and guests communicate over a peer-to-peer connection facilitated by the existing application infrastructure (GunDB/RPC layer already in the project).
- Mobile-specific optimizations are out of scope for this version.
