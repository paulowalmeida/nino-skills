#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/(utils|adapters)\//.test(path)
const violations = (path, toolName, lines) => {
  const found = []
  const isUtils = /\/src\/utils\//.test(path)
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (isUtils && /<[A-Z][A-Za-z]*[\s/>]/.test(line)) found.push(`${at}: JSX dentro de @utils — isso é @adapters`)
    if (isUtils && /\b(fetch\(|axios\.|httpClient\.)/.test(line)) found.push(`${at}: chamada de API dentro de @utils — isso é @services/@hooks`)
    if (/^\s*export const (format|helper|render\d*)\s*=/i.test(line)) found.push(`${at}: nome genérico — explicitar o que computa/renderiza`)
  })
  return found
}
await runSkillHook({ name: 'enforce-utils-adapters', match, violations })
