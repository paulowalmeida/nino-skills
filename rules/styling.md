# Styling Rules

This file defines **mandatory styling constraints** for application and Design System UI implementation.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Project Styling Foundation

The Nino application uses **Tailwind CSS v4** as its primary styling system, with `clsx` and `tailwind-merge` available for conditional and conflict-resolved class composition. The repository explicitly depends on Tailwind CSS, `@tailwindcss/postcss`, `@tailwindcss/vite`, `clsx`, and `tailwind-merge`.

The Design System is also implemented with Tailwind CSS v4 and uses CSS-first theme variables through `@theme`, source registration through `@source`, and custom utilities through `@utility`.

Tailwind's official documentation describes utility classes as the primary styling mechanism and CSS customizations as an explicit escape hatch when needed. Tailwind v4 uses CSS-first configuration, theme variables, native cascade layers, and `@utility` for custom utilities.

## Primary Styling Rule

For application UI, the agent **MUST prefer the project's established Tailwind utility classes and the existing Design System before introducing new CSS**.

The agent **MUST NOT** create bespoke styling systems, CSS-in-JS solutions, arbitrary styling libraries, or a second utility framework without an explicit project requirement.

The agent **MUST NOT** replace Tailwind with CSS Modules, styled-components, Emotion, inline-style objects, or another styling mechanism merely because it is more familiar or locally convenient.

Nino's project decision is to use the existing Tailwind-based stack unless a specific rule or component contract requires otherwise.

## Design System First

Styling MUST follow `rules/design-system.md`.

Before inventing colors, typography, spacing, radii, shadows, focus states, animations, or component styling, the agent **MUST inspect the existing Design System tokens and component implementation**.

The Design System's theme variables are the project's source of truth for shared visual tokens when the relevant token exists.

The agent **MUST NOT** recreate a DS token as a local arbitrary value when the required semantic token already exists.

A raw value is permitted only when the design requirement genuinely requires a value that is not represented by the project token system and the reason is concrete.

## Token Usage

When a visual value represents a reusable design decision, the agent **MUST prefer a named theme token over a one-off literal**.

This applies to:

- colors;
- typography;
- spacing scales;
- radii;
- shadows;
- breakpoints;
- animation timing/easing when standardized;
- other recurring visual values.

A token **MUST NOT** be introduced solely to name a value used once unless naming it establishes a meaningful project-level contract.

## Arbitrary Values

Tailwind arbitrary values **MAY** be used when an actual design requirement cannot be represented accurately by the existing token/utility system.

The agent **MUST NOT** use arbitrary values as a substitute for searching existing tokens.

The agent **MUST NOT** use arbitrary values merely to imitate an existing Design System token or avoid using an existing utility.

## Conditional Classes

Conditional styling **MUST** use the project's established class-composition mechanism.

When class values are conditional or composed from multiple sources, the agent **SHOULD** use the project's `clsx` + `tailwind-merge` pattern rather than manual string concatenation when that pattern is available. The Design System's established helper is the preferred implementation for this responsibility.

The agent **MUST NOT** create a second `cn`, `classNames`, `cx`, or equivalent helper when an established project helper already exists for the same responsibility.

The agent **MUST NOT** manually concatenate classes with fragile string expressions when the existing helper can express the composition safely.

## Tailwind Conflict Resolution

When multiple Tailwind classes can target the same property, the project's conflict-resolution helper **MUST** be used when dynamic class composition makes precedence ambiguous.

The agent **MUST NOT** rely on incidental class ordering when `tailwind-merge` can resolve the conflict explicitly.

The agent **MUST NOT** duplicate conflicting utilities and assume the browser's cascade will produce the intended result.

## Responsive Styling

Responsive behavior **MUST** use Tailwind's responsive variants and the project's established breakpoint system.

The agent **MUST NOT** invent a parallel breakpoint scale in component code.

