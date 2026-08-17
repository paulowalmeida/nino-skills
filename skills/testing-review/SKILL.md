---
name: testing-review
description: Review nino-app tests for behavior coverage, boundary quality, isolation, maintainability, and alignment with the project's testing rules.
---

# Testing Review

## Purpose

Evaluate whether tests protect meaningful behavior and boundaries rather than merely increasing line coverage or mirroring implementation details.

## Review

1. Identify the behavior or contract being protected.
2. Check whether the test observes that contract through the narrowest stable boundary.
3. Verify important branches, failure paths, permissions, loading/error behavior, and integration boundaries are covered where applicable.
4. Detect tests coupled to private implementation details or exact incidental structure.
5. Confirm shared setup does not hide important preconditions.

## Gates

Flag:

- tests that only assert implementation details while missing user-visible/business behavior;
- snapshots used where an explicit behavioral assertion is clearer;
- missing failure-path coverage for meaningful error behavior;
- mocking the unit's own logic instead of its external boundary;
- duplicated setup that obscures the scenario;
- tests that pass for the wrong reason;
- brittle selectors or assertions that encode incidental markup;
- large test fixtures that make the tested behavior hard to identify.

## Evidence

Report the intended contract, current assertion, missing risk, and a focused test improvement. Do not demand tests for trivial implementation details solely to increase coverage.
