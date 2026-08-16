# Nino — TSX Architecture Rules

> Working contract for the frontend component architecture. This document consolidates the decisions made during the architecture review.

## 1. Architectural model

The UI follows **Atomic Design**:

```text
Layout
  ↓
Page
  ↓
Template
  ↓
Organism
  ↓
Molecule
  ↓
Atom
```

`Layout` is a structural application concern and is **outside the Atomic Design hierarchy**. It wraps/governs Pages and provides persistent application structure such as header, sidebar, navigation and content areas.

### Atoms

- Basic UI units.
- May come from the Design System or be specific to the consuming app.
- No business logic.
- No API/service access.
- Must not depend on higher Atomic Design levels.

### Molecules

- Combine two or more Atoms into a small functional UI unit.
- May use DS Atoms and app-specific Atoms.
- No business logic.
- No direct API/service access.
- May contain local UI state when that state belongs to the Molecule's own interaction.

### Organisms

- Significant UI sections composed from Molecules and/or Atoms.
- May contain local state and interaction belonging to the section itself.
- No business logic.
- No direct API/service access.
- Must not depend on Templates or Pages.

### Templates

- Define the structural composition of a page.
- Compose Organisms, Molecules and Atoms.
- Represent page structure, not a concrete route instance or concrete application data.
- No business logic.
- No direct API/service access.

### Pages

- Represent a concrete application route/context.
- Act as the **governance UI layer** for that route.
- Coordinate page context, page state, data and dependencies.
- Compose/use Templates and inject the required data, actions and dependencies into the presentation tree.
- Should not absorb visual responsibilities belonging to lower layers.

## 2. Composition and dependencies

### Direction

Dependencies flow downward through the Atomic Design hierarchy:

```text
Page → Template → Organism → Molecule → Atom
```

A component **must not depend on another component in the same Atomic Design layer**.

A higher layer may skip lower layers when appropriate. For example, an Organism may use an Atom directly.

However:

> A higher-level component must not become an arbitrary grouping of lower-level components. If a group of Atoms forms a coherent, reusable functional unit, it should be represented as a Molecule rather than remaining an incidental Atom grouping inside an Organism.

## 3. Design System — DS-first

The Design System is **DS-first, not DS-only**.

Before creating any UI, the agent must:

1. Search the Design System for an existing suitable solution.
2. Reuse the existing DS solution when it adequately solves the requirement.
3. If the DS does not provide a suitable solution, create an app-specific component when appropriate.

The same discovery principle applies to existing components in the application: before creating a new component, look for an existing component with the same or sufficiently close responsibility and prefer reuse/composition when appropriate.

## 4. Component structure

Components are organized by Atomic Design layer:

```text
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── pages/
└── layouts/
```

Rules:

- One component per folder.
- No barrel files / `index.ts` for component exports.
- The component folder contains the TSX and its CSS Module.
- Tests live outside `src`, under `__tests__`, mirroring the `src` directory structure.

Example:

```text
src/
└── atoms/
    └── Button/
        ├── Button.tsx
        └── Button.module.css

__tests__/
└── atoms/
    └── Button/
        └── Button.test.tsx
```

## 5. Naming

Names must communicate the **responsibility, domain and/or intent** of the thing they represent without requiring the reader to inspect the implementation.

Rules:

- Name by responsibility/intent, not appearance.
- Avoid generic names when they hide intent (`Container`, `Wrapper`, `Item`, `Data`, etc.).
- Avoid names based on implementation details (`FlexContainer`, etc.).
- Avoid unnecessary abbreviations.
- Names should remain valid when the visual implementation changes.
- Do not use comments to compensate for a poor name; improve the name first.

## 6. Props and dependency injection

- Props must be explicitly typed.
- Pass only the data the component actually needs.
- Avoid passing an entire domain object when only a subset is required.
- Behaviors and external dependencies should be injected rather than discovered/created inside presentation components.
- Avoid `any`.

Example:

```tsx
<UserCard
  name={user.name}
  avatar={user.avatar}
  onSelect={handleSelect}
/>
```

## 7. State

### Business/shared state

**Zustand is the source of truth for application/business state.**

- Presentation components must not consume Zustand directly.
- Access to Zustand from the UI is mediated by an eligible Hook.
- Atoms, Molecules and Organisms must not directly consume Zustand Hooks.
- They receive required data/actions through props or dependency injection.
- Pages are the governance layer that coordinates state and injects what the presentation tree needs.

Integration flow:

```text
Page / eligible Hook
        ↓
     Zustand
        ↓
     Service
        ↓
    API / Endpoint
```

A Service may communicate directly with Zustand when the operation requires it, but a Service must never communicate directly with presentation/UI layers.

### Local UI state

UI-only state should remain local to the smallest component capable of governing it.

Examples include modal visibility, selected tab, accordion expansion and temporary input state.

Use React-local mechanisms such as `useState` or `useReducer` for this state by default. Do not globalize UI state in Zustand without a real need for shared state.

## 8. Hooks

- Hooks have a single responsibility.
- A Hook should perform one coherent operation, not accumulate multiple operations merely because they belong to the same domain.
- Hooks may compose other Hooks without absorbing their responsibilities.
- Hooks are organized by domain/responsibility, not by Atomic Design layer.
- Domain-specific Hooks live in domain subfolders.
- Truly generic Hooks may live directly under `hooks/`.

Example:

```text
hooks/
├── auth/
│   ├── useAuth.ts
│   └── usePermissions.ts
├── orders/
│   ├── useOrders.ts
│   ├── useCreateOrder.ts
│   └── useCancelOrder.ts
└── useDebounce.ts
```

## 9. Services

A Service is responsible for communication with external data sources/infrastructure.

- Services may communicate with Zustand.
- Services communicate with APIs/endpoints through the appropriate integration mechanism.
- Services never communicate directly with presentation/UI layers.
- Services do not render UI.
- Services do not contain presentation logic.
- A Service should have a single responsibility and represent one coherent operation.

Forbidden direct relationship:

```text
Service → Atom
Service → Molecule
Service → Organism
Service → Template
Service → Page
```

## 10. Core architectural principle

The agent must **implement within these rules**, rather than treating them as an audit checklist to be applied only after implementation.

Critical rules should eventually be enforced mechanically where possible (linting, AST checks, hooks, etc.) instead of relying exclusively on instructions in a skill file.
