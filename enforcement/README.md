# Nino Mechanical Enforcement

This directory contains project-independent mechanical checks used by the Nino skills system.

## Contract

Mechanical enforcement must:

- inspect only properties that can be determined reliably from source structure;
- emit deterministic diagnostics;
- distinguish warnings from blocking violations;
- never treat a metric as a semantic maintainability verdict;
- fail closed for explicit architectural boundary violations when the rule defines them as blocking;
- remain usable by a consuming repository without requiring that repository to be modified.

## Boundary modes

Each architecture rule declares one dependency mode:

- `direct`: checks only the source module's immediate imports. Use this for UI composition rules where valid hierarchy paths are intentionally transitive (for example, `Page → Template → Organism`).
- `transitive`: checks the reachable dependency graph. Use this for boundaries that must not be bypassed through barrels, wrappers, aliases, or intermediary modules (for example, prohibited application-state access from lower UI layers).

This distinction is intentional. A generic transitive ban on UI layers would incorrectly reject valid composition through an authorized intermediate layer.

## Current enforcement model

The legacy `audit-*` family has been removed. The current hook layer is composed of narrow `enforce-*` hooks for objectively observable invariants, backed by shared executable runtime in `hooks/hook-kit.mjs`.

Semantic responsibilities such as component responsibility, cohesion, abstraction quality, and maintainability remain owned by Skills and rules rather than being encoded as brittle blocking regexes.

Complexity remains diagnostic: `tools/complexity-analyzer.mjs` produces structural signals that feed semantic review. It is not a universal hard gate based on arbitrary thresholds.

The separate `hooks/nino-api-rules.mjs` family remains independent from the frontend audit migration and continues to enforce nino-api-specific rules.
