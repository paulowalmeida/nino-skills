---
name: component-review
description: Review nino-app Components for DS-first composition, one-component-per-folder boundaries, CSS ownership, naming, and single responsibility.
---

# Component Review

Review whether a Component is a cohesive UI unit with a clear boundary and no hidden business responsibility.

## Before Reviewing

Read the applicable component, CSS, coding, and design-system rules. Inspect the DS catalog rather than assuming raw HTML or local utilities are acceptable.

## Checks

- One exported React Component per Component folder; a second JSX-returning function is a separate component and needs an explicit reason.
- Folder/file/export naming is consistent and self-explanatory.
- `Name.module.css` exists only when the Component owns classes from that module.
- No barrel files or unrelated stories/examples inside the Component directory.
- The Component composes Elements and DS primitives, not sibling application Components.
- No service calls, API orchestration, or business policy.
- Prefer an existing DS primitive before introducing equivalent native markup or utility styling.
- Extract a meaningful JSX region when it has independent structure, state, styling, semantic identity, or a distinct reason to change; reuse is not required.
- Comments explain constraints/why, never obvious mechanics.

## DS-First Test

For every non-trivial native element or hand-built visual pattern, verify the DS catalog. Precedent in another file is not evidence that duplication is valid.

## SRP Test

Do not split merely to reduce LOC. Split when the extracted unit has a real responsibility and makes both caller and callee more understandable.

## Evidence

Report exact location, boundary issue, DS alternative when relevant, responsibility mismatch, and recommended change. Do not auto-fix during review.