Responsive rules **MUST** represent meaningful layout behavior rather than arbitrary breakpoint-specific overrides.

## State and Accessibility Styling

Interactive elements **MUST** define required visual states through the existing component/DS contract and appropriate Tailwind state variants where applicable, including states such as:

- hover;
- focus-visible;
- active;
- disabled;
- selected/checked;
- invalid;
- loading;
- expanded/open/closed.

The agent **MUST NOT** remove a visible focus indicator without replacing it with an equally clear accessible focus treatment.

The agent **MUST NOT** style only the happy state when an interactive component has meaningful disabled, error, loading, or focus behavior.

Visual styling **MUST NOT** be used to hide semantic accessibility problems.

## Layout and Spacing

Layout responsibilities **MUST** remain expressed through the component's structural classes and existing token/utility system.

The agent **MUST** prefer standard Tailwind layout utilities (`flex`, `grid`, sizing, gap, padding, margin, alignment, positioning, overflow, etc.) before introducing custom CSS.

The agent **MUST NOT** create a custom CSS class for a layout pattern that is already clearly expressible through existing Tailwind utilities.

When repeated layout semantics genuinely represent a reusable component contract, the abstraction belongs in the component/Design System layer rather than a global bag of unrelated CSS classes.

## Custom CSS

Plain CSS **MAY** be used when Tailwind utilities are not an appropriate representation of the requirement.

Acceptable reasons include:

- complex selectors;
- pseudo-elements or browser-specific behavior not reasonably expressed through utilities;
- keyframe animations or transitions that belong to a shared component/system contract;
- third-party library integration;
- global/base styles;
- custom utilities intentionally registered in the Design System.

When custom CSS is required, the agent **MUST place it at the narrowest correct scope**.

The agent **MUST NOT** add unrelated global CSS for a local component requirement.

## Custom Utilities

Shared styling behavior that truly represents a reusable utility **MAY** be defined as a Tailwind v4 custom utility using `@utility` in the appropriate styling source.

The agent **MUST NOT** create custom utilities merely to hide long class strings or avoid learning existing utilities.

Custom utilities **MUST** have a clear semantic responsibility and a demonstrated reuse case.

## Global CSS

Global CSS **MUST** be reserved for genuinely global concerns such as:

- design tokens/theme variables;
- base document styles;
- shared animations used across components;
- globally registered utilities;
- global third-party integration requirements.

The agent **MUST NOT** add component-specific selectors to global CSS when the same concern can be expressed locally through the component or a scoped style mechanism.

## Inline Styles

Inline `style={{ ... }}` **MUST NOT** be used for static styling when the same result can be represented through Tailwind utilities or the Design System.

Inline styles **MAY** be used for genuinely runtime-calculated values or APIs that require a JavaScript style object, provided they do not replace an existing project token or styling primitive.

The agent **MUST NOT** use inline styles simply to avoid creating or composing the correct Tailwind classes.

## Animations and Motion

Animations **MUST** use the project's established animation mechanisms.

When motion is a reusable visual behavior, the agent **MUST** check the Design System before creating local animation definitions.

The agent **MUST NOT** introduce JavaScript-driven animation when CSS/Tailwind state or transition mechanisms are sufficient.

When an existing component uses an animation library as part of its contract, consumers **MUST NOT** recreate equivalent motion locally without a concrete requirement.

## Naming and Organization of Styling Code

Styling abstractions **MUST** have names that communicate their semantic purpose.

The agent **MUST NOT** create generic names such as:

```text
.common
.shared
.helper
.styles
.custom
```

unless the repository already defines that exact convention for a specific responsibility.

A styling abstraction **MUST** live at the narrowest correct scope:

```text
Element-specific styling
    → component

Reusable component styling
    → component / Design System

Reusable semantic token
    → theme / Design System

Global/base styling
    → global stylesheet
```

## No Style Duplication

The agent **MUST NOT** duplicate an existing Design System visual implementation locally.

