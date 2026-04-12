# Data Model: Identificação do Jogador (Quick Start)

**Branch**: `001-user-identification` | **Date**: 2026-04-12

---

## Entity: User

Representa a identidade de um jogador, criada no primeiro acesso e persistida localmente no dispositivo.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | `string` | Yes | uuidv4, imutável após criação | Gerado automaticamente. Nunca sobrescrito |
| `displayName` | `string` | Yes | não vazio, não apenas espaços | Nome de exibição escolhido pelo jogador |
| `pictureUrl` | `string` | No | qualquer string; sem validação de URL | URL da foto de perfil. Valor vazio `""` quando não fornecido |

### TypeScript Interface (updated)

```typescript
// src/entities/user/model/user.ts
export interface IUser {
  id: string
  displayName: string
  pictureUrl: string
}
```

### State Transitions

```
[sem dados]
    │
    ▼  (createUser chamado com displayName + pictureUrl)
[Identificado]
    │
    ▼  (saveUser chamado com displayName/pictureUrl atualizados)
[Identificado - dados atualizados, id preservado]
```

### Invariants

1. `id` is generated once via `uuidv4` and NEVER overwritten
2. `displayName` must be non-empty after trimming whitespace
3. `pictureUrl` is always a `string` (never `undefined` or `null`)
4. Once set, `id` survives page reloads via `localStorage`

---

## Storage

**Mechanism**: `localStorage` (browser-native, client-side only)  
**Key**: `"local-user"`  
**Format**: JSON-serialized `IUser`  
**Persistence**: Until the user manually clears browser storage

```typescript
// Stored shape example
{
  "id": "a5s12da8-s4d8-4a8s-d48a-sd48asd",
  "displayName": "Matheus",
  "pictureUrl": "https://example.com/avatar.png"
}
```

---

## Hook Interface (updated)

```typescript
// src/entities/user/model/use-user.ts
export const useUser = () => {
  return {
    user: IUser | null | undefined,
    saveUser: (displayName: string, pictureUrl: string) => void
    // saveUser: preserves id if user already exists; generates new id for first-time
  }
}
```

**Note**: `createUser` and `updateUser` are merged into a single `saveUser` for simplicity (FR-005, FR-006). The function internally checks if a user with an id already exists in the store before generating a new id.

---

## Shared UI Components

> **Estilização**: SCSS Modules (`.module.scss` co-localizado a cada componente). Variáveis de cor centralizadas em `src/shared/ui/_variables.scss`.

```scss
// src/shared/ui/_variables.scss
$color-bg:            #3d3a8e;
$color-card-bg:       #ffffff;
$color-primary:       #3d3a8e;
$color-primary-hover: #2e2b6e;
$color-accent:        #6c68c5;
$color-input-border:  #c4c2e8;
$color-input-focus:   #6c68c5;
$color-text:          #1a1a2e;
$color-error:         #dc2626;
```

### `shared/ui/card.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Card content |

Visual: white background, rounded corners (12px), subtle box shadow, centered on page.

### `shared/ui/input.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | `string` | Input placeholder text |
| `value` | `string` | Controlled value |
| `onChange` | `(value: string) => void` | Change handler |
| `type` | `"text" \| "url"` | Input type (default: `"text"`) |
| `required` | `boolean` | HTML required attribute |
| `error` | `string \| undefined` | Validation error message |

Visual: full-width, rounded border (`#c4c2e8`), focus ring in accent purple (`#6c68c5`), padding 12px.

### `shared/ui/button.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Button label |
| `type` | `"button" \| "submit"` | Button type |
| `onClick` | `() => void \| undefined` | Optional click handler |
| `disabled` | `boolean` | Disabled state |

Visual: full-width, deep purple background (`#3d3a8e`), white text, rounded (8px), hover darkens to `#2e2b6e`.
