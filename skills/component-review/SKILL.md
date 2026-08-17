---
name: component-review
description: Review nino-app Components for design-system use, responsibility boundaries, CSS ownership, naming, cohesion, and meaningful extraction.
---

# Component Review

## Purpose

Determine whether a Component is a cohesive UI unit with a clean boundary, correct Design System usage, and no hidden domain responsibility.

## Authority

Apply `CLAUDE.md`, applicable `.claude/rules/*`, `rules/architecture.md`, `rules/design-system.md`, `rules/coding.md`, and `rules/styling.md` before this Skill. Objective `enforce-*` failures are hard constraints; this Skill handles the semantic decisions they cannot safely encode.

## Review Method

1. Confirm the unit's actual responsibility from JSX, props, state, effects, imports, and callers.
2. Inspect the DS catalog before judging raw markup or locally recreated primitives.
3. Check the folder/file/export boundary and CSS ownership.
4. Evaluate cohesion and extraction opportunities.
5. Verify naming and public API communicate the component's real responsibility.

## 9/10 Gates

Flag when:

- the Component composes sibling application Components instead of remaining at its intended boundary;
- it contains service/API orchestration or business policy;
- raw markup recreates an existing DS primitive without a demonstrated DS gap;
- Tailwind/local styling reproduces a DS component or bypasses the intended styling boundary;
- the folder contains unrelated components, stories/examples, or support files that obscure ownership;
- a CSS module exists without real ownership or is shared implicitly through unrelated components;
- a second JSX-returning function is actually a distinct UI responsibility with no reason to remain nested;
- a large JSX block has independent semantic identity, state, styling, or reason to change, but extraction would improve comprehension;
- a proposed extraction is only a line-count reduction, wrapper, or speculative reuse;
- names such as `Content`, `Item`, `Section`, `handleChange`, or `active` hide domain/UI meaning when a precise name is available.

## DS-First Test

For each non-trivial native element or handcrafted visual pattern:

1. identify its semantic role;
2. inspect the current DS catalog;
3. decide whether an equivalent primitive exists;
4. if it does, prefer the DS primitive;
5. if it does not, document why the native markup is necessary.

Precedent in another file is not evidence that duplication is correct.

## SRP and Extraction Test

Extraction is justified only when the extracted unit has a meaningful responsibility and the caller becomes easier to understand. Reuse is optional; semantic identity and a distinct reason to change are sufficient.

Reject decomposition that merely lowers LOC, moves a branch tree, creates parameter plumbing, or increases indirection without a stronger boundary.

## Evidence Standard

Every finding MUST include exact file/line, observed behavior, boundary problem, relevant DS alternative or ownership rule when applicable, and the smallest correction that improves cohesion. State uncertainty when the surrounding contract is insufficient.

## Handoffs

- Layer misclassification → `architecture-review`.
- Composition-level section → `composition-review`.
- State/effect ownership → `hook-state-review`.
- Complexity/refactoring → `complexity-refactoring`.
- Pure CSS/import/structure violations → corresponding `enforce-*` hook.

## Non-Goals

Do not demand extraction merely for reuse, file size, or stylistic preference. Do not treat the existing codebase as architectural precedent. Do not replace a DS primitive with a custom equivalent without a demonstrated need.
