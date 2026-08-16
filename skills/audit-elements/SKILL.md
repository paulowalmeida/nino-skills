---
name: audit-elements
description: "Audit nino-app/apps/manager elements in src/elements. Use for atomic UI units, one-component-per-folder structure, element names, DS-first decisions, or accidental app-component composition."
---

# Audit elements

Use `nino-app/` as the working directory. Read `components.md` and
`code-style.md`. An element is one small UI unit. It may use DS primitives,
router glue, or a simple conditional, but never composes another app component
or carries domain logic. Each directory has one component matching its folder,
with CSS only when used. Reusable primitives belong in the DS; larger combined
units belong in components/compositions.

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
the DS genuinely has no equivalent (a drag handle's `onPointerDown`, a
decorative dot with nothing to model it) — the same raw tag appearing
elsewhere in the codebase does not make it correct; check the DS catalog
(`packages/ds/src/components/*`), not precedent.

## SRP

An element should already be one small, nameable unit — if it is doing two
unrelated jobs (an icon-plus-label pairing that also carries navigation
logic and a separate tooltip), split it. The signal is a single file with
two things a different name would each deserve, not line count: watch for a
second internal helper that renders its own JSX, a big ternary/switch
branch picking between unrelated visual shapes, or a labeled comment
marking off a section that already reads like its own unit. Flag it even
when the file is under the 250-line threshold from `code-style.md`.

## Comments and self-explanatory code

Default is zero comments. Flag any comment that restates what the code
already says — a docstring summarizing what the element does, an inline
note explaining an obvious prop, a comment repeating what the variable name
already carries. The only comment that survives is one explaining a WHY the
code itself cannot show: a hidden constraint, a workaround for a specific
bug, a non-obvious ordering requirement. If a block needs a comment to be
understood, the real fix is usually a better name or a smaller function, not
the comment — self-explanatory code is the bar, not just self-explanatory
names. Flag any docstring that could be deleted without losing information
and any comment compensating for a name that should carry the meaning
instead.

## Nomes autoexplicativos

Names describe visual role or action. Good: `BackLink`, `PersonMark`,
`handleBackNavigation`. Bad: `Link`, `iconThing`, `onClick`, `value`. Check
folder, export, props, handlers, and helpers. Report exact file and line; do
not modify code.
