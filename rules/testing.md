# Testing Rules

This file defines **mandatory testing constraints** for source code changes. It governs how tests are structured, selected, written, and verified.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Testing Is Part of Implementation

Tests are part of the implementation, not a post-implementation cleanup step.

When a task changes behavior, the agent **MUST determine the required test coverage before implementation is considered complete**.

The agent **MUST NOT** declare a feature complete merely because the application code compiles or lint passes.

## Test Runner

The repository currently uses **Vitest** in relevant packages. The existing repository configuration is authoritative for the exact commands, environment, and package-level behavior. fileciteturn81file0L2-L5

The agent **MUST use the project's configured test runner and scripts** rather than introducing another test framework without an explicit requirement.

Do not introduce Jest, Mocha, or another runner merely because it is familiar or convenient.

## Test Location

For application source under `src/`, tests **MUST live under a dedicated `__tests__/` tree that mirrors the tested `src/` structure**.

Example:

```text
src/
  manager/
    components/
      UserCard.tsx

__tests__/
  manager/
    components/
      UserCard.test.tsx
```

The `__tests__/` tree is for tests only. Production source code **MUST NOT** be placed there.

A test file **MUST correspond clearly to the production unit it covers**.

Existing package-specific conventions that are explicitly documented by the package may remain until migrated, but new application tests **MUST follow this `src` / `__tests__` mirrored structure**.

The repository currently contains colocated `.test.tsx` files in the Design System, which is evidence of an existing package convention; this rule intentionally defines the Nino application convention rather than treating those package files as the standard for new application code. fileciteturn82file0L2-L5

## What Must Be Tested

The agent **MUST prioritize behavior and contracts over implementation details**.

Tests SHOULD cover:

- externally observable behavior;
- business rules;
- state transitions;
- error behavior;
- important edge cases;
- public component behavior;
- Hook contracts;
- Service contracts;
- integration points that materially affect behavior.

The agent **MUST NOT** write tests whose only purpose is to prove that a private implementation detail exists.

## Single Responsibility Applies to Tests

A test function, test case, helper, fixture, and factory **MUST have one clear responsibility**.

A single test **SHOULD verify one behavior or one coherent behavior contract**.

The agent **MUST NOT** create a giant test that verifies unrelated behaviors merely because they share setup.

Shared setup **MUST NOT** hide the behavior being tested.

## Arrange / Act / Assert

Tests **SHOULD** have a clear separation between:

```text
Arrange → Act → Assert
```

The agent **MUST NOT** add incidental setup that is unrelated to the behavior under test.

When a test becomes difficult to understand, the agent **MUST simplify the setup or split the test by responsibility** rather than increasing indirection.

## Test Names

Test names **MUST describe observable behavior or a contract**.

Prefer:

```text
"renders the validation message when the email is invalid"
"calls the save action when the form is submitted"
"returns the expected value when the order is empty"
```

Avoid names such as:

```text
"works"
"test button"
"should render"
"does stuff"
```

A test name **MUST provide enough information to understand the expected behavior without reading the implementation**.

## Mocking

Mocking **MUST be limited to dependencies that are expensive, external, nondeterministic, unavailable, or whose real implementation would make the test inappropriate for its purpose**.

The agent **MUST NOT** mock the unit under test merely to make the test easier to write.

The agent **MUST NOT** replace meaningful business behavior with mocks and then claim that the business behavior was tested.

When a real dependency is cheap, deterministic, and part of the behavior contract, prefer exercising the real dependency.

## Zustand Tests

When testing application state managed by Zustand:

- tests **MUST verify observable state and actions**;
- tests **MUST NOT** depend on Zustand's internal implementation details;
- each test **MUST isolate or reset application state** so that test order cannot change results;
- tests **MUST NOT** rely on state leaked from another test.

When a Page, Provider, Guard, Loader, Template, or approved Custom Hook consumes a Zustand Store Hook, tests **SHOULD verify the observable behavior produced by that state consumption**, not merely that the Hook was called.

Atoms, Molecules, and Organisms **MUST remain tested without requiring application-level Zustand state**, in accordance with `rules/hooks.md`.

