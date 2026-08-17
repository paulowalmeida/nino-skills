#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/services\//.test(path)
const violations = (path, toolName, lines) => lines.flatMap((line, index) => {
  const found = []
  if (/\buseState\(/.test(line)) found.push(`linha ${index + 1} do trecho escrito: useState em service`)
  if (/^\s*(export\s+)?(const|async function) (get|show|find|fetchData)\s*[=(]/.test(line)) found.push(`linha ${index + 1} do trecho escrito: nome genérico de método`)
  return found
})
await runSkillHook({ name: 'enforce-services', match, violations })
