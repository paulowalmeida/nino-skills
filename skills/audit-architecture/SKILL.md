---
name: audit-architecture
description: "Audit nino-app/apps/manager Atomic Design layering across elements, components, compositions, pages, and layouts. Use for wrong-layer placement, layer boundary violations, or misclassified units."
---

# Audit architecture

Use `nino-app/` as the working directory. Read the "Atomic Design" section of
`components.md`. This audits which layer a unit belongs to, not folder
structure (folder structure of one layer is covered by `audit-elements`,
`audit-components`, `audit-compositions`, `audit-pages`, `audit-layouts`).

Boundaries, in order: `Elements` are simple, single-responsibility, compose
nothing — router glue (`useNavigate`, `to`→`href`) and a simple conditional
are allowed, composing another app component or carrying domain logic is not.
`Components` compose `Elements`/DS primitives into one UI unit; they never
compose another app component, fetch data, or own business logic.
`Compositions` compose `Components`/`Elements` into a named cohesive section;
may own local interaction/form state, never call services directly.
`Pages` are governance only — the only logic a page owns is route params,
redirects, its own top-level loading/error (fed by a hook, never a raw
fetch/service call), and deciding whether to show a given composition. Any
business rule, API call, validation, or formatting belongs below it
(services/hooks/adapters/constants) or inside the composition/component that
already owns it; a page wires, it doesn't implement. `Layouts` render shared
chrome and `<Outlet />`; never import or choose the active page.

Flag any unit doing work that belongs to a layer above or below it — e.g. an
element composing another app component, a page owning a composition's form
state, a composition calling a service directly.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. Here, the name should also
signal the correct layer: an element name reads as a small unit
(`BackLink`), a composition name reads as a section (`OrderSummary`), a page
name reads as a route (`OrderDetail`).

Good: `PersonMark` (element, composes only DS `Avatar`) vs `OrderSummary`
(composition, combines several components) — the names alone hint at their
scope, and match what each actually does.

Bad: naming a composition-sized unit like an element (`OrderCard` that
secretly renders three other app components and manages its own fetch) — the
small, atomic-sounding name hides that it's really composition-level work,
misleading anyone deciding whether to reuse or extend it.

Report exact file and line; do not modify code.
