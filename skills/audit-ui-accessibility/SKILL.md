---
name: audit-ui-accessibility
description: "Audit nino-app/apps/manager UI accessibility across elements, components, compositions, and pages. Use for aria/alt text, semantic roles, touch targets, keyboard focus, or reduced-motion handling."
---

# Audit UI accessibility

Use `nino-app/` as the working directory. Read the "Acessibilidade" section
of `components.md` and the "Piso de qualidade" bullet of `css.md`. This is
cross-layer — check any JSX in `elements/`, `components/`, `compositions/`,
`pages/`, and `layouts/`.

Every element needs: `aria-hidden` on purely decorative elements; `alt` or
`aria-label` on an informative element with no visible text; the correct
semantic role (a clickable `<div>`/`<span>` instead of `<button>`, a custom
widget instead of an existing DS primitive that already has the right
`role`); a clickable target ≥44px on mobile. Layout must hold at 390px width.
Keyboard focus must stay visible (no `outline: none` without a replacement
focus style). Motion must respect `prefers-reduced-motion`.

## Nomes autoexplicativos

Here the "name" is the `aria-label`/`alt` text itself — it's user-facing
copy in Portuguese (see `code-style.md`, "Idioma"), but the same
self-explanatory bar applies: reading it alone, with no visual context,
should tell a screen-reader user exactly what the element is or does.

Good: `aria-label="Remover item do carrinho"` — a screen reader announces the
exact action.

Bad: `aria-label="Ícone"`, `aria-label="Botão"`, `alt="Imagem"` — repeats the
element type instead of describing content or action; a screen-reader user
hears "botão, botão, botão" across a toolbar and still doesn't know which
one does what.

Report exact file and line; do not modify code.
