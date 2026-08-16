---
name: audit-router
description: "Audit nino-app/apps/manager router in src/router. Use for routes.tsx scope, misplaced guards/loaders, sub-route structure for long screens, or route/index names."
---

# Audit router

Use `nino-app/` as the working directory. Read `screens.md` and the "Um
arquivo, uma responsabilidade" section of `code-style.md`. `router/` holds
only `routes.tsx` and the test that exercises mounted routes — guards live in
`src/guards/*`, loaders in `src/loaders/*`, never inlined or redefined here.
A screen with multiple independent saved sections (settings-like) is child
routes plus `{ index: true, element: <Navigate ... /> }`, not an accordion or
tabs. Route path segments and route object keys should be readable on their
own.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. The test is debugging: a
route path in the browser URL bar or a route id in a router devtools trace
should tell you which screen it is.

Good: `/pedidos/:id`, `path: 'horario-funcionamento'` — reading the URL or
the route config, you know exactly which screen and, for the child route,
which settings section it renders.

Bad: `/p/:id`, `path: 'section-2'` — `/p/:id` gives no clue whether it's a
product, a person, or a pedido; `section-2` tells you neither which section
of settings nor what it configures, forcing you to open the route tree to
find out.

Report exact file and line; do not modify code.
