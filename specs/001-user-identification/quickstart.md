# Quick Start Guide: Identificação do Jogador

**Feature**: `001-user-identification` | **Branch**: `001-user-identification`

---

## Overview

Esta feature adiciona a rota `/quick-start` como ponto de entrada obrigatório para novos visitantes. O fluxo de identificação substitui o `RegisterPage` inline atual por uma rota real com design fiel à referência visual.

---

## 1. Instalar SCSS

```bash
yarn add -D sass
```

O Vite suportará automaticamente arquivos `.scss` e `.module.scss` após a instalação.

---

## 2. Instalar dependências de teste

```bash
yarn add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

---

## 3. Configurar Vitest em `vite.config.js`

Adicionar a seção `test` ao arquivo de configuração existente:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

Criar `src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

Adicionar script no `package.json`:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

---

## 4. Criar componentes shared/ui

Cada componente terá um arquivo `.module.scss` co-localizado:

```text
src/shared/ui/
├── button.tsx
├── button.module.scss
├── card.tsx
├── card.module.scss
├── input.tsx
└── input.module.scss
```

As variáveis de cor SCSS serão definidas em `src/shared/ui/_variables.scss` e importadas pelos módulos.

> Ver especificações visuais em [data-model.md](./data-model.md).

---

## 5. Atualizar entidade User

1. Adicionar `pictureUrl: string` ao `IUser` em `src/entities/user/model/user.ts`
2. Atualizar `use-user.ts`: renomear `createUser` → `saveUser(displayName, pictureUrl)`, preservar `id` existente
3. Atualizar `src/entities/user/index.ts`: exportar `saveUser`

---

## 6. Criar página QuickStart

**Arquivo**: `src/pages/quick-start/index.tsx`

Comportamento:
- Se usuário já tem `displayName` → `<Navigate to="/" replace />`
- Exibe o UID do usuário no topo (gerado antecipadamente para exibição)
- Formulário com 2 campos: nome (obrigatório) e URL da foto (opcional)
- Ao submeter: chama `saveUser`, redireciona para `"/"`

---

## 7. Atualizar rotas

**`src/shared/config/routes.ts`**: adicionar `quickStart: "/quick-start"`

**`src/app/router.tsx`**:
- Remover `RegisterWrapper` inline
- Adicionar `<Route path="/quick-start" element={<QuickStartPage />} />`
- Adicionar componente `AuthGuard` que emite `<Navigate to="/quick-start" replace />` quando `!user?.displayName`

---

## 8. Escrever testes

### `user-repository.test.ts`
- `saveUserFromRepo` persiste corretamente em `localStorage`
- `getUserFromRepo` retorna `null` quando não persistido
- `getUserFromRepo` retorna o usuário salvo

### `use-user.test.ts`
- `saveUser` gera novo ID na primeira chamada
- `saveUser` preserva o ID existente na segunda chamada
- `saveUser` atualiza o `displayName`

### `quick-start/index.test.tsx`
- Exibe o formulário quando usuário não tem `displayName`
- Exibe o UID na tela
- Não permite submeter com nome vazio
- Redireciona para `/` após submissão válida

---

## Colors Reference

| Token | Value |
|-------|-------|
| Page background | `#3d3a8e` |
| Card background | `#ffffff` |
| Title / button | `#3d3a8e` |
| Button hover | `#2e2b6e` |
| Accent / UID text | `#6c68c5` |
| Input border | `#c4c2e8` |
| Input focus border | `#6c68c5` |
| Error text | `#dc2626` |
