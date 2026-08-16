#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Sempre type, nunca interface',
  'Nunca export default, sempre named export',
  'Sem any',
  'Type usado só num arquivo fica inline — não criar Nome.types.ts pra isso',
  'Type reusado vai pra src/types/<domain>/, um por arquivo kebab-case, sem barrel',
  'Import direto do arquivo (@custom_types/order/order, nunca @custom_types/order)',
]

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  const found = []
  const isDs = path.includes('nino-app/packages/ds/')

  if (/\/src\/types\/[^/]+\/index\.ts$/.test(path)) {
    found.push('index.ts de barrel em src/types — proibido, importar direto do arquivo')
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

await runSkillHook({ name: 'audit-types', match, checklist: CHECKLIST, violations })
