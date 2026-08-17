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

The direct/transitive distinction follows the same conceptual separation used by established dependency-analysis tooling, which distinguishes ordinary dependency rules from reachable/transitive dependency rules. See dependency-cruiser's rule reference for the `reachable` mechanism.

## Current migration

Legacy `audit-*` hooks are being migrated incrementally. Do not recreate legacy one-hook-per-rule behavior merely to preserve file names. Each migrated check must have a documented responsibility and a clear destination in the current rules/skills architecture.

The first enforcement family is architectural import boundaries. Semantic decisions such as component responsibility, cohesion, or whether an abstraction is worthwhile remain Skill-level concerns.
