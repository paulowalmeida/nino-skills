#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/states\//.test(path)
const violations = (path, toolName, lines) => lines.flatMap((line, index) => {
  const at = `linha ${index + 1} do trecho escrito`
  if (/\bcreateContext\(/.test(line)) return [`${at}: createContext em states — usar zustand`]
  if (/\buseQuery\(|\buseMutation\(/.test(line)) return [`${at}: react-query dentro de store — dado de servidor não entra no zustand`]
  if (/^\s*export const useStore\s*=/.test(line)) return [`${at}: useStore é nome genérico — nomear pelo domínio`]
  return []
})
await runSkillHook({ name: 'enforce-states', match, violations })
