#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Hook chama service e expõe estado pronto pra tela (isPending, dado formatado) — sem JSX, sem resposta HTTP crua',
  'Hook público novo tem um arquivo próprio; helper não exportado pode ficar local',
  'Dado de servidor fica em query hook, nunca em zustand',
  'Nome expõe o conceito pro consumidor, não o mecanismo interno (useCurrentTenant, não useTenantQuery)',
]

const match = (path) => /\/src\/hooks\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/<[A-Z][A-Za-z]*[\s/>]/.test(line)) {
      found.push(`${at}: parece JSX dentro de hook — hook não retorna UI`)
    }

    const mechanismName = line.match(/^\s*export const (use[A-Za-z]*(Query|Mutation))\b/)
    if (mechanismName) {
      found.push(`${at}: nome "${mechanismName[1]}" expõe mecanismo interno — nomear pelo que entrega ao consumidor`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-hooks', match, checklist: CHECKLIST, violations })
