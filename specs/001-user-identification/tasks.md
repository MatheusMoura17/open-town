# Tasks: Identificação do Jogador (Quick Start)

**Input**: Design documents from `/specs/001-user-identification/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tech Stack**: TypeScript 5.9 · React 19 · React Router v7 · Zustand 5 · uuid v11 · SCSS Modules · Vitest + Testing Library

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure test/style tooling before any feature code is written

- [X] T001 Install `sass` devDependency: `yarn add -D sass` (enables `.module.scss` in Vite)
- [X] T002 [P] Install test devDependencies: `yarn add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`
- [X] T003 Add `test` section to `vite.config.js`: `environment: 'jsdom'`, `globals: true`, `setupFiles: ['./src/test-setup.ts']`
- [X] T004 Create `src/test-setup.ts` with `import '@testing-library/jest-dom'`
- [X] T005 Add `"test": "vitest"` script to `package.json`

**Checkpoint**: `yarn test` runs without errors; Vite processes `.scss` files without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that all user stories depend on — MUST be complete before any story phase begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create `src/shared/ui/_variables.scss` with all color tokens (`$color-bg`, `$color-card-bg`, `$color-primary`, `$color-primary-hover`, `$color-accent`, `$color-input-border`, `$color-input-focus`, `$color-text`, `$color-error`)
- [X] T007 [P] Create `src/shared/ui/button.tsx` and `src/shared/ui/button.module.scss` — full-width primary button with deep purple background (`$color-primary`), white text, rounded (8px), hover → `$color-primary-hover`
- [X] T008 [P] Create `src/shared/ui/input.tsx` and `src/shared/ui/input.module.scss` — controlled input with `placeholder`, `value`, `onChange`, optional `error` prop; border `$color-input-border`, focus ring `$color-input-focus`
- [X] T009 [P] Create `src/shared/ui/card.tsx` and `src/shared/ui/card.module.scss` — white card (`$color-card-bg`), rounded (12px), box shadow, centered on page
- [X] T010 Update `src/entities/user/model/user.ts`: add `pictureUrl: string` to `IUser` interface
- [X] T011 Update `src/shared/config/routes.ts`: add `quickStart: "/quick-start"` to the `ROUTES` constant

**Checkpoint**: All shared UI components render; `IUser` has `pictureUrl`; `ROUTES.quickStart` is defined

---

## Phase 3: User Story 1 — Identificação na primeira visita (Priority: P1) 🎯 MVP

**Goal**: New visitor without saved identity is redirected to `/quick-start`, fills in name + photo, and is sent to `/` after saving

**Independent Test**: Open app with empty localStorage → verify redirect to `/quick-start` → fill form → submit → verify redirect to `/` and data in localStorage

### Tests for User Story 1

- [X] T012 [P] [US1] Create `src/entities/user/api/user-repository.test.ts`: test `saveUserFromRepo` persists to `localStorage`; `getUserFromRepo` returns `null` when empty; returns saved user
- [X] T013 [P] [US1] Create `src/entities/user/model/use-user.test.ts`: test `saveUser` generates new id on first call; preserves id on second call; updates `displayName` and `pictureUrl`
- [X] T014 [P] [US1] Create `src/pages/quick-start/index.test.tsx`: test page renders form when no user; shows UID; rejects empty name submission; calls `saveUser` with correct args on valid submit

### Implementation for User Story 1

- [X] T015 [US1] Update `src/entities/user/model/use-user.ts`: rename `createUser` → `saveUser(displayName: string, pictureUrl: string)` — preserve existing `id` if user already exists in store; generate new uuidv4 only when no id exists
- [X] T016 [US1] Update `src/entities/user/index.ts`: export `saveUser` from public barrel (remove `createUser` export)
- [X] T017 [US1] Create `src/pages/quick-start/index.tsx` and `src/pages/quick-start/index.module.scss`: page with page-background (`$color-bg`), Card component, title "Identifique-se para continuar", UID display (accent color), Input for `displayName` (required), Input for `pictureUrl` (optional), Button "Salvar"; on submit calls `saveUser` then navigates to `"/"`; if `user?.displayName` exists → `<Navigate to="/" replace />`
- [X] T018 [US1] Update `src/app/router.tsx`: add `<Route path={ROUTES.quickStart} element={<QuickStartPage />} />`; replace `RegisterWrapper` with `AuthGuard` component that emits `<Navigate to={ROUTES.quickStart} replace />` when `!user?.displayName` (after localStorage load completes)

**Checkpoint**: US1 fully functional — new visitor flow works end-to-end; all T012–T014 tests pass

---

## Phase 4: User Story 2 — Retorno de usuário já identificado (Priority: P2)

**Goal**: Returning visitor with saved identity is sent directly to `/` and never sees `/quick-start` again

**Independent Test**: Set valid user in localStorage → open app → verify no redirect to `/quick-start`; navigate directly to `/quick-start` → verify redirect to `/`

### Tests for User Story 2

- [X] T019 [P] [US2] Extend `src/pages/quick-start/index.test.tsx`: test that page redirects to `/` when `user.displayName` is already set
- [X] T020 [P] [US2] Extend `src/app/router.test.tsx` (create if needed): test `AuthGuard` does NOT redirect when user has `displayName`; test `AuthGuard` redirects to `/quick-start` when `displayName` is absent

### Implementation for User Story 2

- [X] T021 [US2] Verify `AuthGuard` in `src/app/router.tsx` correctly handles the returning-user case (no redirect when `user?.displayName` is truthy) — confirm this works with tests from T020

**Checkpoint**: US1 + US2 both pass — both new and returning users experience correct routing

---

## Phase 5: User Story 3 — Visualização do ID na tela de identificação (Priority: P3)

**Goal**: User sees their UID displayed on `/quick-start` before and after saving — ID never changes

**Independent Test**: Open `/quick-start` → verify UID element is visible in DOM; submit form → verify UID in page matches UID stored in localStorage

### Tests for User Story 3

- [X] T022 [P] [US3] Add test to `src/pages/quick-start/index.test.tsx`: UID is visible on page load; UID shown matches the id that is eventually saved to localStorage after form submission

### Implementation for User Story 3

- [X] T023 [US3] Verify `QuickStartPage` uses a stable UID: generate a temporary id with `generateId()` on first render (using `useState` + lazy initializer) so UID is shown before save; this same id is passed to `saveUser` — confirm UID displayed matches stored id (already part of T017 implementation, verify via test T022)

**Checkpoint**: All 3 user stories pass. UID is visible and stable across form interaction.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and export hygiene after all stories are complete

- [X] T024 [P] Create `src/shared/ui/index.ts` barrel file exporting `Button`, `Input`, `Card`
- [X] T025 [P] Remove `src/pages/register/index.tsx` if no longer referenced anywhere (verify with `grep` before deleting)
- [X] T026 Run `yarn lint` and fix any ESLint violations introduced by this feature
- [X] T027 Run `yarn test` and confirm all tests pass with no failures

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    └─► Phase 2 (Foundational) — BLOCKS all user stories
            ├─► Phase 3 (US1 - P1) 🎯 MVP
            │       └─► Phase 4 (US2 - P2)
            │               └─► Phase 5 (US3 - P3)
            └─► Phase 6 (Polish) — after all desired stories done
```

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|-----------|----------------------|
| US1 (P1) | Phase 2 complete | — |
| US2 (P2) | Phase 2 + US1 AuthGuard (T018) | US3 tests |
| US3 (P3) | Phase 2 + QuickStartPage (T017) | US2 tests |

