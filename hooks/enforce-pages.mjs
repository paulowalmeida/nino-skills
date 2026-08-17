#!/usr/bin/env node

const match = (path) => /\/src\/pages\//.test(path)

const violations = (path, toolName, lines) => {
  if (!match(path)) return []

  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/from ['"]@services\//.test(line)) {
      found.push(`${at}: page importando @services — API direta não é governança`)
    }

    if (/\b(fetch\(|axios\.)/.test(line)) {
      found.push(`${at}: fetch/axios direto na page — busca de dado é do hook`)
    }
  })

  return found
}

export { match, violations }
