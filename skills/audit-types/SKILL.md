---
name: audit-types
description: "Audit nino-app/apps/manager TypeScript types. Use for type/interface usage, inline-vs-src/types placement, barrel-free imports, or type names."
---

# Audit types

Use `nino-app/` as the working directory. Read the "Types" section of
`code-style.md`. Always `type`, never `interface`. Never `export default`,
always named export. A type used only inside one file (including component
props) stays inline in that file — no `ComponentName.types.ts` for
single-use types. A type used by more than one file, or with real reuse
potential, moves to `src/types/<domain>/`, one type per kebab-case file, no
barrel — import direct from the file
(`@custom_types/order/order`, never `@custom_types/order`).

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. The test is debugging: a
type name in a TypeScript error or an autocomplete list should tell you what
shape it describes.

Good: `CompleteOnboardingRequest` in `complete-onboarding-request.ts` — a
type error mentioning it tells you exactly which request payload is wrong.

Bad: `Request`, `Data`, `Props2` — a type error mentioning `Data` could be
about any of a dozen shapes in the codebase; you have to jump to the
definition every time to know which one. `Props2` implies "another props
type like the first" instead of naming what it configures.

Check type name and file name. Report exact file and line; do not modify
code.
