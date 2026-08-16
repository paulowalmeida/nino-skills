---
name: audit-utils-adapters
description: "Audit nino-app/apps/manager utils and adapters in src/utils and src/adapters. Use for adapter-vs-constant boundaries, one-adapter-per-domain files, pure-function utils, or names."
---

# Audit utils and adapters

Use `nino-app/` as the working directory. Read the `@constants` vs
`@adapters` section of `code-style.md`. An adapter maps a data key from
`@constants` to a JSX element (`welcomePanelDemo(key)`); one adapter per
file, name matching the domain it adapts (`welcomePanelDemo.adapter.tsx`).
`@utils` holds pure, domain-agnostic helper functions with no JSX and no API
calls — formatting, calculation, small transforms. If a helper renders UI, it
belongs in `@adapters`, not `@utils`; if it fetches or mutates data, it
belongs in `@services`/`@hooks`, not either.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. The test is debugging: a
function name in a stack trace should tell you what it computed or rendered.

Good: `formatCurrencyBRL`, `welcomePanelDemo` — a stack trace with
`formatCurrencyBRL` tells you the bug is in money formatting, not a
generic transform.

Bad: `format`, `helper`, `render2` — a stack trace with `format(x)` could be
formatting a date, a phone number, or a price; you have to open the file to
know which. `render2` implies "another render function like the first"
instead of naming what it renders.

Check file name and exported function name. Report exact file and line; do
not modify code.
