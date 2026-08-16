---
name: audit-skeletons
description: "Audit nino-app/apps/manager loading skeletons in src/skeletons. Use for skeleton placement, reusability, folders, mirrored layout, CSS imports, names, or loading-state structure."
---

# Audit skeletons

Use `nino-app/` as the working directory. Read the skeleton sections of
`components.md`. Every named skeleton lives in
`src/skeletons/<NameSkeleton>/` as one component. Reuse only when the visual
shape matches. Build from the complete real UI and mirror layout, fields,
actions, and breakpoints; never use a generic placeholder. Mirrored owner CSS
is allowed; create local CSS only for skeleton-specific classes.

## Nomes autoexplicativos

Names identify represented UI. Good: `OrderDetailSkeleton`,
`ProductFormSkeleton`. Bad: `Loading`, `Skeleton2`, `Placeholder`, `rows`.
Check folder, export, fallback state, and helpers. Report exact file and line;
do not modify code.
