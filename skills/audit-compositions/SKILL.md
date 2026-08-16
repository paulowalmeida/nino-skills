---
name: audit-compositions
description: "Audit nino-app/apps/manager compositions in src/compositions. Use for composition boundaries, atomic-design placement, local interaction state, folder structure, names, or unintended service access."
---

# Audit compositions

Use `nino-app/` as the working directory. Read `components.md` and
`code-style.md` first. A composition is a named cohesive UI section combining
app components/elements. It may own local interaction/form state, but never
calls services directly, duplicates page governance, or becomes a DS primitive.
Its folder has one React component and a CSS module only if that component uses
classes from it.

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

A block of JSX with its own structure and a name you could give it moves to
its own component even when it appears in one place today — reuse is not
the only reason to extract. Two independent signals, either one is enough:
(1) it duplicates a block that exists elsewhere → extract and reference from
both; (2) it has structure, state, or styling distinct enough to name on its
own, even used once → extract. Watch for a chunk with its own `header`/
`body`/`footer` wiring (a `Modal`, a form section), a big ternary/switch
branch inside the JSX, or a labeled comment (`{/* duration picker */}`)
marking off a section that already reads like its own unit — that is the
tell that it belongs in its own file. Flag it even when the file is under
the 250-line threshold from `code-style.md`; SRP is a structural signal
independent of line count.

## Comments and self-explanatory code

Default is zero comments. Flag any comment that restates what the code
already says — a docstring summarizing what the component does, an inline
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

Names describe the UI section or action. Good: `OrderSummary`,
`handleDeliveryAddressChange`, `isDrawerOpen`. Bad: `Content`, `section`,
`handleChange`, `open`. Check folder, export, props, state, handlers, and JSX
helpers. Report exact file and line; do not modify code.
