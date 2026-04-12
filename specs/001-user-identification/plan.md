# Implementation Plan: Identificação do Jogador (Quick Start)

**Branch**: `001-user-identification` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-user-identification/spec.md`

## Summary

Adicionar a rota `/quick-start` como ponto de entrada obrigatório para novos visitantes. O sistema redireciona qualquer usuário sem `displayName` salvo para essa rota. A página exibe o formulário de identificação com nome (obrigatório) e foto (opcional), mostrando o UID único do usuário. Ao salvar, o `id` (uuidv4) é preservado e o usuário é redirecionado para `/`. A entidade `User` recebe o campo `pictureUrl`. Componentes primitivos de UI devem ser criados em `shared/ui/` com as cores da referência visual. Testes unitários serão escritos com Vitest + Testing Library.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode)  
**Primary Dependencies**: React 19, React Router v7, Zustand 5, `uuid` v11  
**Storage**: `localStorage` via `user-repository.ts` (já implementado)  
**Testing**: Vitest + `@testing-library/react` + `@testing-library/user-event` (a instalar)  
**Styling**: SCSS Modules — arquivos `.module.scss` co-localizados, variáveis em `shared/ui/_variables.scss`; instalar `sass` devDependency  
**Target Platform**: Browser — static file host (GitHub Pages / Netlify / Vercel)  
**Project Type**: Web application (SPA), serverless-first  
**Performance Goals**: Renders visíveis em <100ms; sem chamadas de rede  
**Constraints**: Offline-capable; sem backend; sem autenticação por senha  
**Scale/Scope**: UI de 1 página nova, 1 entidade atualizada, 3–5 componentes shared/ui

## Constitution Check

*GATE: Must pass before Phase 0 research.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Free for End Users | ✅ PASS | Nenhuma monetização envolvida |
| II. Serverless-First | ✅ PASS | Dados persistidos apenas em `localStorage`; zero infraestrutura de servidor |
| III. P2P Connectivity | ✅ PASS | Feature não envolve conectividade P2P |
| IV. Open Source & Transparency | ✅ PASS | Sem tracking/telemetria; nenhuma nova dependência fechada |
| V. Simplicity Over Feature Parity | ✅ PASS | Apenas o necessário: 1 página, 1 formulário, 2 campos |
| VI. Clean Code Standards | ✅ PASS | Nomes intencionais, sem `any`, funções pequenas planejadas |
| VII. Feature Sliced Design | ✅ PASS | `shared/ui` → `entities/user` → `pages/quick-start` (importações top-down) |

**Constitution Check Post-Design**: Re-verificado após Phase 1 — PASS em todos os princípios.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-identification/
├── plan.md              ← este arquivo
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── user-type.md     ← Phase 1 output
└── tasks.md             ← gerado por /speckit.tasks (não criado aqui)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── router.tsx                        ← MODIFY: add /quick-start route + redirect guard
├── entities/
│   └── user/
│       ├── index.ts                      ← MODIFY: export updateUser
│       ├── api/
│       │   └── user-repository.ts       ← NO CHANGE (localStorage already works)
│       └── model/
│           ├── user.ts                  ← MODIFY: add pictureUrl field
│           ├── user-store.ts            ← NO CHANGE
│           └── use-user.ts              ← MODIFY: add pictureUrl to createUser; preserve id
├── pages/
│   ├── quick-start/
│   │   └── index.tsx                    ← CREATE: QuickStartPage
│   └── register/
│       └── index.tsx                    ← KEEP (legacy, replaced by quick-start flow)
└── shared/
    ├── config/
    │   └── routes.ts                    ← MODIFY: add ROUTES.quickStart
    └── ui/
        ├── button.tsx                   ← CREATE
        ├── input.tsx                    ← CREATE
        └── card.tsx                     ← CREATE

src/__tests__/ (or co-located *.test.ts)
├── entities/user/model/use-user.test.ts ← CREATE
├── entities/user/api/user-repository.test.ts ← CREATE
└── pages/quick-start/index.test.tsx     ← CREATE
```

**Structure Decision**: Single-project FSD layout. A página `/quick-start` fica em `pages/`, os primitivos visuais em `shared/ui/`, a lógica de identidade permanece em `entities/user/`. Nenhuma camada infringe as regras de importação FSD.

## Complexity Tracking

> Nenhuma violação constitucional identificada. Seção não aplicável.

