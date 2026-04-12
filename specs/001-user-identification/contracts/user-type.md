# Contract: User Type

**Feature**: `001-user-identification`  
**Type**: Internal domain type contract  
**Scope**: `src/entities/user/` — public API exposed via `index.ts` barrel

---

## Public API (barrel exports)

```typescript
// src/entities/user/index.ts — UPDATED
export { useUser } from "./model/use-user"
export type { IUser } from "./model/user"
```

Other modules in the application MUST import from this barrel only. Direct imports to internal paths (e.g., `entities/user/model/user-store`) are prohibited by FSD rules.

---

## IUser Type Contract

```typescript
interface IUser {
  id: string         // uuidv4, immutable after creation
  displayName: string  // non-empty, user-chosen name
  pictureUrl: string   // URL string or empty string ""
}
```

**Constraints**:
- `id`: Never an empty string after user creation. Never changes.
- `displayName`: Never an empty string after user creation. May be updated.
- `pictureUrl`: May be empty string `""` if user did not provide a photo.

---

## useUser Hook Contract

```typescript
interface UseUserReturn {
  user: IUser | null | undefined
  // null: user checked localStorage, no user found
  // undefined: user check not yet completed (initial render)
  saveUser: (displayName: string, pictureUrl: string) => void
}
```

**Side effects**:
- `saveUser` writes to `localStorage["local-user"]`
- `saveUser` updates Zustand store state
- If `user.id` already exists in store, the existing id is reused; a new id is NEVER generated for an existing user

---

## Route Contract

| Route | Behavior | Guard |
|-------|----------|-------|
| `/quick-start` | Identification form | If `user?.displayName` exists → redirect to `/` |
| `/` (and all other routes) | App content | If `!user?.displayName` → redirect to `/quick-start` |

**Note**: Guard is evaluated after the initial `localStorage` read. A loading state is shown during the async check to prevent flash redirects.
