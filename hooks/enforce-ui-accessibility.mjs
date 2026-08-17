#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) =>
  /\/src\/(elements|components|compositions|pages|layouts)\//.test(path) &&
  (path.endsWith('.tsx') || path.endsWith('.module.css'))

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/<img(?![^>]*\balt=)[^>]*\/?>/.test(line)) found.push(`${at}: <img> sem alt`)
    if (/aria-label=["'](Ícone|Botão|Imagem)["']/i.test(line)) found.push(`${at}: aria-label genérico`)
    if (/outline:\s*none/.test(line) || /\boutline-none\b/.test(line)) found.push(`${at}: outline removido sem foco visível substituto`)
  })
  return found
}

await runSkillHook({ name: 'enforce-ui-accessibility', match, violations })
