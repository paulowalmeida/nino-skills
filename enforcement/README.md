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

## Current migration

Legacy `audit-*` hooks are being migrated incrementally. Do not recreate legacy one-hook-per-rule behavior merely to preserve file names. Each migrated check must have a documented responsibility and a clear destination in the current rules/skills architecture.

The first enforcement family is architectural import boundaries. Semantic decisions such as component responsibility, cohesion, or whether an abstraction is worthwhile remain Skill-level concerns.
