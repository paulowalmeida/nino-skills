#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\/src\/components\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  if (toolName === 'Write' && /\/src\/components\/[^/]+\.tsx?$/.test(path)) {
    found.push('component solto: precisa de pasta própria (Nome/Nome.tsx)')
  }

  if (/\/src\/components\/[^/]+\/index\.ts$/.test(path)) {
    found.push('index.ts de barrel dentro de pasta de componente é proibido')
  }

  if (!path.includes('nino-app/packages/ds/') && path.endsWith('.stories.tsx')) {
    found.push('stories são exclusivas do design system')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/from ['"]@compositions\//.test(line)) {
      found.push(`${at}: component importando @compositions`)
    }
    if (/from ['"]@services\//.test(line)) {
      found.push(`${at}: component importando @services`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-components', match, violations })
