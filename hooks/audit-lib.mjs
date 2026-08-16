#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Só infraestrutura que não fala com recurso específico da API (transporte HTTP, locks)',
  'Se fala com recurso específico (order, product, tenant), é @services, não @lib',
  'Nome descreve a infraestrutura oferecida, nunca o recurso de domínio',
  'Nome autoexplicativo — nunca helper/utils/client2',
]

const match = (path) => /\/src\/lib\//.test(path)

const GENERIC_NAMES = /^\s*export const (helper|utils|client\d*)\s*=/i

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (GENERIC_NAMES.test(line)) {
      found.push(`${at}: nome genérico — dizer a infraestrutura oferecida (createHttpClient, refreshLock)`)
    }
  })
  return found
}

await runSkillHook({ name: 'audit-lib', match, checklist: CHECKLIST, violations })
