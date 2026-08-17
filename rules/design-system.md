# Design System Rules

This file defines **mandatory constraints for any UI implementation**.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Official Source and Scope

The Nino Design System source is located at:

```text
nino-app/packages/ds/src/components/
```

The package's public consumer API is `@nino/ds`. The package exposes its component catalog through its public package entry point. The current package exports and source implementation are authoritative; this document MUST NOT be treated as a complete component catalog. fileciteturn90file0L2-L6 fileciteturn91file0L2-L6

For the primary application target:

```text
nino-app/apps/manager/
```

application code MUST consume the Design System through the verified public package API.

The current manager package declares `@nino/ds` as a dependency. fileciteturn51file0L2-L6

The repository contains an internal TypeScript path alias named `@ds/*` for tooling inside `apps/manager`. **That alias MUST NOT be treated as an application-consumer API.** Application code MUST use `@nino/ds` for Design System consumption. fileciteturn56file0L2-L6

## Legacy Code Rule

Existing UI code in `apps/manager` is **observed repository state, not automatic precedent**. Existing code may violate these rules.

The agent MUST NOT copy an existing local implementation merely because it already exists. When modifying legacy code, the agent MUST move the changed area toward these rules when that is within the requested scope, but MUST NOT perform unrelated migrations solely to clean up unrelated legacy violations.

## DS-First Rule

Before creating, editing, replacing, or introducing any application UI, the agent **MUST** follow this order:

1. locate the relevant area of the Design System;
2. search for candidate components by name and responsibility;
3. inspect the implementation and relevant types/props of every plausible candidate needed to make the decision;
4. determine whether a candidate satisfies the requirement;
5. reuse the DS component when it satisfies the requirement;
6. if it does not satisfy the requirement, evaluate composition with the DS before considering a local implementation;
7. only then consider an application-specific implementation.

It is **FORBIDDEN** to create a custom implementation before completing the required DS investigation and composition assessment.

## What "Satisfies the Requirement" Means

A DS component is suitable when it satisfies the requested behavior and responsibility without requiring an adaptation that breaks its contract, semantics, accessibility expectations, or intended purpose.

The following are NOT sufficient reasons to abandon a suitable DS component:

- a small visual difference;
- aesthetic preference;
- naming preference;
- personal implementation preference;
- the assumption that a local version would be simpler;
- unfamiliarity with the DS API.

A functional requirement that the DS component cannot support compatibly MAY justify composition or a local implementation, subject to the architecture rules.

## Do Not Duplicate the DS

It is **FORBIDDEN** to create an application implementation that is semantically equivalent to an existing DS component when that component satisfies the requirement.

A local component is acceptable when it adds a genuinely different responsibility that the DS component does not provide, while still reusing the DS component when possible.

## DS-First Does Not Mean DS-Forced

Do not force a DS component when it does not satisfy the actual requirement.

When the DS has no suitable solution:

- an application-specific component MAY be created;
- it MUST follow the Atomic Design rules;
- the missing capability must be identifiable from the current DS implementation or API;
- personal preference, convenience, or lack of knowledge of the DS is NOT justification.

The agent MUST NOT declare the DS inadequate without evidence from the current source.

## Composition Before Duplication

When the DS does not solve the requirement by itself, the agent **MUST** evaluate composition before duplicating an implementation.

A wrapper created only to reproduce the DS API, styling, or semantics MUST NOT be created.

## DS Discovery

The agent MUST NOT assume that a component does not exist based only on:

- model memory;
- a single searched name;
- a superficial search;
- inspection of an unrelated file;
- old documentation without confirmation in the current source;
- failure to find an exact filename match.

When a plausible candidate exists, the agent MUST inspect its implementation and/or relevant types before rejecting it.

When the requirement is broad, the search MUST include semantically related candidates, not only exact-name matches.

## Decision Evidence

For any new UI component, UI replacement, or local UI abstraction, the agent MUST be able to identify:

```text
1. the requested requirement;
2. the relevant DS candidates considered;
3. the implementation/types inspected for those candidates;
4. the selected candidate, if any;
5. why it satisfies the requirement;
6. if rejected, the concrete unsupported requirement;
7. if a local implementation is created, why composition was insufficient.
```

A local implementation MUST NOT be justified with generic statements such as `it does not fit`, `the DS does not have this`, `a custom component is cleaner`, or `it is easier this way`.

The reason MUST be specific and supported by the current repository state.

## DS Imports

Application code **MUST** use the verified public package API:

```tsx
// ✅ application consumer
import { Button } from '@nino/ds'
```

Direct deep imports into `packages/ds/src/**` **MUST NOT** be used from consuming application code when the public package API exposes the component.

The internal `@ds/*` TypeScript alias **MUST NOT** be used by application components as an alternative consumer API. It exists as repository tooling and does not override the package boundary. fileciteturn56file0L2-L6

The agent MUST NOT invent or assume a deep import path merely because a matching source file exists.

The current package exports and package metadata are authoritative for the public API. fileciteturn90file0L2-L6 fileciteturn91file0L2-L6

## Do Not Modify the DS for Convenience

During a normal UI task for a consuming application:

- DO NOT create new components in `packages/ds` merely to solve a local application need;
- DO NOT modify an existing DS component merely to satisfy an application-specific need unless the task explicitly requests it;
- DO NOT introduce new DS APIs silently.

A Design System change is an explicit scope/architecture change and must be requested explicitly.

## Mandatory UI Creation Procedure

Before writing UI TSX, the agent MUST complete:

```text
[ ] UI requirement identified
[ ] DS area located
[ ] Relevant DS candidates searched
[ ] Relevant candidate implementations/types inspected
[ ] Composition evaluated
[ ] Existing application components searched
[ ] Public DS API verified
[ ] DS vs. local decision made with concrete evidence
[ ] Atomic Design layer determined
[ ] Only then: implementation
```

DO NOT skip a relevant step to accelerate the task.

## Verification Before Completion

Before completing a UI task, the agent MUST verify:

- whether the custom implementation duplicated something already provided by the DS;
- whether the DS component used actually matches the requirement;
- whether imports use the verified public DS API;
- whether any decision not to reuse the DS has a concrete and repository-supported justification;
- whether the resulting solution follows the architecture rules;
- whether the final diff contains any unrequested local UI duplication or DS modifications.

For UI work, the final report MUST state:

```text
DS decision: reused / composed / local
Reason: <concrete repository-supported reason>
```

Passing tests or lint does not by itself prove that the DS-first rule was followed.

## Enforcement

Objective rules MUST be protected by automated mechanisms whenever technically possible.

### Minimum Expected Enforcement

1. reject direct deep imports into `packages/ds/src/**` from consuming application code when `@nino/ds` exposes the component;
2. reject application use of the `@ds/*` internal alias for DS components;
3. maintain a machine-readable representation of DS components and their official public exports;
4. detect clear local recreations of DS primitives/components where AST or semantic analysis can do so reliably;
5. block objective violations.

Where possible, failure output should include file, line, violated rule, expected DS component, and official package API.

The agent MUST fix the cause. It is FORBIDDEN to disable, weaken, suppress, or bypass the check to allow the change.

## Final Rule

> **Search the current Design System before creating or replacing UI. Reuse or compose suitable DS solutions. Create local UI only for a concrete, verifiable gap. Application consumers MUST use the public `@nino/ds` API and MUST NOT treat internal aliases or legacy code as permission to bypass the Design System boundary.**
