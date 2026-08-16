# Design System Rules

This file defines **mandatory constraints for any UI implementation**.

## Official Source

The `nino-app` Design System is located at:

```text
packages/ds/src/components/
```

This code is the **official source of truth** for UI component reuse.

The DS currently contains, among others, components such as `Button`, `Dialog`, `Card`, `Input`, `Label`, `Toast`, `Alert`, `Switch`, `Slider`, `Drawer`, `Select`, `Avatar`, `Popover`, `Spinner`, `Tabs`, `Menu`, `Table`, `Badge`, `Tooltip`, and `Stepper`.

The list above is illustrative only. **The current DS source code always takes precedence over memory or documentation examples.**

## DS-First Rule

The Design System is **DS-first, not DS-only**.

Before creating, editing, or replacing any application UI, the agent **MUST** follow this order:

1. locate the relevant area of the Design System;
2. search for candidate components by name and responsibility;
3. inspect the implementation and relevant types/props of plausible candidates;
4. determine whether a candidate satisfies the requirement;
5. reuse the DS component when it satisfies the requirement;
6. only then consider an application-specific implementation.

**It is FORBIDDEN to create a custom implementation before completing the required DS investigation.**

## What "Satisfies the Requirement" Means

A DS component is suitable when it satisfies the **requested behavior and responsibility** without requiring an adaptation that breaks its contract, semantics, or intended purpose.

A small visual difference, aesthetic preference, or personal preference of the agent **is NOT sufficient justification** for abandoning an existing DS component.

A functional requirement that the DS component cannot support compatibly **MAY justify composition or a local implementation**, subject to the architecture rules.

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

## DS-First Does Not Mean DS-Forced

Do not force a DS component when it **does not satisfy the actual requirement**.

When the DS has no suitable solution:

- an application-specific component **MAY** be created;
- it **MUST** follow the Atomic Design rules;
- the lack of a suitable DS solution is the justification for creating it locally;
- personal preference, convenience, or lack of knowledge of the DS **is NOT justification**.

## Composition Before Duplication

When the DS does not solve the requirement by itself, the agent **MUST evaluate composition before duplicating an implementation**.

Example:

```text
DS Button + application-specific behavior
        ↓
compose the Button
        ✅

recreate Button locally
        ❌
```

Composition must add real responsibility. A wrapper with no meaningful responsibility, created only to reproduce the DS API/style, is suspect and should be avoided.

## DS Discovery

The agent **MUST NOT assume that a component does not exist**.

It is also forbidden to conclude that "the DS does not have it" based only on:

- model memory;
- a single searched name;
- a superficial search;
- inspection of an unrelated file;
- old documentation without confirmation in the current source.

When a plausible candidate exists, the agent **MUST inspect its implementation and/or relevant types before rejecting it**.

## Decision Evidence

For any new UI component or component replacement, the agent must be able to identify:

```text
1. the requested requirement;
2. the DS components considered;
3. the selected candidate, if any;
4. why it satisfies the requirement;
5. or which concrete gap prevented its reuse.
```

If a local implementation is created because the DS does not satisfy the requirement, **the reason MUST be specific and verifiable**, not a generic statement such as "it does not fit".

## DS Imports

When the project exposes a public/official import API for the DS, the agent **MUST use that API**.

It is **FORBIDDEN** to access internal DS files through deep paths when a public consumer entry point exists.

Conceptual example:

```tsx
// ✅ public DS API
import { Button } from '@ds/components/Button'

// ❌ arbitrary internal path when not a public API
import { Button } from '@ds/components/Button/Button'
```

The actual repository implementation is authoritative for determining the official import path.

## Do Not Modify the DS for Convenience

During a normal UI task for a consuming application:

- **DO NOT create new components in `packages/ds`** merely to solve a local application need;
- **DO NOT modify an existing DS component** merely to satisfy an application-specific need unless the task explicitly requests it;
- **DO NOT introduce new DS APIs silently**.

A Design System change is an explicit scope/architecture change and must be requested explicitly.

## Mandatory UI Creation Procedure

Before writing UI TSX, the agent **MUST complete**:

```text
[ ] UI requirement identified
[ ] DS searched
[ ] Relevant candidate(s) inspected
[ ] Composition evaluated
[ ] Existing application components searched
[ ] DS vs. local decision made
[ ] Atomic Design layer determined
[ ] Only then: implementation
```

**DO NOT skip a relevant step to accelerate the task.**

## Verification Before Completion

Before completing a UI task, the agent **MUST verify**:

- whether the custom implementation duplicated something already provided by the DS;
- whether the DS component used actually matches the requirement;
- whether imports follow the official API;
- whether any decision not to reuse the DS has a concrete justification;
- whether the resulting solution follows the architecture rules.

Passing tests or lint **does not by itself prove** that the DS-first rule was followed.

## Enforcement

Objective rules should be protected by automated mechanisms whenever possible.

### Minimum Expected Enforcement

1. **Imports:** detect forbidden DS import paths and DS imports outside the official API.
2. **Catalog:** maintain a machine-readable representation of DS components, official imports, and responsibilities.
3. **Objective duplication:** detect clear local recreations of DS primitives/components.
4. **Architecture:** detect prohibited-layer implementations that recreate DS components instead of reusing them.
5. **Blocking:** an objective violation MUST fail the check.

Where possible, failure output should include:

- file;
- line;
- violated rule;
- expected DS component;
- official import path.

The agent **MUST fix the cause**. It is **FORBIDDEN to disable or weaken the check** to allow the change.

## Final Rule

> **Searching the Design System is mandatory before creating or replacing any UI. Reusing a suitable existing solution is mandatory. Creating a custom solution requires a real, verifiable gap in the DS.**
