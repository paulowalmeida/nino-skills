---
name: audit-layouts
description: "Audit nino-app/apps/manager layout shells in src/layouts. Use for Outlet ownership, shared chrome, route nesting, layout-local state, layout folder structure, or layout names."
---

# Audit layouts

Use `nino-app/` as the working directory. Read `screens.md`, `components.md`,
and `code-style.md` first. A layout is shared chrome and renders `<Outlet />`;
it never imports or chooses the active page. Keep sidebar/header/navigation and
layout-local UI state here, not route data, redirects, or business rules.

## DS-first

For every native HTML tag in the JSX (`div`, `span`, `p`, `h1`-`h6`, `label`,
`section`, `ul`/`li`, `button`, `input`...), confirm there is no DS component
already covering that role before accepting it as raw markup — the fix is
reusing the existing primitive, not reimplementing its look by hand with
Tailwind classes. Common swaps: text → `Text`; heading → `Heading`; a
hand-built `<label>` plus hint/error wiring → `FormField` or `Label`; a
flex/grid wrapper written with raw utilities (`flex items-center gap-2`,
`grid grid-cols-2`) → `Flexbox`/`Grid`; a colored icon marker → `Stamp`; a
list row → `ListRow`; a status pill → `Badge`. A raw tag is only correct when
the DS genuinely has no equivalent (drag handles, custom widget glue) — the
same raw tag appearing elsewhere in the codebase does not make it correct;
check the DS catalog (`packages/ds/src/components/*`), not precedent.

## SRP

A named sub-part of the shell — a user menu dropdown, a nav item, a mobile
drawer's contents — moves to its own file once it has structure and a name
of its own, even if only this layout mounts it today (the existing
`AppLayout/UserMenu` split is the pattern to match). Watch for a big
ternary/switch branch inside the layout's JSX, a second internal helper
returning JSX, or a labeled comment marking off a section that reads like
its own unit. Flag it even when the file is under the 250-line threshold
from `code-style.md`.

## Comments and self-explanatory code

Default is zero comments. Flag any comment that restates what the code
already says — a docstring summarizing what the layout does, an inline note
explaining an obvious prop, a comment repeating what the variable name
already carries. The only comment that survives is one explaining a WHY the
code itself cannot show: a hidden constraint, a workaround for a specific
bug, a non-obvious ordering requirement. If a block needs a comment to be
understood, the real fix is usually a better name or a smaller function, not
the comment — self-explanatory code is the bar, not just self-explanatory
names. Flag any docstring that could be deleted without losing information
and any comment compensating for a name that should carry the meaning
instead.

## Nomes autoexplicativos

Names describe the shell or interaction. Good: `AppLayout`, `isSidebarOpen`,
`handleSidebarClose`. Bad: `Layout2`, `open`, `handleToggle`, `wrapper`. Check
folder, component, state, callbacks, props, and helpers. Report exact file and
line; do not modify code.
