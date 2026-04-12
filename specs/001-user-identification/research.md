# Research: Identificação do Jogador (Quick Start)

**Branch**: `001-user-identification` | **Date**: 2026-04-12

All NEEDS CLARIFICATION markers from Technical Context were resolved through codebase inspection and user-provided reference image.

---

## Decision 1: Test Framework

**Decision**: Vitest + `@testing-library/react` + `@testing-library/user-event` + `jsdom`

**Rationale**: Vitest é o runner de testes padrão para projetos Vite. Integra-se nativamente com `vite.config.js` sem configuração adicional de transpiler. `@testing-library/react` é a escolha canônica para testar componentes React de forma orientada ao comportamento do usuário (não à implementação interna). O ambiente `jsdom` emula o DOM do navegador, necessário para `localStorage` e eventos de formulário.

**Alternatives considered**:
- Jest: Requer transformação extra para ESM/TypeScript em projetos Vite. Mais configuração, sem benefício adicional.
- Cypress/Playwright (E2E): Fora do escopo de testes unitários solicitados. Pode ser adicionado como camada complementar futura.

**Packages to install** (devDependencies):
```
vitest
@testing-library/react
@testing-library/user-event
@testing-library/jest-dom
jsdom
```

**Config addition to `vite.config.js`**:
```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test-setup.ts'],
}
```

---

## Decision 2: Cores e design visual (referência da imagem)

**Decision**: Paleta extraída da imagem de referência entregue pelo usuário

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#3d3a8e` | Fundo da página (roxo profundo/índigo) |
| `--color-card-bg` | `#ffffff` | Fundo do card central |
| `--color-primary` | `#3d3a8e` | Texto de título e botão principal |
| `--color-primary-hover` | `#2e2b6e` | Hover do botão |
| `--color-accent` | `#6c68c5` | UID text, links, labels secundários |
| `--color-input-border` | `#c4c2e8` | Borda dos inputs |
| `--color-input-focus` | `#6c68c5` | Borda com foco |
| `--color-text` | `#1a1a2e` | Texto principal |
| `--color-error` | `#dc2626` | Mensagens de validação |

**Rationale**: O usuário explicitamente afirmou que as cores são importantes e devem ser mantidas. Os valores foram amostrados da imagem de referência. O estilo usa CSS inline/classes utilitárias via Tailwind ou CSS puro — dado que o projeto não tem Tailwind instalado, os estilos serão aplicados via `style` props inline ou CSS Modules simples.

**Alternatives considered**:
- Tailwind CSS: Não está instalado no projeto. Adicionar apenas para esta feature seria desproporcionalmente complexo (Princípio V).
- CSS-in-JS (styled-components, emotion): Não é a stack do projeto.
- CSS inline: Descartado. O usuário especificou SCSS como abordagem de estilização.
- **Solução adotada**: SCSS com arquivos `.module.scss` co-localizados aos componentes. O Vite suporta SCSS nativamente após instalar `sass` como devDependency.

---

## Decision 3: Estratégia de redirecionamento para /quick-start

**Decision**: Guard component no `Router` que verifica `user?.displayName` e redireciona via `<Navigate>` do React Router v7

**Rationale**: O projeto já usa `RegisterWrapper` que mostra `RegisterPage` inline quando o usuário não está identificado. Este padrão será refatorado para usar navegação real: a rota `/quick-start` será uma rota pública e todos as outras rotas serão envoltas por um `<AuthGuard>` que emite `<Navigate to="/quick-start" replace />` quando sem `displayName`. A rota `/quick-start` também verifica o inverso: se o usuário já possui `displayName`, redireciona para `/`.

**Alternatives considered**:
- Manter o `RegisterWrapper` com renderização inline (sem navegar): Não cumpre FR-001, pois a URL não muda para `/quick-start`.
- Middleware de router (loader do React Router v7): Mais complexo, requer `createBrowserRouter`. O projeto usa `<HashRouter>` declarativo; manter consistência é preferível (Princípio V).

---

## Decision 4: Adição do campo pictureUrl ao IUser

**Decision**: Adicionar `pictureUrl: string` à interface `IUser` (campo opcional no formulário, mas sempre presente no tipo como string — vazio `""` quando não fornecido)

**Rationale**: A spec define `{ id, displayName, pictureUrl }` como o shape exato da entidade User. O campo é opcional no formulário (FR-004), mas o tipo TypeScript deve ser completo. O valor padrão quando não preenchido será string vazia `""`, evitando `undefined` que complicaria null-checks no resto da aplicação.

**Alternatives considered**:
- `pictureUrl?: string` (opcional no tipo): Requereria null checks em toda renderização de avatar. Como o campo estará sempre presente após o save, é mais limpo como `string`.
- Validar URL com regex: Spec FR define que qualquer string é aceita. Nenhuma validação de URL será adicionada.

---

## Decision 5: Preservação do ID ao atualizar perfil

**Decision**: Separar `createUser` e `updateUser` no hook `use-user`. `createUser` gera o `id`; `updateUser` preserva o `id` existente

**Rationale**: FR-006 é explícito: o ID jamais deve ser sobrescrito. O hook atual não tem mecanismo de update. A solução mais simples é: se já existe um usuário no store/localStorage, o id existente é sempre reutilizado na operação de save.

**Alternatives considered**:
- Usar apenas `createUser` e sempre gerar novo ID: Viola FR-006.
- Separar em dois hooks: Desnecessário. Uma função `saveUser` que detecta se o usuário já tem id é suficiente.
