<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.2.0
Modified principles: none
Added principles:
  - VI. Clean Code Standards (new)
  - VII. Feature Sliced Design Architecture (new)
Added sections: none
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ aligned (Constitution Check gate covers new principles)
  - .specify/templates/spec-template.md ✅ aligned
  - .specify/templates/tasks-template.md ✅ aligned (layer-based task grouping compatible with FSD phases)
Deferred TODOs: none
-->

# Open Town Constitution

## Core Principles

### I. Free for End Users (NON-NEGOTIABLE)

The platform MUST always be free for end users without exception.
No paid tiers, paywalls, subscription gates, or premium feature locks
that restrict any core functionality are permitted. Revenue models that
exploit user data, sell access to coworking rooms, or introduce
first/second-class user experiences are prohibited. Any feature that
cannot be provided free of cost to end users MUST NOT be built.

**Rationale**: This is the primary reason Open Town exists as a
Gather.town alternative. Compromising it invalidates the project's mission.

### II. Serverless-First (NON-NEGOTIABLE)

The platform MUST NOT depend on any server-side infrastructure owned or
operated by the project for core functionality. All features MUST be
deliverable through static file hosting alone. No project-operated
databases, authentication servers, session management services, or
relay servers are permitted. Features requiring backend infrastructure
MUST be rejected or redesigned to use client-side and P2P alternatives.

**Rationale**: Eliminating server costs is what makes Principle I
sustainable indefinitely without funding.

### III. Peer-to-Peer Connectivity

Room hosting and participant connections MUST use public P2P protocols
(WebRTC via PeerJS). The application MUST rely exclusively on public
STUN/TURN infrastructure. No proprietary relay infrastructure controlled
by the project is permitted for core connectivity. Connection signaling
MAY use public PeerJS cloud servers or self-hosted open-source signaling
servers contributed by the community.

**Rationale**: P2P architecture is the technical enabler of the serverless
constraint. It distributes hosting costs to participants themselves.

### IV. Open Source & Transparency

All source code MUST remain open source under the MIT license. Closed-source
forks containing core features are prohibited for official releases.
Dependencies MUST be open source or have permissive licenses compatible
with MIT. No tracking, telemetry, or analytics code MUST be included
without explicit, informed, opt-in consent from the user.

**Rationale**: Trust is critical for a platform handling real-time
audio/video/presence data. Open source is the only credible guarantee.

### V. Simplicity Over Feature Parity

Feature parity with Gather.town is NOT a goal. Every new feature MUST be
justified by genuine user need, not competitive completeness. YAGNI
(You Aren't Gonna Need It) MUST be applied at every design decision.
Prefer simple, working implementations over complex, extensible architectures.
Abstractions MUST only be introduced when the same logic is needed in three
or more places.

**Rationale**: Complexity is the primary risk to long-term maintainability
in a community-driven open source project with no dedicated engineering team.

### VI. Clean Code Standards

All source code MUST follow clean code principles throughout the codebase:

- **Naming**: Variables, functions, and types MUST use intention-revealing names.
  Abbreviations and single-letter identifiers (except conventional loop counters)
  are prohibited. Boolean names MUST read as predicates (`isConnected`, `hasRoom`).
- **Functions**: Functions MUST do one thing. Functions exceeding 30 lines of
  meaningful logic SHOULD be decomposed. Side effects MUST be explicit in the
  function name or co-located with a comment.
- **No magic values**: All literals with domain meaning MUST be named constants.
- **No dead code**: Commented-out code blocks MUST NOT be committed. Use version
  control history instead.
- **No implicit any**: TypeScript's `any` type MUST NOT be used. Use `unknown`
  with type guards, or define proper interfaces.
- **Consistent formatting**: Code MUST pass ESLint with the project's ruleset
  before merging. Formatting disputes are resolved by the linter, not by debate.
- **DRY within reason**: Logic duplicated in three or more places MUST be
  extracted. Premature abstraction of logic appearing in fewer than three places
  MUST be avoided.

**Rationale**: Open source projects accumulate contributors over time. Consistent
clean code standards reduce onboarding friction and prevent entropy without
requiring a dedicated code review culture.

### VII. Feature Sliced Design Architecture

The frontend source code MUST be organized following the
[Feature Sliced Design](https://feature-sliced.design/) methodology. The layer
hierarchy is strictly enforced top-to-bottom:

```
app/       → Application bootstrap, providers, global router
pages/     → Full route-level compositions (no business logic)
widgets/   → Composite UI blocks reused across multiple pages
features/  → User-facing interactions and use-case slices
entities/  → Business domain models, stores, and domain UI
shared/    → Reusable infrastructure: UI kit, lib utilities, config, API clients
```

Layer import rules (MUST be enforced):
- A layer MAY only import from layers **below** it in the hierarchy.
- Cross-slice imports within the same layer are PROHIBITED (e.g., one
  `feature/` slice MUST NOT import from another `feature/` slice directly;
  use `shared/` or lift to `widgets/` instead).
- Each slice MUST expose its public API exclusively through an `index.ts`
  barrel file. Internal module paths MUST NOT be imported from outside
  the slice.
- Business logic MUST reside in `entities/` or `features/`, never in
  `pages/` or `widgets/`.

**Rationale**: FSD provides an explicit, scalable boundary model that prevents
the circular dependency and "big ball of mud" patterns common in long-lived
React codebases. It also aligns naturally with the feature-spec workflow.

## Technology Stack Constraints

The following stack is established and MUST be used for all new features
unless a constitutional amendment explicitly permits a change:

- **Runtime**: Browser-only (no Node.js runtime in production)
- **Language**: TypeScript 5 (strict mode MUST be enabled)
- **UI Framework**: React 19
- **State Management**: Zustand (no Redux, no MobX)
- **Routing**: React Router v7
- **P2P Layer**: PeerJS (WebRTC abstraction)
- **Build Tool**: Vite
- **Package Manager**: Yarn (as indicated by repository config)
- **Hosting Target**: Any static file host (GitHub Pages, Netlify, Vercel
  free tier, self-hosted nginx — all MUST work without server-side config)

Third-party services that charge per-user fees or require project account
credentials to function MUST NOT be introduced as runtime dependencies.

## Development Workflow

- Features MUST be described in a spec before implementation begins.
- Each spec MUST include at least one independently testable user story
  that delivers value as a standalone slice.
- All new P2P-dependent features MUST be manually verified with at least
  two browser instances (host + guest) before merging.
- No feature that breaks the free-to-all-users guarantee, serverless
  constraint, or open source license MAY be merged to the main branch.
- Breaking changes to the room connection protocol MUST be documented
  and backward-compatibility considered before release.

## Governance

This constitution supersedes all other practices, conventions, and
preferences documented elsewhere in the project. Amendments require:

1. A written proposal describing the change and its rationale.
2. Explicit justification for why the change does not violate
   Principles I or II (Free & Serverless), which are NON-NEGOTIABLE.
3. A version bump following semantic versioning:
   - **MAJOR**: Removal or redefinition of a principle.
   - **MINOR**: New principle or section added.
   - **PATCH**: Clarifications, wording, or non-semantic refinements.
4. Update of `LAST_AMENDED_DATE` to the amendment date.

All implementation plans and specs MUST include a Constitution Check gate
that verifies compliance with Principles I–VII before work begins.

**Version**: 1.2.0 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12
