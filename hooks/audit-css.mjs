#!/usr/bin/env node
import { runSkillHook, lineLengthViolations } from './hook-kit.mjs'

const CHECKLIST = [
  'Primeira linha (arquivo novo): @reference "@nino/ds/globals.css"; (com o ;)',
  '@apply sempre que a utility do Tailwind existir',
  'Cor sempre por token quando o valor bate com o mapeamento — não inventar token se o Tailwind já cobre',
  'Gradiente/sombra/efeito multi-camada em CSS puro, nunca @apply gigante',
  'Fundo de tela é branco puro; cream só dentro da tela (cartão, faixa, chip)',
  'Máximo 80 caracteres por linha, @apply agrupado por responsabilidade',
  'Tela abre com p-4 lg:p-10 na .page (exceto kitchen, first-store, store-selection)',
  'Classe em camelCase e semântica — nunca prefixo defensivo (.authGrain em vez de .grain)',
  'Nome de classe dá pra reconhecer no DevTools sem voltar pro JSX',
]

const match = (path) => path.endsWith('.module.css')

const TOKEN_BY_HEX = {
  '#ff6b00': 'brand',
  '#e8540c': 'brand-strong',
  '#fff7ee': 'cream',
  '#ffebd6': 'cream-deep',
  '#1a1206': 'ink',
}

const TOKEN_BY_RGB = {
  '255,107,0': 'brand',
  '26,18,6': 'ink',
}

const violations = (path, toolName, lines) => {
  const found = [...lineLengthViolations(lines)]

  if (toolName === 'Write' && lines[0]?.trim() !== '@reference "@nino/ds/globals.css";') {
    found.push('linha 1: falta @reference "@nino/ds/globals.css"; no topo')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    const selector = line.match(/^\.([A-Za-z0-9_-]+)/)
    if (selector?.[1].includes('-')) {
      found.push(`${at}: classe .${selector[1]} — usar camelCase`)
    }

    for (const [hex, token] of Object.entries(TOKEN_BY_HEX)) {
      if (line.toLowerCase().includes(hex)) {
        found.push(`${at}: ${hex} é o token ${token} — usar o token`)
      }
    }

    const rgb = line.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (rgb) {
      const token = TOKEN_BY_RGB[`${rgb[1]},${rgb[2]},${rgb[3]}`]
      if (token) found.push(`${at}: rgba(${rgb[1]},${rgb[2]},${rgb[3]}) é o token ${token}`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-css', match, checklist: CHECKLIST, violations })
