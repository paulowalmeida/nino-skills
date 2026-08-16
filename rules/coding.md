# Coding Rules

This file defines **mandatory implementation constraints for source code** that are not specific to Atomic Design or the Design System.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Core Principle

Code **MUST** be written for the current requirement, existing project conventions, and long-term maintainability.

The agent **MUST prefer the simplest implementation that fully satisfies the requirement without violating project rules**.

The agent **MUST NOT** introduce complexity merely because a more abstract design is possible.

## Single Responsibility

Every function, arrow function, callback, custom Hook, selector, Service operation, utility, and component **MUST have one coherent responsibility**.

A unit has multiple responsibilities when it performs distinct operations, policies, transformations, or decisions that could independently change or be tested.

The agent **MUST NOT** combine unrelated operations merely because they belong to the same domain.

Services **MAY contain multiple functions or operations belonging to the same domain**. This does not exempt any individual function from the single-responsibility and complexity rules below.

Examples:

```text
useOrders()                  ✅ one coherent operation
useCreateOrder()             ✅ one coherent operation
useOrdersAndPermissions()    ❌ unrelated responsibilities
```

When a unit begins to accumulate independent responsibilities, **split it by responsibility instead of adding more branches to the same abstraction**.

## Function Complexity

**Cyclomatic complexity MUST NOT exceed 5 for any individual function.**

This rule applies to:

- function declarations;
- arrow functions;
- callbacks;
- nested/local functions;
- custom Hooks;
- event handlers;
- selectors;
- utility functions;
- Service operations;
- async functions;
- functions in `.ts` and `.tsx` files.

The exception is limited to a function whose **primary responsibility is directly composing or returning TSX markup**. That rendering/composition function MAY exceed complexity 5 when the branching is inherent to the UI composition itself.

This exception applies to the render/composition function only. It does **NOT** exempt helpers, callbacks, handlers, Hooks, selectors, or Service operations used by that function.

A Service file MAY contain many operations. A Service file MAY therefore have a high total complexity across its functions. **The limit is per function, not per file or module.**

### Complexity decomposition

When a function exceeds complexity 5, the agent **MUST** reduce its complexity before considering the task complete, unless the function qualifies for the explicit TSX rendering/composition exception.

The preferred strategy is to extract **meaningful responsibilities**, for example:

```ts
function processOrder(order: Order) {
  validateOrder(order)
  const total = calculateOrderTotal(order)
  const discount = applyDiscount(total, order.customer)
  return persistOrder(order, total, discount)
}
```

Extracted functions **MUST represent real responsibilities or materially improve local comprehension**.

It is **FORBIDDEN** to split code into meaningless one-line wrappers, rename equivalent blocks, or otherwise decompose code solely to manipulate the complexity metric.

Do not replace complexity with hidden complexity through nested callbacks, indirection, dynamic dispatch, or helper chains solely to make the metric pass.

## Functions

Functions **MUST** be small enough that their purpose and control flow can be understood locally.

The agent **SHOULD** prefer:

- guard clauses over deeply nested conditionals;
- early returns over unnecessary branching;
- named intermediate values when they improve readability;
- pure functions when side effects are not required.

The agent **MUST NOT** create a helper function solely to reduce line count when the helper does not have a meaningful responsibility or improve readability.

## TypeScript

TypeScript types **MUST describe the real contract of the code**.

The agent:

- **MUST NOT use `any`** when a concrete or safely generic type can be expressed;
- **MUST NOT use type assertions to silence a type error without verifying the actual runtime contract**;
- **MUST prefer narrow types over broad types**;
- **MUST preserve discriminated unions and literal types when they carry meaningful constraints**;
- **MUST NOT weaken a type merely to make an implementation compile**.

Unsafe patterns include:

```ts
const value = something as any      // ❌
const value = something as SomeType // ❌ when not verified
```

A type error that exposes a real contract mismatch **MUST be fixed at the contract or implementation**, not hidden with an assertion.

## Null, Undefined, and Optional Values

The agent **MUST handle nullable and optional values explicitly according to the real domain contract**.

Do not use non-null assertions (`!`) merely to silence TypeScript unless the invariant is established by the code and cannot reasonably be represented through typing.

