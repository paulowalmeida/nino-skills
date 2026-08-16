#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Adapter mapeia @constants pra JSX, um por arquivo, nome batendo com o domínio (*.adapter.tsx)',
  '@utils é função pura, sem JSX, sem chamada de API — formatação, cálculo, transform pequeno',
  'Helper que renderiza UI vai pra @adapters, não @utils',
  'Helper que busca/muta dado vai pra @services/@hooks, nunca @utils/@adapters',
  'Nome autoexplicativo — nunca format/helper/render2',
]

const match = (path) => /\/src\/(utils|adapters)\//.test(path)

const GENERIC_NAMES = /^\s*export const (format|helper|render\d*)\s*=/i

const violations = (path, toolName, lines) => {
  const found = []
  const isUtils = /\/src\/utils\//.test(path)

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (isUtils && /<[A-Z][A-Za-z]*[\s/>]/.test(line)) {
      found.push(`${at}: JSX dentro de @utils — isso é @adapters`)
    }

    if (isUtils && /\b(fetch\(|axios\.|httpClient\.)/.test(line)) {
      found.push(`${at}: chamada de API dentro de @utils — isso é @services/@hooks`)
    }

    if (GENERIC_NAMES.test(line)) {
      found.push(`${at}: nome genérico — dizer o que computa/renderiza (formatCurrencyBRL, welcomePanelDemo)`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-utils-adapters', match, checklist: CHECKLIST, violations })
