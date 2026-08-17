#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/compositions\//.test(path)
const violations = (path, toolName, lines) => {
  const found = []
  if (/\/src\/compositions\/[^/]+\/index\.ts$/.test(path)) found.push('index.ts de barrel dentro de pasta de composition é proibido')
  if (!path.includes('nino-app/packages/ds/') && path.endsWith('.stories.tsx')) found.push('stories são exclusivas do design system')
  lines.forEach((line, index) => { if (/from ['"]@services\//.test(line)) found.push(`linha ${index + 1} do trecho escrito: composition importando @services — chamada de service direta é proibida`) })
  return found
}
await runSkillHook({ name: 'enforce-compositions', match, violations })
