# Coding Rules

This file defines **mandatory implementation constraints for source code** that are not specific to Atomic Design or the Design System.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## External Technical Foundations

Some rules in this file are aligned with official technical guidance:

- React Rules: Components and Hooks must be pure; side effects belong outside render; Hooks have strict usage rules. Official reference: `https://react.dev/reference/rules`
- React Rules of Hooks: `https://react.dev/reference/rules/rules-of-hooks`
- TypeScript Handbook: type assertions affect static checking and do not perform runtime validation. Official reference: `https://www.typescriptlang.org/docs/handbook/2/everyday-types.html`
- ESLint complexity rule: official reference for cyclomatic-complexity concepts and configurable thresholds: `https://eslint.org/docs/latest/rules/complexity`

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
useOrders()                  ✅ one coherent responsibility
useCreateOrder()             ✅ one coherent responsibility
useOrdersAndPermissions()    ❌ unrelated responsibilities
OrderService.createOrder()   ✅ one operation
OrderService.cancelOrder()   ✅ another operation
```

When a function begins accumulating distinct responsibilities, the agent **MUST split it by responsibility instead of adding another branch to the same function**.

## Function Complexity — Hard Limit

The project's authoritative function-complexity metric is the **CodeMetrics collected-complexity calculation** used by the VS Code extension published as `kisstkondoros.vscode-codemetrics`.

CodeMetrics computes complexity from the source **AST**: it parses the source, walks AST nodes, and applies the configured contribution for each node to produce a collected-complexity value for the analyzed function/method.

The project **MUST use that same measurement model** rather than substituting a different definition of cyclomatic, cognitive, or algorithmic complexity.

### Authoritative implementation

The current pinned reference is:

```text
Tool: CodeMetrics
Extension ID: kisstkondoros.vscode-codemetrics
Reference version: 1.26.1
Metric engine: tsmetrics-core 1.4.1
Languages: TypeScript / TSX / JavaScript / JSX
Threshold: 5
```

The exact implementation and configuration are part of the project rule.

The project **MUST NOT** treat the extension's visual severity colors, CodeLens display settings, editor decorations, or other presentation settings as the complexity rule. The authoritative value is the **collected complexity of the individual function**.

If the repository later vendors or reproduces the calculation, that implementation **MUST match the pinned measurement model and configuration** rather than introducing a new formula.

### Hard threshold

The **CodeMetrics collected complexity of every individual function MUST be 5 or less**.

This rule applies to:

- function declarations;
- arrow functions;
- callbacks;
- nested/local functions;
- custom Hooks;
- event handlers;
- selectors;
- utility functions;
- asynchronous functions;
- Service operations;
- class methods;
- function expressions.

Services are NOT exempt. A Service file MAY contain many operations, but **each individual operation MUST have collected complexity ≤ 5**.

### Measurement rules

The agent **MUST**:

1. use the pinned CodeMetrics calculation as the authoritative metric;
2. evaluate each individual function independently;
3. include arrow functions and function expressions;
4. use the configured node contributions of the pinned implementation;
5. treat the reported collected complexity as authoritative.

The agent **MUST NOT**:

- describe the CodeMetrics score as if it were a standard cyclomatic-complexity score;
- replace the CodeMetrics score with a manually calculated number;
- substitute another analyzer merely because it reports a lower value;
- ignore a function because the editor does not currently display a CodeLens for it;
- use function-name exclusions or equivalent configuration to bypass the rule;
- change CodeMetrics node weights, exclusions, or thresholds to make code pass.

### Function coverage and analyzer limitations

All relevant function forms **MUST remain included** in measurement.

If the official measurement tool does not report a function because of an analyzer limitation, that limitation **MUST NOT** be interpreted as an exemption. The project's enforcement implementation must be fixed or supplemented so that the function is measured using the same authoritative calculation.

### TSX Composition Exception

There is exactly one architectural exception to the complexity limit:

> A function whose **primary and clearly identifiable responsibility is rendering/composing TSX markup** MAY exceed complexity 5 when that complexity is inherent to UI composition itself.

This exception:

- applies only to the TSX composition/render function;
- MUST NOT be used by helper functions called by that function;
- MUST NOT be used by Hooks, handlers, selectors, Services, utilities, callbacks, or business-logic functions;
- MUST NOT be used merely because a function happens to live in a `.tsx` file.

### React purity and render-time rules

Components and Hooks **MUST remain pure with respect to rendering**. Code executed during render **MUST NOT perform side effects that affect external systems or mutate data outside the component's local render state.

Side effects such as network requests, subscriptions, timers, DOM mutations, logging with externally meaningful side effects, persistence, and external mutations **MUST NOT be performed during render**. They belong in the appropriate effect/event/infrastructure layer.

Authoritative React foundation: `https://react.dev/reference/rules`