### Parallel Opportunities Within Phases

- **Phase 1**: T001 + T002 can run in parallel (different packages)
- **Phase 2**: T007 + T008 + T009 can all run in parallel (different files)
- **Phase 3 tests**: T012 + T013 + T014 can run in parallel (different files)
- **Phase 4 tests**: T019 + T020 can run in parallel
- **Phase 6**: T024 + T025 + T026 can run in parallel

---

## Parallel Example: Phase 3 (US1)

```bash
# After Phase 2 is complete, start these in parallel:
# Worker A:
T012 → T015 → T018

# Worker B (parallel):
T013

# Worker C (parallel):
T014 → T017
# T016 unblocked after T015
```

---

## Implementation Strategy

**MVP Scope** (minimum to deliver value): Complete **Phase 1 + Phase 2 + Phase 3 (US1)** only.
- This gives a working identification flow with the correct UI, routing, and tests.
- US2 and US3 are incremental additions that can follow in order.

**Suggested delivery order**: T001–T027 sequentially (solo developer), or parallel as mapped above (team).

**Test approach**: Tests (T012–T014) are written before implementation (T015–T018) within US1 — TDD for the core logic.

---

## Task Count Summary

| Phase | Tasks | User Story |
|-------|-------|-----------|
| Phase 1 — Setup | 5 | — |
| Phase 2 — Foundational | 6 | — |
| Phase 3 — US1 (P1) | 7 | US1 |
| Phase 4 — US2 (P2) | 3 | US2 |
| Phase 5 — US3 (P3) | 2 | US3 |
| Phase 6 — Polish | 4 | — |
| **Total** | **27** | |

**Parallel opportunities identified**: 10 tasks marked `[P]`  
**MVP scope**: Phase 1–3 (18 tasks)
