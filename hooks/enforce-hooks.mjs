#!/usr/bin/env node

const match = (path) => /\/src\/hooks\//.test(path)

const violations = (path, toolName, lines) => {
  if (!match(path)) return []

  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/<[A-Z][A-Za-z]*[\s/>]/.test(line)) {
      found.push(`${at}: JSX dentro de hook — hook não retorna UI`)
    }

    if (/^\s*export const (use[A-Za-z]*(Query|Mutation))\b/.test(line)) {
      found.push(`${at}: nome de hook expõe mecanismo Query/Mutation`)
    }
  })

  return found
}

export { match, violations }
