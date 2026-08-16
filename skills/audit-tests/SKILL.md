---
name: audit-tests
description: "Audit and complete nino-app/apps/manager tests in src/__tests__. Use for missing test coverage, non-colocated test structure, describe/it conventions, mock file separation, AAA comments, or test names."
---

# Audit tests

Use `nino-app/` as the working directory. Read `testing.md`. Unlike other
audit skills, this one modifies code: for every eligible file (component,
service, hook, util) with no test, create one covering happy path, edge
cases (empty list, null, empty string), and the error scenario — testing.md
has no exemption for legacy files. For files that already have a test, audit
against the standards below and report violations; do not silently rewrite
an existing test to fix a violation, report it like every other audit skill.

Tests live in `src/__tests__/`, mirroring `src/` structure, importing the
tested file by its normal path alias — never a relative path or co-located
file. One `describe(Component.name, ...)` per file, no nesting; distinguish
context in the `it()` name instead. Mocks live in a sibling `<name>.mock.ts`,
never inline in the `.test.tsx`. Every `it()` with more than one line of body
has Arrange/Act/Assert comments (or combined `// Arrange / Act` when they
share a line). No `as any` or `as never` in mocks — use
`Partial<T>`/`Pick<T, ...>` or `as unknown as T`. Never build a helper just
to satisfy the test (e.g. `createAxiosResponse`) — that signals the
implementation leaks raw HTTP structure; fix the service instead.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. The test is debugging: a
failing test's name and its fixture variables should tell you what broke
without reading the test body.

Good: `it('reorders the cache optimistically before the request resolves')`
with a fixture named `inactiveContract` — a failure message alone tells you
which behavior broke and what data triggered it.

Bad: `it('test 1')` with a fixture named `data` — a failure only tells you
"test 1 failed," forcing you to open the file and read every line to learn
what was being verified. Also bad: `fn`, `mockFn`, `emptyList` reused for
three different scenarios in the same file.

Check `describe`/`it` strings, fixture/mock variable names, and helper names.
Report exact file and line for a violation; for a missing test, write it
following every convention above.
