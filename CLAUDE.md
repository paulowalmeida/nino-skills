# Nino — Agent Rules

This file is the agent's **mandatory operational contract**. Its purpose is to reduce improvisation, architectural drift, and unsupported claims.

## Fundamental rule

The agent **MUST implement according to the project's rules from the first step of the task**.

The rules are **NOT a checklist for a post-implementation audit**.

The agent **MUST NOT edit first and attempt to conform afterward**.

## Authority hierarchy

1. **Explicit user instructions** have priority, provided they do not violate higher-level system/platform constraints.
2. `rules/` defines the project's permanent rules.
3. Skills define mandatory procedures for specific task types.
4. Hooks, linters, tests, AST checks, and other automated checks are enforcement mechanisms and **MUST NOT be bypassed**.

If project rules conflict and no explicit precedence exists:

- **DO NOT invent a resolution**;
- **DO NOT arbitrarily choose the more convenient rule**;
- stop implementation and identify the conflict.

## Mandatory preflight before any change

Before any `Write`, `Edit`, file creation, deletion, rename, or move, the agent **MUST complete these steps, in order**:

1. **Understand the request:** identify exactly what must change and what was not requested.
2. **Identify applicable rules:** locate the relevant files under `rules/` and the Skills applicable to the task type and affected paths.
3. **Read applicable rules:** locating a file is not enough; the relevant rules MUST actually be read before implementation decisions are made.
4. **Inspect existing code:** read the necessary context from files being modified and from directly related components/layers.
5. **Search for existing solutions:** look for existing components, Hooks, Services, utilities, patterns, and APIs before creating alternatives.
6. **For UI, MUST search the Design System first.**
7. **Determine the correct responsibility and architectural layer** before creating or moving code.
8. **Only then implement.**

If a relevant step cannot be completed with confidence, **DO NOT invent an answer**. Continue investigating or report the limitation/conflict.

## Implementation rules

During implementation, the agent:

- **MUST continuously follow the applicable rules**;
- **MUST NOT use personal preference as justification for violating an established project standard**;
- **MUST NOT create a second solution when an adequate existing solution already exists**;
- **MUST NOT introduce new abstractions, libraries, patterns, or structures without a demonstrated need for the task**;
- **MUST NOT create silent architectural exceptions**;
- **MUST NOT turn a task-specific exception into a general project rule**;
- when the agent's preferred solution conflicts with a project rule, the project rule wins.

## Closed scope

Do **ONLY what the task requests and what is strictly necessary to complete it correctly**.

The following are **PROHIBITED**:

- opportunistic refactoring;
- unrelated cleanup;
- file reorganization based on preference;
- renaming outside the requested scope;
- library replacement without necessity;
- unrelated behavior changes;
- abstractions created "for the future" without a current requirement;
- fixing unrelated problems discovered during the task, unless they directly block completion.

The absence of an explicit request MUST be treated as **permission denied for changes**, unless the additional change is technically indispensable to fulfill the request.

## Enforcement — failure must trigger correction

When a hook, lint, test, AST check, or other automated check blocks a change:

1. **Read the complete violation message.**
2. Identify exactly which rule was violated.
3. Correct the implementation while respecting the rule.
4. Run the relevant check again.
5. Repeat until it passes or until a real conflict prevents completion.

The following are **PROHIBITED**:

- disabling the check;
- lowering its severity;
- editing configuration to hide the violation;
- adding an exception solely to make the change pass;
- ignoring the failure without reporting it.

## Search is not inspection

`grep`, `rg`, `find`, editor searches, and equivalent tools are **location tools**.

A search:

- **DOES NOT prove** that a file was read;
- **DOES NOT prove** that an entire directory was audited;
- **DOES NOT prove** that an architecture is correct;
- **MUST NOT** be used as justification for claiming that something does not exist without adequate coverage.

When a task requires complete inspection, the agent **MUST determine the complete relevant file set and inspect each required file**.

The agent **MUST NOT claim** "I read everything," "audited it," "there are no errors," or equivalent statements when inspection was partial.

## Evidence and claims

The agent **MUST distinguish discovery from conclusion**.

Examples:

- finding a name with `grep` = location evidence;
- reading the file and its context = inspection evidence;
- running a test = evidence for that test;
- running lint = evidence for the rules covered by that lint;
- passing a check = evidence only for what that check actually verifies.

**Never generalize the result of a verification beyond what it actually proved.**

## Mandatory verification before completion

Before stating that the task is complete, the agent **MUST**:

1. review every explicit user requirement individually;
2. review the changed files and confirm that the changes match the request;
3. verify the applicable architectural rules;
4. run the relevant available tests/checks;
5. analyze the results, not merely whether output exists or errors are absent;
6. inspect the final diff for unintended changes;
7. report limitations when a required verification cannot be performed reliably.

**Passing tests does not replace verification of the user's requirements.**

**Do not claim success without sufficient evidence.**

## Fail-closed mode

When critical information is missing for an architectural decision, the default behavior is:

> **Investigate before editing.**

The following are not valid justifications for making an unsupported decision:

- "probably";
- "it should exist";
- "it looks correct";
- "this is simpler";
- "this is probably the project standard".

When the information can be obtained from the repository, **obtain it before deciding**.

## General prohibitions

The agent **MUST NOT**:

- ignore rules because they are stored in another file;
- treat a rule as optional merely because automated enforcement does not exist yet;
- replace a project rule with personal preference;
- claim compliance without sufficient evidence;
- accept an implementation as "good enough" when it violates an explicit rule;
- invent an API, component, pattern, structure, or exception to fill an information gap without investigation;
- edit code based only on memory when the source of truth can be consulted in the repository.

## Final principle

**Investigate first. Decide second. Implement third. Verify fourth.**

Never reverse this order when the preceding step is necessary to perform the task correctly.
