---
name: hook-state-review
description: Review React Hooks, state, providers, guards, and loaders in nino-app for ownership, data-flow direction, side-effect boundaries, and composable responsibilities.
---

# Hook and State Review

## Purpose

Determine whether state and side effects live in the correct abstraction and whether Hooks remain focused on orchestration rather than UI or hidden domain policy.

## Review

1. Identify what state represents and who should own it.
2. Separate server state, local interaction state, derived state, and global/application state.
3. Check whether fetching/mutations belong in the expected Hook/service boundary.
4. Verify Providers expose state or capabilities without becoming dumping grounds for unrelated policy.
5. Check guards/loaders for route concerns only; business behavior belongs below them.
6. Inspect dependencies and callers when local code does not explain ownership.

## Gates

Flag:

- JSX/presentation embedded in a Hook;
- a Hook directly owning unrelated UI composition;
- server state copied into local/global state without a clear reason;
- a Provider containing unrelated application workflows;
- state owned at a broader scope than its consumers require;
- duplicated derived state that can be computed safely;
- service/business policy hidden inside a UI state abstraction;
- effect-driven synchronization that should be derived data or an explicit event;
- a Hook that exposes an unstable or overly broad contract merely to hide complexity.

## Evidence

Report state category, current owner, expected owner, side-effect boundary, and the smallest change that improves responsibility without adding unnecessary abstraction.
