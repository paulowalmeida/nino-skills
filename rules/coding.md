# Coding Rules

This file defines **mandatory implementation constraints for source code** that are not specific to Atomic Design or the Design System.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## External Technical Foundations

Some rules in this file are aligned with official technical guidance:

- React Rules: Components and Hooks must be pure; side effects belong outside render. Official reference: `https://react.dev/reference/rules`
- React Rules of Hooks: `https://react.dev/reference/rules/rules-of-hooks`
- TypeScript Handbook: type assertions affect static checking and do not perform runtime validation. Official reference: `https://www.typescriptlang.org/docs/handbook/2/everyday-types.html`
- TypeScript Compiler API: TypeScript exposes AST/compiler tooling for programmatic source analysis. Official reference: `https://www.typescriptlang.org/docs/handbook/intro`
- ESLint complexity: cyclomatic complexity is configurable and measures independent execution paths; it is a structural signal, not a universal maintainability threshold. Official reference: `https://eslint.org/docs/latest/rules/complexity`
- Sonar Cognitive Complexity: cognitive complexity is intended to estimate understandability and differs from cyclomatic complexity. Reference: `https://www.sonarsource.com/resources/cognitive-complexity/`

These sources provide technical foundations, but **Nino project rules may be stricter**. When an explicit Nino rule differs from an external recommendation, the Nino rule wins.

## Core Principle

Code **MUST** be written for the current requirement, existing project conventions, and long-term maintainability.

The agent **MUST** prefer the simplest implementation that fully satisfies the requirement without violating project rules.

The agent **MUST NOT** introduce complexity merely because a more abstract design is possible.

## Single Responsibility

Every function, arrow function, callback, custom Hook, handler, selector, Service operation, utility, and component **MUST have one coherent responsibility**.

A unit has multiple responsibilities when it performs distinct operations, policies, decisions, transformations, side effects, or other behaviors that could reasonably change independently.

The agent **MUST NOT** combine unrelated responsibilities merely because they belong to the same domain or file.

Services MAY contain multiple operations from the same domain. This does **NOT** relax the Single Responsibility rule for each individual operation.

Examples:

```text
useOrders()                  one coherent responsibility
useCreateOrder()             one coherent responsibility
useOrdersAndPermissions()   unrelated responsibilities
OrderService.createOrder()  one operation
OrderService.cancelOrder()  another operation
```

When a function begins accumulating distinct responsibilities, the agent **MUST split it by responsibility instead of adding another branch to the same function**.

## Function Size and Complexity — Layered Model

The Nino objective is **maintainable function structure**, not compliance with an arbitrary number.

A function can be problematic because it is:

- physically large;
- branch-heavy;
- cognitively difficult;
- deeply nested;
- parameter-heavy;
- responsible for unrelated behavior;
- artificially decomposed to satisfy metrics;
- technically small but semantically difficult to understand.

No single metric is a complete maintainability verdict.

### Mechanical signals

The Nino complexity analyzer **MUST** collect, when applicable:

- function LOC;
- cyclomatic complexity;
- CodeMetrics collected complexity when the CodeMetrics extension is available;
- cognitive complexity;
- maximum control-flow nesting depth;
- parameter count.

The analyzer uses the TypeScript AST for deterministic structural measurements. The project's analyzer is **not** a claim that its cyclomatic or cognitive implementation is identical to CodeMetrics or Sonar. Each metric MUST be named according to what it actually measures.

The analyzer MUST report the metrics for individual functions, including:

- function declarations;
- arrow functions;
- callbacks;
- nested/local functions;
- Custom Hooks;
- handlers;
- selectors;
- utilities;
- asynchronous functions;
- Service operations;
- class methods;
- function expressions.

### Metric roles

Metrics have different purposes:

```text
LOC                 → physical size signal
Cyclomatic          → branching / path signal
CodeMetrics         → project-specific structural signal
Cognitive           → control-flow comprehension signal
Nesting             → structural readability signal
Parameters          → interface / coupling signal
```

