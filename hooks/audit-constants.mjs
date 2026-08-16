#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Só dado estático (array/objeto) — nunca JSX, nunca função que retorna UI',
  'JSX vira @adapters/*.adapter.tsx, nunca fica aqui',
  'Um arquivo por domínio (order.constants.ts, product.constants.ts)',
  'Nome do arquivo e da constante exportada dizem o domínio e o formato — nunca DATA/OPTIONS/list/config sozinho',
]

const match = (path) => /\/src\/constants\/.+\.tsx?$/.test(path)

const GENERIC_NAMES = /^\s*export const (DATA|OPTIONS|LIST|CONFIG|ITEMS)\b/

const violations = (path, toolName, lines) => {
  const found = []
  if (path.endsWith('.tsx')) {
    found.push('arquivo .tsx em @constants — constants nunca tem JSX')
  }
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/<[A-Z][A-Za-z]*[\s/>]/.test(line)) {
      found.push(`${at}: parece JSX dentro de constants — isso é @adapters`)
    }
    if (GENERIC_NAMES.test(line)) {
      found.push(`${at}: nome genérico — dizer o domínio (ORDER_STATUS_OPTIONS, não OPTIONS)`)
    }
  })
  return found
}

await runSkillHook({ name: 'audit-constants', match, checklist: CHECKLIST, violations })
