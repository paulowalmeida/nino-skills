---
name: code-quality-review
description: Review nino-app code for semantic naming, unnecessary comments, abstraction quality, cohesion, duplication, and maintainability beyond mechanical enforcement.
---

# Code Quality Review

## Purpose

Review qualities that are difficult to encode safely as blocking rules: clarity, cohesion, abstraction quality, and whether code communicates its intent locally.

## Gates

Flag:

- names that force the reader to inspect implementation to discover meaning;
- comments that merely restate code or compensate for a poor name;
- abstractions created only to reduce line count or satisfy a metric;
- duplicated knowledge with meaningful independent reasons to change left artificially separate;
- helpers whose names hide substantial unrelated behavior;
- wrappers that only forward parameters without creating a semantic boundary;
- generic containers such as `data`, `config`, `handleChange`, or `utils` when a domain-specific name is available;
- code whose cohesion is worse after extraction even if individual functions become smaller.

## Anti-Gaming

Do not recommend a refactor because a file or function crosses a number alone. Do not create tiny wrappers, speculative reuse, or abstraction layers without a real responsibility boundary.

## Evidence

State what a reader must infer today, why that creates maintenance risk, and the smallest semantic improvement. Prefer local clarity over architectural ceremony.
