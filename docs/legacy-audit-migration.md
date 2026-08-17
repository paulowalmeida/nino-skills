# Legacy Audit Migration Matrix

## Purpose

This document maps the legacy `audit-*` hook/skill generation to the current Nino enforcement model.

The legacy audits are not assumed to be authoritative. Each rule must be mapped to one of the current enforcement layers before the legacy implementation is removed.

## Current model

```text
Rule / architectural intent
        |
        +--> Mechanical enforcement when the property is objectively observable
        |
        +--> Warning / diagnostic when the signal needs interpretation
        |
        +--> Semantic Skill when responsibility, cohesion, or maintainability require judgment
        |
        +--> Final verification
```

A metric or static signal is not a maintainability verdict. A refactor is not successful merely because a metric decreased.

## Migration matrix

| Legacy audit | Legacy concern | Target in current model | Initial disposition |
|---|---|---|---|
| `audit-architecture` | Layer responsibilities and naming | `rules/architecture.md` + architecture semantic Skill; objective import rules become mechanical checks | Replace |
| `audit-components` | Component boundaries, composition, service access, file shape | `rules/design-system.md` + `rules/architecture.md` + mechanical layer checks | Replace |
| `audit-compositions` | Composition boundaries and service access | `rules/architecture.md` + semantic architecture Skill + mechanical import checks | Replace |
| `audit-constants` | Static-only constants, naming, no JSX | `rules/coding.md` / architecture rules + narrow mechanical check | Replace |
| `audit-css` | Styling/CSS conventions | `rules/styling.md` + mechanical checks only where objective | Replace |
| `audit-elements` | Element scope and forbidden composition | `rules/design-system.md` + mechanical layer check | Replace |
| `audit-guards-loaders` | Guard/loader responsibilities | `rules/architecture.md` + mechanical dependency checks | Replace |
| `audit-hooks` | Hook responsibility, naming, server state vs Zustand, no JSX | `rules/hooks.md` + semantic Hook guidance + objective checks | Replace |
| `audit-imports` | Import ordering, barrels, aliases, naming | `rules/coding.md` / architecture + formatter/linter where possible | Replace |
| `audit-layouts` | Layout responsibility | `rules/architecture.md` + mechanical dependency checks | Replace |
| `audit-lib` | `lib` utility boundaries | `rules/architecture.md` + coding guidance | Replace |
| `audit-pages` | Page responsibility and orchestration | `rules/architecture.md` + semantic architecture Skill | Replace |
| `audit-providers` | Provider responsibility and dependency boundaries | `rules/architecture.md` + mechanical dependency checks | Replace |
| `audit-router` | Routing ownership and navigation boundaries | `rules/architecture.md` + router-specific mechanical checks where objective | Replace |
| `audit-services` | Service responsibility, API/domain boundary, naming | `rules/architecture.md` + coding rules + service checks | Replace |
| `audit-skeletons` | Loading/skeleton component boundaries | `rules/design-system.md` + architecture guidance | Replace |
| `audit-states` | State ownership and state-management boundaries | `rules/hooks.md` + architecture rules; objective Zustand access checks | Replace |
| `audit-tests` | Test location, fixtures, mocks, naming, test structure | `rules/testing.md` + test tooling + targeted mechanical checks | Replace |
| `audit-types` | Type placement/naming/type-safety conventions | `rules/coding.md` + TypeScript/lint tooling | Replace |
| `audit-ui-accessibility` | UI accessibility checklist | `rules/styling.md` / UI rules + automated a11y tooling where available; semantic review for non-automatable criteria | Replace |
| `audit-utils-adapters` | Utility/adapter boundaries | `rules/architecture.md` + coding guidance | Replace |

## Special case: complexity

`audit-complexity` is the first legacy family member that has already been replaced conceptually by the new complexity pipeline:

```text
complexity-analyzer
      -> structural metrics
      -> diagnostic warning
      -> complexity-refactoring Skill
      -> semantic decision
      -> before/after verification
```

It must not be converted into a universal hard gate based on an arbitrary number.

## Legacy infrastructure

`hook-kit.mjs` is shared infrastructure for the old `audit-*` family. It should not be treated as proof that the old audits are still the desired enforcement architecture.

`nino-api-rules.mjs` is not part of the `audit-*` migration matrix. It is a separate rule/enforcement family and must be evaluated separately.

## Removal policy

Do not delete legacy audits merely because a new rule has been written.

For each legacy audit, removal requires:

1. identify the behavior it protected;
2. identify the current rule or Skill that owns that behavior;
3. identify the mechanical enforcement path when the behavior is mechanically observable;
4. verify that the new mechanism covers the same boundary without over-enforcing;
5. remove the legacy implementation only after the replacement is verified.

## Important design constraint

The new system should not reproduce the old one as a larger collection of tiny `audit-*` Skills. A small number of semantic Skills should own concepts such as architecture, testing, and complexity, while narrow mechanical checks should enforce objective invariants underneath them.

This prevents rule fragmentation and makes contradictions between rules easier to detect.
