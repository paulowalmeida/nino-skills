# Complexity Refactoring Skill

## Purpose

This Skill handles functions and modules that static analysis identifies as potentially too large, too branch-heavy, too deeply nested, or otherwise structurally risky.

Its purpose is **not** to make every metric small. Its purpose is to improve comprehension, cohesion, responsibility boundaries, and maintainability without creating artificial abstractions.

## Authority Model

Static analysis provides objective structural signals.

This Skill provides semantic judgment.

The Skill **MUST NOT** override objective architectural enforcement, type errors, or explicit hard failures.

The Skill **MUST NOT** treat any single metric as a complete maintainability verdict.

## Inputs

When available, inspect:

- function LOC;
- CodeMetrics collected complexity;
- cyclomatic complexity;
- cognitive complexity;
- maximum nesting depth;
- parameter count;
- file size;
- function category (component, Hook, Service operation, utility, handler, selector, etc.);
- whether the function is TSX composition;
- caller and callee relationships;
- the surrounding module and architectural layer.

## First Decision: Is Refactoring Actually Required?

A metric warning does **not** automatically require decomposition.

Before changing code, answer:

1. What is this function's single responsibility?
2. Is that responsibility coherent?
3. Is the complexity inherent to that responsibility or accidental?
4. Is the function orchestration, implementation, or presentation composition?
5. Is the difficult part caused by branching, nesting, data transformation, side effects, or mixed responsibilities?
6. Would another engineer understand the function locally without reconstructing unrelated context?

If the function is coherent and the flagged metric is explained by legitimate composition or orchestration, do not refactor merely to improve a number.

## Responsibility Test

A function should be decomposed when it contains distinct responsibilities that have different reasons to change.

Strong signals include:

- validation followed by unrelated persistence policy;
- transport handling mixed with domain policy;
- data fetching mixed with unrelated presentation decisions;
- several independent business policies hidden in one branch tree;
- side effects mixed with transformations that could be pure;
- unrelated workflows sharing a function only because they happen to execute sequentially.

A function is **not** automatically multi-responsibility merely because it performs several sequential steps in one coherent workflow.

## Extraction Test

An extracted function is valid only when the extraction creates a meaningful semantic boundary.

Before extracting, identify:

- the responsibility being extracted;
- the reason it is independently understandable;
- the inputs it genuinely needs;
- the output or effect it owns;
- why the caller becomes easier to understand afterward.

The extracted function **MUST** have a meaningful name derived from responsibility, not implementation detail.

## Anti-Gaming Rule

The Skill **MUST reject metric-driven decomposition** when the refactor only moves complexity without improving structure.

Reject transformations such as:

```text
one complex function
        ↓
several tiny wrappers
        ↓
same control flow, same coupling, more indirection
```

The following are not sufficient reasons for extraction:

- lowering LOC alone;
- lowering CodeMetrics alone;
- making a single metric cross a threshold;
- hiding a branch tree in another function;
- creating a wrapper that only forwards parameters;
- extracting code that has no independent responsibility;
- splitting a linear, coherent workflow into arbitrary steps.

A refactor that merely relocates complexity **MUST NOT** be considered successful.

## Cohesion Test

After extraction, every resulting function **MUST** be more internally coherent than the corresponding extracted block.

Ask:

- Does every statement support the function's name?
- Does the function have one dominant reason to change?
- Are its parameters necessary for that responsibility?
- Does it depend on unrelated state?
- Would the function still make sense when read in isolation?

If the answer is no, reconsider the extraction.

## Caller Test

The caller should become easier to read after extraction.

A successful refactor usually makes the caller read like a high-level description of the workflow while moving implementation detail into cohesive functions.

If the caller becomes a sequence of opaque function names that requires opening every helper to understand the basic workflow, the refactor may have increased indirection without improving comprehension.

## Complexity Relocation Test

Compare the complete before/after structure, not only the flagged function.

A refactor is suspicious when:

- the original function becomes simple but a new helper contains essentially all the original complexity;
- complexity is distributed across many tiny helpers with strong coupling;
- parameters multiply because extraction crossed a weak boundary;
- state is threaded through several functions solely because of the extraction;
- the number of abstractions increases substantially without a corresponding responsibility boundary.

The Skill **MUST** prefer a smaller number of cohesive functions over many mechanically small functions.

## Nesting Reduction

When nesting is the main problem, prefer structural simplification before extraction.

Consider:

- guard clauses;
- early returns;
- positive/negative condition normalization;
- extracting a meaningful predicate;
- separating exceptional paths from the main path.

Do not replace one deeply nested function with a deeply nested helper merely to move the metric.

## Complexity Reduction

When branching is the main problem, identify why the branches exist.

Prefer:

- separating independent policies;
- extracting a cohesive decision;
- explicit domain predicates;
- lookup structures when they genuinely represent data rather than hiding control flow;
- separating orchestration from implementation.

Do not replace readable branching with an abstraction solely because the abstraction has a lower metric.

## TSX Composition Exception

A TSX render/composition function may be large because JSX itself is verbose.

Do not split a component merely to reduce LOC or CodeMetrics when the component has one coherent presentation responsibility.

Extract a component when the extracted UI has a meaningful semantic identity, reusable contract, independently understandable behavior, or a clear architectural boundary.

Do not extract arbitrary JSX fragments into components solely to reduce line count.

## Hooks

A Custom Hook must remain focused on one coherent stateful behavior or Hook composition responsibility.

A large Hook should not be split merely because it contains several related operations that together implement one cohesive behavior.

Separate responsibilities when the Hook combines independent state machines, unrelated domain policies, or unrelated side effects.

## Services

A Service file may contain many operations from the same domain.

Do not split a Service merely because the file is large.

Evaluate each operation independently for responsibility and complexity.

An orchestration Service operation may legitimately call several cohesive operations. Do not force artificial decomposition simply because it aggregates work.

## Metrics and Thresholds

Thresholds are control parameters, not universal truths.

Until the Nino baseline is sufficiently large to calibrate project-specific thresholds, metric output should be treated as diagnostic evidence rather than an automatic mandate to refactor.

The Skill **MUST NOT** invent a threshold and present it as an objective definition of good code.

When project-calibrated thresholds become available, interpret them according to their enforcement level:

- warning: inspect and make an explicit decision;
- hard failure: refactoring or an approved exception is required.

Even after calibration, a warning does not prove that refactoring is necessary.

## Before/After Verification

After a refactor, compare:

```text
Structural signals
- LOC
- CodeMetrics / cyclomatic
- cognitive complexity
- maximum nesting
- parameter count

Semantic quality
- responsibility clarity
- cohesion
- caller readability
- abstraction quality
- coupling
- indirection
```

A refactor is successful only when the semantic quality is maintained or improved and the structural risk is meaningfully reduced.

A lower metric with worse cohesion or readability is a failed refactor.

## Required Final Assessment

Before completing a complexity-related task, explicitly determine:

1. whether the original warning represented a real design problem;
2. which responsibility boundary, if any, was improved;
3. whether extraction was semantic rather than metric-driven;
4. whether complexity was reduced or merely relocated;
5. whether the resulting functions remain cohesive;
6. whether the caller is easier to understand;
7. whether any exception is justified by architecture or presentation composition;
8. whether the final implementation remains within applicable mechanical enforcement.

## Final Principle

> **Metrics identify risk. They do not define good design. Refactor when responsibility, cohesion, nesting, or comprehensibility actually improves—not merely because a number became smaller.**
