---
name: code-quality-review
description: Review nino-app semantic clarity, naming, comments, abstraction quality, cohesion, duplication, and maintainability beyond mechanical enforcement.
---

# Code Quality Review

## Purpose

Review qualities that are difficult to encode safely as blocking rules: whether code explains itself locally, whether abstractions represent real concepts, and whether refactoring improves cohesion rather than merely metrics.

## Authority

Apply `CLAUDE.md`, `.claude/rules/*`, `rules/coding.md`, and the relevant domain rules. Objective `enforce-*` failures are hard constraints. This Skill must not override them or turn subjective preferences into hard rules.

## Review Method

1. Read the unit locally before judging its quality.
2. Identify what a reader must infer from names, control flow, comments, and surrounding context.
3. Identify the unit's dominant responsibility and reasons to change.
4. Inspect callers when abstraction quality depends on external usage.
5. Prefer the smallest change that improves semantic clarity.

## 9/10 Gates

Flag when:

- a name describes implementation shape instead of domain/UI meaning and forces file inspection to understand intent;
- comments restate code or compensate for an unclear name instead of documenting a non-obvious constraint/why;
- an abstraction exists only to reduce line count, satisfy a metric, or anticipate hypothetical reuse;
- a helper name hides materially unrelated responsibilities;
- a wrapper forwards parameters without creating a meaningful semantic boundary;
- duplicated knowledge has a shared reason to change but remains artificially separate;
- extraction produces weaker cohesion, more parameter plumbing, or more indirection;
- generic containers (`data`, `config`, `content`, `utils`, `handleChange`) are used where domain meaning is available;
- code requires opening several unrelated helpers to understand a simple local workflow;
- multiple concepts are coupled only because they happen to execute sequentially.

## Naming Test

A strong name communicates domain, UI role, state meaning, or action without requiring implementation inspection. Do not reject concise names that are conventional and unambiguous within their bounded context.

## Comment Test

Prefer zero comments for obvious mechanics. Keep comments that explain hidden constraints, non-obvious ordering, compatibility/workaround reasoning, or another fact the code cannot express directly.

## Abstraction Test

Before proposing an abstraction, identify:

- the concept being abstracted;
- the independent reason it exists;
- the contract it creates;
- why the caller becomes clearer;
- why existing abstractions do not already solve the problem.

## Evidence Standard

Every finding MUST include exact file/line, what the reader must infer, why that creates a concrete maintenance risk, and the smallest semantic improvement. Avoid vague style judgments.

## Handoffs

- Responsibility/layer mismatch → `architecture-review`.
- Component/Composition boundary → `component-review` / `composition-review`.
- Hook/state boundary → `hook-state-review`.
- Data/service boundary → `data-boundary-review`.
- Structural risk → `complexity-refactoring`.

## Non-Goals

Do not refactor merely to make code look different. Do not prefer shorter code over clearer code. Do not force abstraction, DRY, comments, or naming conventions beyond what the project rules and semantic evidence support.
