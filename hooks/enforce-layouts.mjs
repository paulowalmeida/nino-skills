#!/usr/bin/env node

const match = (path) => /\/src\/layouts\//.test(path)

const violations = (path, toolName, lines) => {
  if (!match(path)) return []

  const found = []
  lines.forEach((line, index) => {
    if (/from ['"]@pages\//.test(line)) {
      found.push(`linha ${index + 1} do trecho escrito: layout importando @pages — layout não escolhe a página ativa`)
    }
  })
  return found
}

export { match, violations }
