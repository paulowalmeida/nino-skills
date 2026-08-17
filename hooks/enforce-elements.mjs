#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/elements\//.test(path)
const violations = (path, toolName, lines) => {
  const found = []
  if (/\/src\/elements\/[^/]+\/index\.ts$/.test(path)) found.push('index.ts de barrel dentro de pasta de element é proibido')
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const match = line.match(/from ['"]@(components|compositions)\//)
    if (match) found.push(`${at}: element importando @${match[1]} — element não compõe outro app component`)
  })
  return found
}
await runSkillHook({ name: 'enforce-elements', match, violations })
