---
name: audit-guards-loaders
description: "Audit nino-app/apps/manager guards and loaders in src/guards and src/loaders. Use for router-access boundaries, one-file-per-unit structure, misplaced router logic, or names."
---

# Audit guards and loaders

Use `nino-app/` as the working directory. Read the "Um arquivo, uma
responsabilidade" section of `code-style.md`. Guards and loaders live in
`src/guards/*` (`@guards`) and `src/loaders/*` (`@loaders`) — never inside
`router/`, which holds only `routes.tsx` and the routes test. Each file
exports exactly one guard or loader, file name matching the exported name
(`authGuard.ts` exports only `AuthGuard`). A guard controls route access
(redirect/block); a loader fetches data before a route mounts — neither owns
composition or page UI logic.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does.

Good: `sessionGuard.ts` exporting `SessionGuard` — reading it in a route
config or a stack trace, you know it blocks/redirects based on session
state, without opening the file.

Bad: `check.ts` exporting `check` — "check" what? Auth? A form field? A
feature flag? Debugging a redirect loop, seeing `check` in the call stack
tells you nothing; you have to open the file to learn it's the guard that
redirects unauthenticated users. Also bad: `guard2` — implies "another guard
like the first one" instead of naming what it guards; `verify` — names an
action with no subject.

Check file name and exported name. Report exact file and line; do not modify
code.
