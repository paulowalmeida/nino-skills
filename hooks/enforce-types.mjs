#!/usr/bin/env node

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  const found = []
  const isDs = path.includes('nino-app/packages/ds/')

  if (/\/src\/types\/[^/]+\/index\.ts$/.test(path)) {
    found.push('barrel em src/types — importar diretamente do arquivo de tipo')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const code = line.replace(/\/\/.*$/, '')

    if (!isDs && /^\s*(export\s+)?interface\s/.test(code)) {
      found.push(`${at}: interface — usar type`)
    }
    if (/^\s*export\s+default\b/.test(code)) {
      found.push(`${at}: export default — usar named export`)
    }
    if (/(:\s*any\b|\bas any\b)/.test(code)) {
      found.push(`${at}: any — usar o type real`)
    }
  })

  return found
}

export { match, violations }