The agent **MUST NOT** combine these metrics into a synthetic "quality score".

### Threshold policy

Thresholds are **control parameters**, not universal truths.

Until a sufficiently representative Nino baseline has been measured, the repository **MUST NOT** present a warning or blocking threshold as a scientifically established project limit.

The baseline MUST be calibrated from real Nino source, preferably including `nino-app/apps/manager` on the active development branch and additional representative packages when the sample is too small.

Calibration SHOULD inspect distributions and outliers rather than blindly selecting a percentile. Thresholds MUST also be reviewed against legitimate function categories such as TSX composition, orchestration, Hooks, Services, and pure utilities.

A calibrated threshold MUST document:

1. which metric it controls;
2. which function categories it applies to;
3. whether it produces a warning or block;
4. what behavior the threshold is intended to induce;
5. what evidence was used to select it;
6. when the threshold should be recalibrated.

### Warning versus blocking

Until calibration is complete:

- metric findings are **diagnostic warnings**;
- they MUST NOT automatically force decomposition;
- they MUST NOT be treated as proof of a design defect.

After calibration:

- **warnings** mean "inspect and make an explicit semantic decision";
- **hard failures** are reserved for objectively excessive structural conditions or explicit project rules with a documented basis.

A warning **MUST NOT** be converted into a hard failure merely because an agent prefers stricter numbers.

### CodeMetrics policy

CodeMetrics is useful because it is an AST-based project signal and because the team already uses the VS Code extension `kisstkondoros.vscode-codemetrics`.

However, CodeMetrics **MUST NOT** be treated as a universal definition of cyclomatic, cognitive, algorithmic, or maintainability complexity.

The old Nino rule that treated `CodeMetrics collected complexity <= 5` as a universal hard gate is intentionally retired by this section.

The CodeMetrics configuration **MUST NOT** be changed merely to make code pass. If CodeMetrics is used as an enforcement input, its version and relevant configuration MUST be pinned and documented.

### TSX composition

A TSX render/composition function MAY legitimately be larger than a normal implementation function because JSX composition is itself a responsibility.

This is **not** a blanket exemption from complexity review.

The agent MUST still inspect whether the component mixes business logic, state orchestration, data transformation, and presentation responsibilities.

A TSX function MUST NOT be split merely to reduce LOC or a metric when the extracted pieces have no meaningful semantic identity.

### Semantic review

Metrics identify hotspots. Semantic judgment determines whether the hotspot represents a real design problem.

For every significant metric warning, the agent SHOULD use the `complexity-refactoring` Skill and determine:

1. the function's single responsibility;
2. whether the complexity is inherent or accidental;
3. whether the function is orchestration, implementation, or TSX composition;
4. whether distinct responsibilities have different reasons to change;
5. whether extraction would create a meaningful responsibility boundary;
6. whether the caller becomes easier to understand;
7. whether cohesion improves;
8. whether complexity is actually reduced rather than relocated.

### Anti-gaming rule

A refactor **MUST NOT** be considered successful merely because a metric became smaller.

The agent **MUST NOT**:

- split one function into many arbitrary tiny functions solely to lower metrics;
- move complexity into another function to hide it;
- create wrappers that only forward parameters;
- extract blocks with no coherent responsibility;
- increase indirection solely to satisfy a threshold;
- alter analyzer configuration to make a result pass.

A valid extraction MUST have a meaningful responsibility, a coherent name, an understandable contract, and a measurable improvement in the structure or readability of the caller or extracted logic.

### Nesting reduction

When nesting is the main structural problem, the agent SHOULD first consider:

- guard clauses;
- early returns;
- explicit predicates;
- separating exceptional paths from the main path;
- extracting a meaningful decision.

The agent MUST NOT move the same nested structure into another function solely to lower the caller's nesting metric.

### Complexity reduction

