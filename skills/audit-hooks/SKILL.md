---
name: audit-hooks
description: "Audit nino-app/apps/manager custom hooks in src/hooks. Use for hook responsibility, data-flow boundaries, exported-hook files, names, effects, service usage, or React Query behavior."
---

# Audit hooks

Use `nino-app/` as the working directory. Read the layer and hook sections of
`code-style.md`. Hooks call services and expose UI-ready state; they contain
reusable effect/stateful logic, not JSX or raw HTTP responses. New public hooks
have one file matching the export; keep non-exported helpers local. Keep server
data in query hooks, not Zustand, and make hooks purpose-specific.

## Nomes autoexplicativos

Names expose the consumer concept, not implementation. Good: `useCurrentTenant`,
`useSaveStore`, `isPending`. Bad: `useTenantQuery`, `useData`, `loading`,
`result`. Check export, returned fields, callbacks, and helpers. Report exact
file and line; do not modify code.
