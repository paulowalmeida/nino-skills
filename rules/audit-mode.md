# Audit Mode

When the user asks for an audit, review, inspection, assessment, retrospective audit, or compliance check and does not explicitly request implementation, the task is **read-only**.

## MUST NOT

- modify source code;
- create, delete, rename, or move files;
- add or remove imports;
- create Templates, Components, Hooks, Services, utilities, tests, or configuration;
- add comments, documentation comments, TODOs, annotations, or explanatory text inside source files;
- refactor code merely to make the audit result cleaner;
- implement a proposed correction without explicit authorization.

## Allowed Output

Proposed corrections belong in the audit report only. The report MUST distinguish confirmed violations from recommendations.

If the user explicitly authorizes one proposed change during the audit, only that specific change becomes implementation scope. Re-run the normal implementation preflight for that change.

Allowing one individual change does not authorize unrelated findings to be fixed.

## Audit Result Integrity

The auditor MUST NOT create code merely to demonstrate that a rule could be satisfied. Existing architecture is evidence to inspect, not a blank slate to redesign during an audit.
