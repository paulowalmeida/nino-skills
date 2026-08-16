---
name: audit-states
description: "Audit nino-app/apps/manager Zustand stores in src/states. Use for global-state necessity, domain store boundaries, server-data misuse, store names, actions, or persistence."
---

# Audit states

Use `nino-app/` as the working directory. Read global-state rules in
`code-style.md`. Use Zustand only for client state shared across distant
consumers. Keep page/layout state local and server data in TanStack Query hooks.
Create one domain store per file named `useXStore`; model state, actions, and
clear/reset behavior explicitly. Never add Context for application state.

## Nomes autoexplicativos

Names state domain and transition. Good: `useSessionStore`, `activeTenantId`,
`clearSession`. Bad: `useStore`, `selected`, `setData`, `resetThing`. Check
state fields, actions, selectors, and persistence. Report exact file and line;
do not modify code.
