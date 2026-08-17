# Design System Rules

This file defines **mandatory constraints for any UI implementation**.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Official Source

The `nino-app` Design System source is located at:

```text
packages/ds/src/components/
```

The package's public consumer entry point is `@nino/ds`. The package exports its component catalog through its public package entry point. fileciteturn90file0L2-L6 fileciteturn91file0L2-L6

The current component catalog is defined by the current DS source, including its component export surface. The catalog is **not** defined by this document and MUST NOT be inferred from memory. fileciteturn92file0L2-L6

This project follows a **DS-first, not DS-only** approach.

## External Technical Foundation

For UI testing and accessibility expectations, the project SHOULD align with the same user-facing principles used by the testing stack. For component implementation itself, the current Nino DS source is authoritative.

The DS is an application/project constraint, not an external methodology that the agent may reinterpret.

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

A DS component is suitable when it satisfies the **requested behavior and responsibility** without requiring an adaptation that breaks its contract, semantics, accessibility expectations, or intended purpose.

The following are **NOT sufficient reasons** to abandon a suitable DS component:

- a small visual difference;
- aesthetic preference;
- naming preference;
- personal implementation preference;
- the assumption that a local version would be simpler;
- unfamiliarity with the DS API.

A functional requirement that the DS component cannot support compatibly **MAY** justify composition or a local implementation, subject to the architecture rules.

## Do Not Duplicate the DS

It is **FORBIDDEN** to create an application implementation that is semantically equivalent to an existing DS component when that component satisfies the requirement.

Examples:

```tsx
// ❌ recreate a DS Button
<button className="...">Save</button>
```

```tsx
// ❌ create a local equivalent of Button without a real need
function SaveButton() {
  return <button>Save</button>
}
```

Conceptual example:

```text
DS already provides Select
        ↓
create LocalSelect with the same responsibility
        ↓
❌ FORBIDDEN
```

A local component is acceptable when it adds a **genuinely different responsibility** that the DS component does not provide, while still reusing the DS component when possible.

## DS-First Does Not Mean DS-Forced

Do not force a DS component when it **does not satisfy the actual requirement**.

When the DS has no suitable solution:

- an application-specific component **MAY** be created;
- it **MUST** follow the Atomic Design rules;
- the missing capability must be identifiable from the current DS implementation or API;
- personal preference, convenience, or lack of knowledge of the DS **is NOT justification**.

The agent **MUST NOT declare the DS inadequate without evidence from the current source**.

## Composition Before Duplication

When the DS does not solve the requirement by itself, the agent **MUST** evaluate composition before duplicating an implementation.

Example:

```text
DS Button + application-specific behavior
        ↓
compose the Button
        ✅

recreate Button locally
        ❌
```

Composition must add a real responsibility. A wrapper created only to reproduce the DS API, styling, or semantics **MUST NOT** be created.

## DS Discovery

The agent **MUST NOT assume that a component does not exist**.

It is forbidden to conclude that "the DS does not have it" based only on:

- model memory;
- a single searched name;
- a superficial search;
- inspection of an unrelated file;
- old documentation without confirmation in the current source;
- failure to find an exact filename match.

When a plausible candidate exists, the agent **MUST** inspect its implementation and/or relevant types before rejecting it.

When the requirement is broad, the search **MUST** include semantically related candidates, not only exact-name matches.

## Decision Evidence

For any new UI component, UI replacement, or local UI abstraction, the agent **MUST** be able to identify:

```text
1. the requested requirement;
2. the relevant DS candidates considered;
3. the implementation/types inspected for those candidates;
4. the selected candidate, if any;
5. why it satisfies the requirement;
6. if rejected, the concrete unsupported requirement;
7. if a local implementation is created, why composition was insufficient.
```

A local implementation **MUST NOT** be justified with generic statements such as:

- "it does not fit";
- "the DS does not have this";
- "a custom component is cleaner";
- "it is easier this way".

The reason must be specific and supported by the current repository state.

## DS Imports

The agent **MUST** use the DS public package API when consuming DS components from application code:

```tsx
// ✅ verified public package API
import { Button } from '@nino/ds'
```

Direct deep imports into `packages/ds/src/**` **MUST NOT** be used from consuming application code when the public package API exposes the component.

The agent **MUST NOT** invent or assume a deep import path merely because a matching source file exists.

The current package exports and package metadata are authoritative for the public API. fileciteturn90file0L2-L6 fileciteturn91file0L2-L6

## Do Not Modify the DS for Convenience

During a normal UI task for a consuming application:

- **DO NOT create new components in `packages/ds`** merely to solve a local application need;
- **DO NOT modify an existing DS component** merely to satisfy an application-specific need unless the task explicitly requests it;
- **DO NOT introduce new DS APIs silently**.

A Design System change is an explicit scope/architecture change and must be requested explicitly.

## Mandatory UI Creation Procedure

Before writing UI TSX, the agent **MUST** complete:

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

Before completing a UI task, the agent **MUST verify**:

- whether the custom implementation duplicated something already provided by the DS;
- whether the DS component used actually matches the requirement;
- whether imports use the verified public DS API;
- whether any decision not to reuse the DS has a concrete and repository-supported justification;
- whether the resulting solution follows the architecture rules;
- whether the final diff contains any unrequested local UI duplication or DS modifications.

For UI work, the final report **MUST state**:

```text
DS decision: reused / composed / local
Reason: <concrete repository-supported reason>
```

Passing tests or lint **does not by itself prove** that the DS-first rule was followed.

## Enforcement

Objective rules **MUST** be protected by automated mechanisms whenever technically possible.

### Minimum Expected Enforcement

1. **Imports:** reject direct deep imports into `packages/ds/src/**` from consuming application code when `@nino/ds` exposes the component.
2. **Catalog:** maintain a machine-readable representation of DS components and their official public exports.
3. **Objective duplication:** detect clear local recreations of DS primitives/components where AST or semantic analysis can do so reliably.
4. **Architecture:** detect prohibited-layer implementations that recreate DS components instead of reusing them.
5. **Blocking:** an objective violation MUST fail the check.

Where possible, failure output should include:

- file;
- line;
- violated rule;
- expected DS component;
- official package API.

The agent **MUST fix the cause**. It is **FORBIDDEN to disable, weaken, suppress, or bypass the check** to allow the change.

## Final Rule

> **Searching the Design System is mandatory before creating or replacing any UI. Reusing a suitable existing solution is mandatory. Creating a custom solution requires a real, current, verifiable gap in the DS, composition must be considered before duplication, and application code MUST consume the DS through its verified public API.**