```ts
value!.name // ❌ unsupported assumption
```

Prefer explicit validation or a type-safe control flow when nullability is meaningful.

## Error Handling

Errors **MUST be handled at the layer responsible for deciding what the error means**.

The agent **MUST NOT**:

- silently swallow errors;
- catch an error only to rethrow the same error without adding context or changing responsibility;
- return fake success values to hide failures;
- use broad `catch` blocks to conceal programming errors.

```ts
try {
  await execute()
} catch {
  return null // ❌ silently converting failure into success-like state
}
```

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

Business logic **MUST NOT** be hidden behind a misleading utility name, component prop callback, or formatting helper.

## Constants and Configuration

Values with business or application meaning **MUST** be named and centralized when they are reused or represent policy.

The agent **MUST NOT** scatter duplicated literals when a named constant, configuration object, enum, or domain representation is more accurate.

The agent **MUST NOT** create a constant abstraction for a value used only once when naming it provides no meaningful context.

## Naming

Names **MUST communicate intent, responsibility, or domain meaning**.

The agent **MUST**:

- prefer explicit names over abbreviations;
- name functions by the operation they perform;
- name boolean values with boolean intent (`is`, `has`, `can`, `should`, etc.) when applicable;
- avoid names that describe implementation instead of purpose.

Avoid:

```ts
const data = ...
const temp = ...
const thing = ...
const handle = ...
```

unless the surrounding scope makes the meaning genuinely unambiguous.

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

The agent **MUST NOT** deduplicate code solely because two snippets look similar.

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

Do not create additional export layers merely to shorten import paths.

## Comments

Comments **MUST explain intent, constraints, or non-obvious reasoning**, not restate the code.

The agent **MUST NOT** add comments that compensate for unclear naming or unnecessarily complex code.

When a non-obvious constraint is important to preserve, a concise comment **SHOULD** explain why it exists.

## Dead Code and Temporary Code

The agent **MUST NOT** leave unused imports, unreachable code, obsolete commented-out implementations, or debugging statements in completed changes.

Temporary code **MUST** be explicitly temporary and MUST NOT be left in a finished implementation unless the task explicitly requires it.

## File and Function Size

There is no universal maximum number of lines that automatically makes code incorrect.

However, the agent **MUST treat growing size and complexity as a signal to reassess responsibility**.

A file or function that becomes difficult to understand because it contains multiple responsibilities **MUST** be decomposed by responsibility, not arbitrarily by line count.

A split **MUST NOT** be performed merely to satisfy an artificial line-count target.

The complexity limit in this document applies **per function**, not per file. A file or Service module MAY contain multiple coherent functions.

## Refactoring During Feature Work

Refactoring is allowed only when it is necessary to:

- satisfy the requested feature safely;
- satisfy an applicable project rule;
- remove duplication directly caused by the requested change;
- make the implementation correct without expanding unrelated scope.

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
2. verify that types and contracts remain correct;
3. verify that no forbidden workaround or dependency was introduced;
4. verify that every non-exempt function has cyclomatic complexity ≤ 5;
5. verify that each function has one coherent responsibility;
6. run the relevant typecheck, lint, tests, complexity checks, or other available checks;
7. inspect the final diff for unrelated changes.

Passing automated checks does not replace reviewing the implementation against these rules.

## Enforcement

The following rules **MUST** be protected mechanically whenever technically possible:

- forbidden `any` usage;
- prohibited dependency direction;
- circular dependencies;
- forbidden import paths;
- unused code and imports;
- type errors;
- prohibited export patterns;
- architecture-specific file/folder conventions;
- cyclomatic complexity > 5 for non-exempt functions;
- obvious violations of single responsibility where static analysis can reasonably detect them.

When an automated check fails, the agent **MUST fix the implementation rather than weaken the check**.

## Final Rule

> **Every function has one responsibility. Every non-exempt function has cyclomatic complexity ≤ 5. Services may contain many coherent operations, but no individual operation is exempt. Write the smallest clear implementation that satisfies the current requirement, preserves real type and architectural contracts, avoids speculative abstraction, and leaves no hidden error or unrelated change behind.**
