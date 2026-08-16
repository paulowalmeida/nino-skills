---
name: audit-pages
description: "Audit nino-app/apps/manager pages and nested route sections. Use for route governance, page boundaries, sub-routes, composition ownership, page names, or page folder structure."
---

# Audit pages

Use `nino-app/` as the working directory. Read `screens.md`, `components.md`,
and `code-style.md` first. A page is governance only. The only logic a page
is allowed to own: reading route params, redirecting, its own top-level
loading/error state (fed by a hook, never a raw fetch/service call), and
deciding whether to show a given composition. Everything else — business
rules, API calls, validation, formatting, payload shaping, API-error
translation — belongs to services, hooks, adapters, or constants below it,
or is delegated to the compositions/components it renders; a page never
implements that logic itself, only wires the pieces that already own it.
Independent saved sections require child routes, `SectionNav`, and `<Outlet />`.

## DS-first

For every native HTML tag a page renders directly (`div`, `span`, `p`,
`h1`-`h6`, `label`, `section`, `ul`/`li`, `button`, `input`...), confirm
there is no DS component already covering that role before accepting it as
raw markup — the fix is reusing the existing primitive, not reimplementing
its look by hand with Tailwind classes. Common swaps: text → `Text`; heading
→ `Heading`; a hand-built `<label>` plus hint/error wiring → `FormField` or
`Label`; a flex/grid wrapper written with raw utilities (`flex items-center
gap-2`, `grid grid-cols-2`) → `Flexbox`/`Grid`; a colored icon marker →
`Stamp`; a list row → `ListRow`; a status pill → `Badge`. A raw tag is only
correct when the DS genuinely has no equivalent — the same raw tag appearing
elsewhere in the codebase does not make it correct; check the DS catalog
(`packages/ds/src/components/*`), not precedent.

## SRP

A page that renders a sizable block of JSX directly — instead of delegating
to a composition/component — is both a governance violation and an SRP
violation: that block already has its own structure and a name it could
carry (a form, a summary card, a modal's `header`/`body`/`footer` wiring),
and belongs in its own file even if only this page uses it today. Watch for
a big ternary/switch branch inside the page's JSX, a second internal helper
returning JSX, or a labeled comment marking off a section that reads like
its own unit. Flag it even when the file is under the 250-line threshold
from `code-style.md`.

## Comments and self-explanatory code

Default is zero comments. Flag any comment that restates what the code
already says — a docstring summarizing what the page does, an inline note
explaining an obvious step, a comment repeating what the variable name
already carries. The only comment that survives is one explaining a WHY the
code itself cannot show: a hidden constraint, a workaround for a specific
bug, a non-obvious ordering requirement. If a block needs a comment to be
understood, the real fix is usually a better name or delegating that block
to its own composition, not the comment — self-explanatory code is the bar,
not just self-explanatory names. Flag any docstring that could be deleted
without losing information and any comment compensating for a name that
should carry the meaning instead.

## Nomes autoexplicativos

Names describe the route purpose without local context. Good: `OrderDetail`,
`handleOrderRedirect`. Bad: `Page`, `Screen2`, `handleClick`, `data`. Check
folder, page component, state, props, handlers, and helpers. Report exact file
and line; do not modify code.
