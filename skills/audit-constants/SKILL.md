---
name: audit-constants
description: "Audit nino-app/apps/manager constants in src/constants. Use for pure-data boundaries, constants-vs-adapter misuse, naming, or accidental JSX in constants."
---

# Audit constants

Use `nino-app/` as the working directory. Read the `@constants` vs `@adapters`
section of `code-style.md`. A constants file holds only static literal data
(arrays, objects) for one domain — never JSX, never a function returning UI.
When a constant needs to become a React element, that mapping belongs in
`@adapters/*.adapter.tsx`, not inline here. One file per domain
(`order.constants.ts`, `product.constants.ts`).

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. Names state the domain and
shape.

Good: `ORDER_STATUS_OPTIONS = [{ value: 'pending', label: 'Pendente' }, ...]`
— reading the name alone tells you it's the list of order status choices,
before seeing a single value.

Bad: `OPTIONS = [{ value: 'pending', label: 'Pendente' }, ...]` — same array,
but `OPTIONS` alone could be order status, payment method, delivery zone,
anything; you only know by opening the array. Also bad: `DATA`, `list`,
`config` — generic container words that describe the type, not the content.

Check file name, exported constant names, and object keys. Report exact file
and line; do not modify code.
