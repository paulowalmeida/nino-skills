---
name: composition-review
description: Review nino-app Compositions for cohesive section boundaries, DS-first implementation, local interaction state, service isolation, naming, and meaningful extraction.
---

# Composition Review

A Composition is a named, cohesive application section built from Components/Elements. Review whether it remains a section rather than becoming a hidden page, service, or design-system primitive.

## Checks

- Composes app Components/Elements and DS primitives coherently.
- May own local interaction/form state; must not call services directly.
- Must not duplicate page governance, redirects, route ownership, or application-wide business orchestration.
- Must not become a generic DS primitive without a justified shared contract.
- Folder contains the Composition and CSS it actually owns; avoid unrelated support code.
- Every substantial native HTML element or handcrafted visual pattern is checked against the DS catalog first.
- Extract JSX when a block has independent semantic identity, state, styling, structure, or a distinct reason to change—not merely because it is long.
- Names communicate the section/action and do not hide generic responsibilities.
- Comments express only non-obvious constraints.

## Boundary Test

Ask what would change if this section were removed or moved to another route. Route-specific governance belongs above it; reusable domain/UI behavior should live below or beside it according to the rules.

## Evidence

Report exact file/line, observed responsibility, expected boundary, and a concrete extraction/composition recommendation. Do not auto-fix during review.