Before introducing local styling, the agent **MUST** search for:

1. the relevant Design System component;
2. existing theme tokens;
3. existing reusable utilities;
4. existing application styling abstractions with the same semantic responsibility.

If an existing solution is suitable, it **MUST** be reused or composed.

## Style Containment

Styling changes **MUST NOT** leak unintentionally into unrelated components or pages.

The agent **MUST** prefer the narrowest scope that satisfies the requirement.

Global selectors, element selectors, broad descendant selectors, and `!important` **MUST NOT** be introduced for a local problem unless the project-wide impact is intentional, documented, and necessary.

The agent **MUST NOT** use `!important` as a routine conflict-resolution mechanism.

## No Styling Workarounds

The agent **MUST NOT**:

- add CSS solely to compensate for using the wrong component;
- duplicate a DS component's styles instead of reusing the component;
- create arbitrary tokens for one-off values without a semantic reason;
- introduce another styling framework;
- weaken accessibility states to satisfy visual preferences;
- use `!important` to bypass correct cascade/design decisions;
- create global CSS to avoid a local component change;
- bypass Tailwind's established class-composition helper with a duplicate utility.

## Styling Decision Gate

Before introducing a new styling mechanism, token, custom utility, global selector, or custom CSS block, the agent **MUST** be able to answer:

1. What concrete visual requirement needs it?
2. Which DS component and tokens were evaluated first?
3. Which existing Tailwind utility or variant was considered?
4. Why is the existing styling system insufficient?
5. Why is this the narrowest correct scope?
6. What future maintenance or cascade cost does it introduce?

If these answers cannot be established from the repository and task context, the agent **MUST NOT** introduce the new styling mechanism.

## Verification Before Completion

Before completing a styling task, the agent **MUST**:

1. verify the relevant DS component and token usage;
2. verify that existing Tailwind utilities were considered before custom CSS;
3. verify that semantic tokens were used where applicable;
4. verify that conditional class composition uses the established helper when needed;
5. verify responsive and interaction states;
6. verify that styles do not leak beyond intended scope;
7. verify that no duplicate styling primitive or framework was introduced;
8. verify that accessibility-related focus/disabled/invalid states remain intact;
9. run the relevant lint, typecheck, tests, and build/style checks available for the affected package;
10. inspect the final diff for unrelated styling changes.

## Enforcement

The following rules **MUST** be protected mechanically whenever technically possible:

- forbidden styling-library imports;
- duplicate class-composition helpers;
- direct deep DS imports;
- forbidden global selectors where objective detection is feasible;
- prohibited `!important` usage where the rule applies;
- prohibited style-file locations;
- invalid or forbidden design-token references where detectable;
- formatting and CSS syntax errors;
- unused CSS where the toolchain can detect it.

When an automated styling check fails, the agent **MUST** fix the implementation rather than weaken or bypass the check.

## External Technical Authority

The project styling foundation is informed by:

- Tailwind CSS — Styling with utility classes: https://tailwindcss.com/docs/styling-with-utility-classes
- Tailwind CSS — Adding custom styles: https://tailwindcss.com/docs/adding-custom-styles
- Tailwind CSS — Theme variables: https://tailwindcss.com/docs/theme
- Tailwind CSS — Responsive design: https://tailwindcss.com/docs/responsive-design
- Tailwind CSS — Hover, focus, and other states: https://tailwindcss.com/docs/hover-focus-and-other-states
- Tailwind CSS v4 announcement / architecture: https://tailwindcss.com/blog/tailwindcss-v4

External documentation defines framework behavior and mechanisms. **Nino-specific Design System, scope, and architectural rules remain authoritative for this project.**

## Final Rule

> **Use the existing Design System and Tailwind token/utility system first, introduce custom styling only for a concrete verified gap, keep styling at the narrowest correct scope, preserve interaction and accessibility states, and never create a second styling system to solve a local problem.**
