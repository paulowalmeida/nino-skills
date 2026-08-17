---
name: composition-review
description: Review nino-app Compositions for cohesive section boundaries, DS-first implementation, local interaction ownership, service isolation, naming, and meaningful extraction.
---

# Composition Review

## Purpose

Determine whether a Composition remains a named, cohesive application section rather than becoming a hidden Page, Service, or Design System primitive.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, then objective `enforce-*` results. Mechanical failures are hard constraints. Existing code is evidence, never permission.

## Mandatory Review Sequence

1. Inspect the complete Composition and its CSS/support files.
2. Trace the owning Page/route above and immediate Components/Elements below.
3. Identify what the section renders, owns, fetches, mutates, decides, and exposes.
4. Verify local interaction state is actually local and not a disguised application workflow.
5. Inspect the DS catalog for non-trivial visual primitives.
6. Evaluate naming, cohesion, extraction, and reuse boundaries.
7. Record findings with classification and evidence.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- route governance, redirects, or Page-level orchestration lives inside the Composition;
- direct service/API access bypasses the approved data boundary;
- unrelated business workflows are bundled because they happen to share a screen;
- the section has become a generic UI primitive that belongs in the DS or lower layer;
- existing DS primitives are recreated without a concrete gap;
- multiple independent sections with distinct reasons to change remain inseparable without justification;
- extraction merely moves complexity, duplicates props, or creates forwarding wrappers;
- the name hides domain-specific behavior behind a generic container concept;
- CSS/support files have ambiguous ownership.

## Boundary Test

Ask:

> If this section moved to another Page, what would remain valid?

Route-specific governance belongs above it. Reusable lower-level behavior belongs below/alongside it according to the rules. The Composition should remain the named section boundary.

## DS-First Test

For every non-trivial visual pattern, inspect the actual DS catalog before accepting local typography, layout, form, status, or interaction primitives. Existing precedent is not proof.

## Extraction Test

Extract only when the candidate has semantic identity, independent state/style, or a distinct reason to change **and** the caller becomes easier to understand. Length alone is insufficient.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must identify the missing route/caller/DS context. It must not be silently treated as PASS.

## Evidence Standard

Every confirmed finding MUST include exact file/line, observed responsibility, expected boundary, concrete evidence, impact, and minimal correction. Retrospective PASS requires complete inspection of the scoped Composition and relevant immediate context.

## Handoffs

- Wrong Atomic Design layer → `architecture-review`.
- Component-level boundary → `component-review`.
- State/effect ownership → `hook-state-review`.
- Service/API/data flow → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.
- Structural decomposition → `complexity-refactoring`.
- Mechanical import/CSS/structure issue → `enforce-*`.

The receiving Skill owns the final disposition; do not bounce a finding back without new evidence.

## Non-Goals

Do not create a Composition solely because JSX is large. Do not introduce speculative reuse. Do not treat one legacy implementation as the architecture standard.

## Final Review Gate

Before PASS, confirm route ownership, section responsibility, state ownership, data boundary, DS decision, CSS ownership, naming, and extraction risk were inspected.