When branching is the problem, identify why the branches exist before extracting code.

Prefer:

- separating independent policies;
- extracting cohesive decisions;
- explicit domain predicates;
- lookup structures when they genuinely represent data;
- separating orchestration from implementation.

Do not replace readable branching with abstraction merely because the abstraction has a lower metric.

## React purity and render-time rules

Components and Hooks **MUST remain pure with respect to rendering**. Code executed during render **MUST NOT** perform side effects that affect external systems or mutate data outside the component's local render state.

Side effects such as network requests, subscriptions, timers, DOM mutations, persistence, and external mutations **MUST NOT** be performed during render. They belong in the appropriate effect, event, or infrastructure layer.

Authoritative React foundation: `https://react.dev/reference/rules`

## TypeScript

TypeScript types **MUST describe the real contract of the code**.

The agent:

- **MUST NOT use `any`** when a concrete or safely generic type can be expressed;
- **MUST NOT use type assertions to silence a type error without verifying the actual runtime contract**;
- **MUST understand that a type assertion does not perform runtime validation**;
- **MUST prefer narrow types over broad types**;
- **MUST preserve discriminated unions and literal types when they carry meaningful constraints**;
- **MUST NOT weaken a type merely to make an implementation compile**.

A type error that exposes a real contract mismatch **MUST** be fixed at the contract or implementation, not hidden with an assertion.

## Null, Undefined, and Optional Values

The agent **MUST handle nullable and optional values explicitly according to the real domain contract**.

Do not use non-null assertions (`!`) merely to silence TypeScript unless the invariant is established by the code and cannot reasonably be represented through typing.

## Error Handling

Errors **MUST be handled at the layer responsible for deciding what the error means**.

The agent **MUST NOT**:

- silently swallow errors;
- catch an error only to rethrow the same error without adding context or changing responsibility;
- return fake success values to hide failures;
- use broad `catch` blocks to conceal programming errors.

When an error cannot be meaningfully handled at the current layer, **let it propagate to the appropriate owner**.

## Async Code

Async operations **MUST** have explicit success/failure behavior appropriate to their caller.

The agent **MUST NOT**:

- create unhandled promises intentionally;
- use `void` merely to hide an async result or error unless the operation is explicitly fire-and-forget by contract;
- introduce sequential `await`s when operations are independent and can safely run concurrently;
- introduce concurrency when ordering or dependency requires sequential execution.

## Side Effects

Side effects **MUST live at the layer responsible for them**.

The agent **MUST NOT** introduce network calls, persistence, subscriptions, timers, global mutations, or other infrastructure side effects into code that is explicitly intended to be pure or presentational.

Do not move a side effect between layers merely to satisfy a local implementation convenience.

## Business Logic

Business rules **MUST NOT** be embedded inside presentation-only code.

For TSX specifically:

> **TSX MUST remain primarily responsible for UI presentation, composition, and UI interaction. Business rules MUST live outside the TSX component.**

The correct non-TSX location depends on responsibility and project architecture; do not move business logic into a generic utility merely to remove it from TSX.

## Constants and Configuration

Values with business or application meaning **MUST** be named and centralized when they are reused or represent policy.

The agent **MUST NOT** scatter duplicated literals when a named constant, configuration object, enum, or domain representation is more accurate.

The agent **MUST NOT** create a constant abstraction for a value used only once when naming it provides no meaningful context.

## Naming

Names **MUST communicate intent, responsibility, or domain meaning**.

The agent **MUST** prefer explicit names over abbreviations, name functions by the operation they perform, and name boolean values with boolean intent (`is`, `has`, `can`, `should`, etc.) when applicable.

## Abstractions

An abstraction **MUST have a current, concrete reason to exist**.

The agent **MUST NOT**:

- create abstractions for hypothetical future reuse;
- create wrappers that merely forward props or calls without adding responsibility;
- create generic helpers for one trivial operation when direct code is clearer;
- generalize code before there is demonstrated duplication or a stable common contract.

