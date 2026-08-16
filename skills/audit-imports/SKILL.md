---
name: audit-imports
description: "Audit nino-app/apps/manager import statements. Use for import group ordering, barrel imports from workspace packages or component folders, or aliased import names."
---

# Audit imports

Use `nino-app/` as the working directory. Read the "Imports (ordem
obrigatória)" and "Nunca criar barrel em um pacote do workspace" sections of
`code-style.md`. Order: React/framework, then third-party libs, then
workspace packages and local aliases together, then relative imports, then
styles last — a blank line between each group (workspace packages and local
aliases share one group, no blank line between them). Never import a
workspace package's root (`@nino/ds`) or a component folder's root
(`@components/Nome`) — always the direct subpath/file. `manager` and
`consumer` have no `eslint-plugin-simple-import-sort`, so this order is only
a manual convention there — check visually, do not assume lint enforces it.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. This applies to aliased
imports (`import { X as Y }`): every later use of the alias in the file must
still read as what it is, without scrolling back to the import line.

Good: `import { Order as OrderDto } from '@custom_types/order/order'` —
every later `orderDto.status` in the file is self-explanatory on its own.

Bad: `import { Order as O } from '@custom_types/order/order'` — every later
`O.status` forces you to scroll back up to the import to remember what `O`
is. Same problem with `import { getById as g }`: a stack trace or a search
for `g(` gives you nothing to go on.

Report exact file and line; do not modify code.
