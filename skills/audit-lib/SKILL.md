---
name: audit-lib
description: "Audit nino-app/apps/manager infrastructure in src/lib. Use for lib-vs-service boundaries, resource-agnostic infrastructure, or names."
---

# Audit lib

Use `nino-app/` as the working directory. Read the `@services` vs `@lib`
section of `code-style.md`. `@lib` holds infrastructure that talks to no
specific API resource — low-level HTTP transport, locks, and similar plumbing
(`http-client.ts`, `refresh-lock.ts`). If a file talks to a specific API
resource (order, product, tenant), it belongs in `@services`, not `@lib`.

## Nomes autoexplicativos

A name is self-explanatory when reading it alone — no opening the file, no
extra context — already tells what it is or does. The test is debugging: a
name in a stack trace or an import list should tell you what infrastructure
piece failed, without opening the file.

Good: `createHttpClient`, `refreshLock` — each names the exact piece of
infrastructure it provides. Seeing `refreshLock.acquire()` in a trace, you
know immediately it's the token-refresh concurrency lock.

Bad: `helper`, `utils`, `client2` — `helper`/`utils` describe a category, not
a capability; opening a stack trace with `utils.run()` tells you nothing
about what ran. `client2` implies "another client like the first one"
instead of naming what it's a client for.

Check file name and exported name. Report exact file and line; do not modify
code.
