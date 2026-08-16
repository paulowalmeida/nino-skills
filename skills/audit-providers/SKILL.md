---
name: audit-providers
description: "Audit nino-app/apps/manager providers in src/providers. Use for provider scope, application infrastructure, provider names, composition order, context misuse, or accidental global business state."
---

# Audit providers

Use `nino-app/` as the working directory. Read `code-style.md`. Providers
compose stable application infrastructure, not mutable app/domain state. Do not
introduce `createContext` for manager application state; shared client state
belongs in a domain Zustand store. Keep nesting intentional and values limited
to the capability exposed; no page or feature business logic.

## Nomes autoexplicativos

Names state supplied capability. Good: `QueryClientProvider`,
`ApplicationProviders`, `queryClient`. Bad: `Provider`, `Context`, `data`,
`wrapper`. Check exports, context values, and helpers. Report exact file and
line; do not modify code.