When two implementations are similar but their responsibilities are not actually the same, **do not force them into one abstraction**.

## Duplication

Not all duplication is harmful.

Before extracting a shared abstraction, verify that the code shares:

1. the same responsibility;
2. the same behavior contract;
3. the same reason to change.

If those conditions are not sufficiently true, keep the implementations separate.

## Imports and Dependencies

Imports **MUST follow the project's established dependency boundaries and public APIs**.

The agent **MUST NOT**:

- create circular dependencies intentionally;
- import private implementation details when a public API exists;
- introduce a dependency only to avoid writing a small amount of local code;
- bypass an architectural boundary through indirect imports, re-exports, aliases, or wrappers.

When an import would violate `rules/architecture.md`, changing the import path **MUST NOT** be used as a workaround.

## Exports

Use the project's established export strategy.

The agent **MUST NOT** introduce barrel files, `index.ts` aggregators, or alternate export conventions when the project rules prohibit them.

## Comments

Comments **MUST explain intent, constraints, or non-obvious reasoning**, not restate the code.

The agent **MUST NOT** add comments that compensate for unclear naming or unnecessarily complex code.

## Dead Code and Temporary Code

The agent **MUST NOT** leave unused imports, unreachable code, obsolete commented-out implementations, or debugging statements in completed changes.

## File Size

There is no universal maximum number of lines that automatically makes a file incorrect.

Growing file size **MUST** be treated as a signal to reassess responsibility and cohesion, not as an automatic decomposition command.

## Refactoring During Feature Work

Refactoring is allowed only when it is necessary to satisfy the requested feature safely, satisfy an applicable project rule, remove duplication directly caused by the requested change, or make the implementation correct without expanding unrelated scope.

The agent **MUST NOT** use a feature task as an excuse to modernize unrelated code.

## Decision Gate Before Introducing New Code

Before introducing a new abstraction, utility, dependency, or structural pattern, the agent **MUST** be able to answer:

1. What concrete requirement needs it?
2. Why is existing code insufficient?
3. Why is this the correct layer for it?
4. What existing implementation was evaluated first?
5. What new dependency or maintenance cost does it introduce?

If these answers cannot be established from the repository and task context, **DO NOT invent the abstraction**.

## Verification

Before completing a coding task, the agent **MUST**:

1. inspect the final changed code;
2. verify Single Responsibility semantically;
3. inspect applicable structural metrics;
4. determine whether metric findings represent a real design problem;
5. use the complexity-refactoring Skill when a significant hotspot requires semantic judgment;
6. verify that any refactor improves cohesion, responsibility boundaries, or readability rather than merely lowering a metric;
7. verify React purity and absence of side effects during render where applicable;
8. verify that types and contracts remain correct;
9. verify that no forbidden workaround or dependency was introduced;
10. run the relevant typecheck, lint, complexity, tests, or other available checks;
11. inspect the final diff for unrelated changes.

Passing automated checks does not replace reviewing the implementation against these rules.

## Enforcement

The following should be protected mechanically whenever technically possible:

- structural complexity signals reported by the Nino analyzer;
- calibrated hard complexity thresholds once the project baseline justifies them;
- forbidden `any` usage;
- prohibited dependency direction;
- circular dependencies;
- forbidden import paths;
- unused code and imports;
- type errors;
- prohibited export patterns;
- architecture-specific file/folder conventions;
- React Rules of Hooks and render-purity constraints where mechanically detectable.

Complexity warnings **MUST NOT** be converted into hard failures merely to force metric compliance before the thresholds have been calibrated.

When an automated hard check fails, the agent **MUST** fix the implementation rather than weaken the check.

## Final Rule

> **Write the smallest clear implementation that satisfies the current requirement, preserves real type and architectural contracts, keeps responsibilities coherent, treats metrics as structural evidence rather than truth, and never uses decomposition merely to make a number pass.**
