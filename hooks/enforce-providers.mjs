#!/usr/bin/env node

const match = (path) => /\/src\/providers\//.test(path)

const violations = (path, toolName, lines) => {
  if (!match(path)) return []

  const found = []
  lines.forEach((line, index) => {
    if (/\bcreateContext\(/.test(line)) {
      found.push(`linha ${index + 1} do trecho escrito: createContext em provider — estado de aplicação deve usar a estratégia de estado compartilhado definida pelo projeto`)
    }
  })

  return found
}

export { match, violations }
