#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'aria-hidden em decorativo; alt/aria-label em informativo sem texto visível',
  'Papel semântico correto — nunca div/span clicável no lugar de button',
  'Alvo de toque ≥44px no celular; layout aguenta 390px',
  'Foco de teclado sempre visível — sem outline: none sem substituto',
  'Motion respeita prefers-reduced-motion',
  'Texto de aria-label/alt descreve a ação/conteúdo real, nunca repete o tipo do elemento (Ícone/Botão/Imagem)',
]

const match = (path) =>
  /\/src\/(elements|components|compositions|pages|layouts)\//.test(path) &&
  (path.endsWith('.tsx') || path.endsWith('.module.css'))

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/<img(?![^>]*\balt=)[^>]*\/?>/.test(line)) {
      found.push(`${at}: <img> sem alt`)
    }

    if (/aria-label=["'](Ícone|Botão|Imagem)["']/i.test(line)) {
      found.push(`${at}: aria-label genérico — descrever a ação/conteúdo, não o tipo do elemento`)
    }

    if (/outline:\s*none/.test(line) || /\boutline-none\b/.test(line)) {
      found.push(`${at}: outline removido — precisa de foco visível substituto (focus-visible)`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-ui-accessibility', match, checklist: CHECKLIST, violations })