## UI Tests

UI tests **MUST test user-observable behavior and contracts**.

The agent **MUST NOT** make tests depend unnecessarily on:

- internal component state variable names;
- private helper functions;
- implementation-specific DOM structure;
- CSS class names when semantic queries can be used;
- exact component internals that are not part of the public contract.

Prefer semantic queries and observable outcomes when the selected testing tools support them.

## Business Logic Tests

Business rules located outside TSX **MUST be testable independently from the UI whenever practical**.

Utilities, domain logic, Service operations, selectors, and custom Hooks that contain meaningful behavior **SHOULD have focused tests for their contracts**.

Do not move business logic into TSX merely to avoid writing a focused test.

## Edge Cases and Failure Paths

The agent **MUST consider failure behavior and important boundary conditions**, not only the happy path.

When a function has branches that represent materially different outcomes, the test suite **MUST cover the relevant branches that are part of the required behavior**.

At minimum, consider:

- empty inputs;
- missing/optional values;
- invalid input;
- expected failure responses;
- boundary values;
- permission or authorization outcomes when applicable.

Do not generate meaningless tests solely to increase coverage percentage.

## Regression Protection

When fixing a bug, the agent **MUST add or update a regression test that reproduces the bug at the appropriate level** unless a documented technical reason makes that impractical.

The regression test **MUST fail before the fix and pass after the fix** when the test can be executed against the affected behavior.

## Coverage

Coverage percentage is **evidence, not proof of correctness**.

The agent **MUST NOT** optimize for coverage numbers by adding meaningless assertions or tests.

A high coverage percentage with weak behavioral assertions **MUST NOT** be treated as sufficient verification.

Where the repository defines coverage thresholds, those thresholds **MUST** be respected.

## Test Data and Fixtures

Fixtures, factories, and test data builders **MUST have clear responsibilities**.

The agent **MUST NOT** create a giant universal fixture when smaller explicit test data makes the behavior clearer.

Test data **SHOULD** be deterministic and explicit enough that failures can be understood from the test itself.

## Async Tests

Async behavior **MUST** be awaited and verified through observable completion or failure.

The agent **MUST NOT** rely on arbitrary timeouts to make asynchronous tests pass.

Prefer deterministic synchronization provided by the test framework or testing utilities.

## Test Isolation

Each test **MUST** be independently executable.

Tests **MUST NOT** depend on:

- execution order;
- mutable module state left by another test;
- previous test output;
- shared Zustand state that is not reset;
- external services that are not part of a controlled test environment.

When shared resources are required, the test suite **MUST** establish and clean up them deterministically.

## No Test Circumvention

The agent **MUST NOT**:

- disable tests merely because they fail;
- skip a test without an explicit, documented reason;
- weaken an assertion to make a failing test pass;
- mock away the behavior under investigation;
- change test configuration to conceal a defect;
- delete a regression test because the underlying bug is inconvenient.

A failing test is evidence that must be investigated, not an obstacle to be hidden.

## Verification Before Completion

Before completing a coding task, the agent **MUST**:

1. identify which changed behaviors require tests;
2. inspect existing relevant tests before creating duplicates;
3. add or update focused tests for the changed behavior;
4. run the relevant test file(s);
5. run the broader relevant package/project test suite when practical;
6. investigate every unexpected failure;
7. verify that no test was weakened, skipped, or removed without an explicit reason;
8. inspect the final diff and confirm that tests reflect the requested behavior.

Passing the test suite **does not prove** that every user requirement was implemented correctly.

## Enforcement

The following rules **MUST be protected mechanically whenever technically possible**:

- test file naming and location conventions;
- test discovery/configuration;
- TypeScript errors in tests;
- lint rules applying to test code;
- forbidden test skips or focused-only modes where enforceable;
- coverage thresholds when the project defines them;
- dependency restrictions between production and test-only code.

When an automated test or test-related check fails, the agent **MUST fix the underlying issue rather than weaken the test or the enforcement rule**.

## Final Rule

> **Tests must prove observable behavior, protect contracts and regressions, remain isolated and deterministic, and never be weakened merely to make the suite pass.**
