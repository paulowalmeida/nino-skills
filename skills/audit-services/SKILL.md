---
name: audit-services
description: "Audit nino-app/apps/manager API services in src/services. Use for entity boundaries, domain return values, HTTP-wrapper leakage, service names, getById conventions, or service file structure."
---

# Audit services

Use `nino-app/` as the working directory. Read service sections of
`code-style.md`. A service owns one API entity/resource and communication only:
no UI, React state, or presentation formatting. Return domain types, never raw
HTTP responses/envelopes. Group one entity's methods in one exported object;
use `getById` for lookups by id and purpose-specific singleton/sub-resource
names.

## Nomes autoexplicativos

Names state resource and action. Good: `tenantService.getById`,
`getMyCompany`, `updateDeliveryZone`. Bad: `get`, `show`, `fetchData`,
`service2`. Check file, service object, methods, request data, and responses.
Report exact file and line; do not modify code.
