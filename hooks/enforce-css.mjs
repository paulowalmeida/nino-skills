#!/usr/bin/env node

const match = (path) => path.endsWith('.module.css')

const TOKEN_BY_HEX = {
  '#ff6b00': 'brand',
  '#e8540c': 'brand-strong',
  '#fff7ee': 'cream',
  '#ffebd6': 'cream-deep',
  '#1a1206': 'ink',
}

const violations = (path, toolName, lines) => {
  if (!match(path)) return []

  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (line.length > 80) found.push(`${at}: mais de 80 caracteres`)

    const selector = line.match(/^\.([A-Za-z0-9_-]+)/)
    if (selector?.[1].includes('-')) found.push(`${at}: classe .${selector[1]} — usar camelCase`)

    for (const [hex, token] of Object.entries(TOKEN_BY_HEX)) {
      if (line.toLowerCase().includes(hex)) found.push(`${at}: ${hex} é o token ${token} — usar o token`)
    }
  })

  if (toolName === 'Write' && lines[0]?.trim() !== '@reference "@nino/ds/globals.css";') {
    found.push('linha 1: falta @reference "@nino/ds/globals.css"; no topo')
  }

  return found
}

export { match, violations }