Example:

```tsx
// ✅ composition-only render
return (
  <View>
    {conditionA && <A />}
    {conditionB ? <B /> : <C />}
  </View>
)
```

```ts
// ❌ no TSX exception: business/processing logic
function processOrder(order: Order) {
  // CodeMetrics collected complexity MUST remain ≤ 5
}
```

### Required Response to Complexity > 5

When a non-exempt function exceeds complexity 5, the agent **MUST reduce the CodeMetrics collected complexity to 5 or less before considering the task complete**.

Preferred techniques include:

- guard clauses;
- early returns;
- extracting a meaningful decision or operation;
- lookup tables/maps instead of long conditional chains;
- separating validation from transformation;
- separating orchestration from business rules.

The agent **MUST NOT**:

- split code into meaningless wrappers solely to make the metric pass;
- move complexity into another function merely to hide it;
- use indirection to evade the complexity check;
- add an artificial function boundary with no coherent responsibility;
- alter metric configuration to lower the measured score.

Any extracted function **MUST itself satisfy Single Responsibility and MUST independently obey the complexity limit**.

## Functions Must Remain Local and Understandable

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
- **MUST understand that a type assertion does not perform runtime validation**;
- **MUST prefer narrow types over broad types**;
- **MUST preserve discriminated unions and literal types when they carry meaningful constraints**;
- **MUST NOT weaken a type merely to make an implementation compile**.

Unsafe patterns include:

```ts
const value = something as any      // ❌
const value = something as SomeType // ❌ when the runtime invariant was not verified
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

However, the agent **MUST** treat growing size and complexity as a signal to reassess responsibility.

A file or function that becomes difficult to understand because it contains multiple responsibilities **MUST** be decomposed by responsibility, not arbitrarily by line count.

A split **MUST NOT** be performed merely to satisfy an artificial line-count target.

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
2. verify that every individual function complies with Single Responsibility;
3. verify that every non-exempt individual function has CodeMetrics collected complexity ≤ 5 according to the pinned implementation;
4. confirm that any complexity exception is limited to the TSX composition/render function and is not hiding complexity in helpers;
5. confirm that the CodeMetrics implementation/configuration was not modified to make the code pass;
6. verify React purity and absence of side effects during render where applicable;
7. verify that types and contracts remain correct;
8. verify that no forbidden workaround or dependency was introduced;
9. run the relevant typecheck, lint, complexity, tests, or other available checks;
10. inspect the final diff for unrelated changes.

Passing automated checks does not replace reviewing the implementation against these rules.

## Enforcement

The following rules **MUST be protected mechanically whenever technically possible**:

- CodeMetrics collected complexity ≤ 5 for every non-exempt function;
- Single Responsibility violations where objective detection is possible;
- forbidden `any` usage;
- prohibited dependency direction;
- circular dependencies;
- forbidden import paths;
- unused code and imports;
- type errors;
- prohibited export patterns;
- architecture-specific file/folder conventions;
- React Rules of Hooks and render-purity constraints where mechanically detectable.

When an automated check fails, the agent **MUST fix the implementation rather than weaken the check**.

## Final Rule

> **Write the smallest clear implementation that satisfies the current requirement, preserves real type and architectural contracts, keeps every individual function single-purpose and within the authoritative CodeMetrics complexity limit, respects React purity, avoids speculative abstraction, and leaves no hidden error or unrelated change behind.**
