---
name: audit-css
description: "Audit nino-app/apps/manager CSS Modules. Use for Tailwind-first via @apply, token vs hex/rgba, background rules, effects in raw CSS, line length, or page margin conventions."
---

# Audit CSS

Use `nino-app/` as the working directory. Read `css.md` first. Every component
style lives in a co-located `Component.module.css` using `@apply`, consumed as
`className={styles.x}` — never an inline class string or a named constant.
The module's first line is `@reference "@nino/ds/globals.css";` with the
semicolon. Prefer a DS token over hex/rgba only when the value matches the
documented mapping; do not invent a new token when the Tailwind native name
and value already match. Multi-layer gradients, shadows, and effects (grain,
highlight) stay in raw CSS, never a giant `@apply ...-[value]`. App screens
use a white background; cream is only for elements inside the screen (card,
highlight strip, chip), never the page background itself. Keep lines under 80
chars, grouping `@apply` blocks by responsibility (layout, color, effects).
Page-level screens open with `p-4 lg:p-10` on the `.page` class, except the
documented exceptions (kitchen, first-store, store-selection).

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. The test is debugging:
inspecting the element in DevTools, the class name alone should tell you
which piece of the UI you're looking at, without jumping back to the JSX to
figure it out.

Good: `.priceTag`, `.emptyStateIcon`, `.deliveryFeeRow` — each one names the
specific UI role it renders. Seeing `.deliveryFeeRow` highlighted in DevTools,
you immediately know you're looking at the delivery-fee line, not guessing
among five similar rows.

Bad: `.wrapper`, `.container1`, `.box`, `.item`, `.btn-2` — say nothing about
role or content. Five `<div className={styles.wrapper}>` across five files
are indistinguishable in DevTools; you'd have to open each file and trace
the JSX to know which one you're debugging. Also bad: a defensive prefix that
just repeats the component name (`.authGrain` inside `AuthCard.module.css`
already scoped by the module) — it doesn't add information, it pads the name.

Names must be camelCase. Check class names inside the module. Report exact
file and line; do not modify code.
