---
name: data-boundary-review
description: Review nino-app services, routers, libraries, constants, types, and adapters for clean data-flow and domain/transport boundaries.
---

# Data Boundary Review

## Purpose

Verify that data acquisition, transformation, transport, domain policy, and UI adaptation are separated according to the project rules.

## Review

Trace a representative path from UI trigger to service/API boundary and back. Identify where validation, mapping, domain decisions, transport details, and presentation adaptation occur.

## Gates

Flag:

- UI layers making raw transport calls that belong behind Hooks/services;
- services importing presentation concerns;
- adapters owning business policy instead of representation mapping;
- utility/lib code depending on app-specific UI layers;
- constants files containing executable logic or JSX;
- types duplicated or invented locally when an authoritative domain type exists;
- router code performing business workflows instead of navigation governance;
- domain logic hidden in generic utilities or transport helpers;
- a boundary that exists only by file name while dependencies violate it.

## Evidence

Report the end-to-end data path, current boundary, violated responsibility, authoritative destination, and minimal correction. Prefer existing project abstractions over introducing a parallel layer.
