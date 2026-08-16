#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Combina elements ou DS primitives numa unidade de UI; não compõe outro app component, não busca dado, não tem lógica de negócio',
  'Uma pasta = um componente; segunda função retornando JSX no mesmo arquivo é componente escondido',
  'Sem barrel (index.ts) dentro da pasta do componente',
  'Sem stories de app — stories é exclusivo do design system',
  'Name.module.css só existe se tem classe usada por aquele componente',
  'Nome autoexplicativo — nunca Item/component/handleClick/active',
]

const match = (path) => /\/src\/components\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  if (toolName === 'Write' && /\/src\/components\/[^/]+\.tsx?$/.test(path)) {
    found.push('componente solto: precisa de pasta própria (Nome/Nome.tsx)')
  }

  if (/\/src\/components\/[^/]+\/index\.ts$/.test(path)) {
    found.push('index.ts de barrel dentro de pasta de componente é proibido')
  }

  if (!path.includes('nino-app/packages/ds/') && path.endsWith('.stories.tsx')) {
    found.push('stories são exclusivas do design system')
  }

  const compositionImport = /from ['"]@compositions\//
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (compositionImport.test(line)) {
      found.push(`${at}: component importando @compositions — component não compõe unidade maior que ele`)
    }
    const serviceImport = line.match(/from ['"]@services\//)
    if (serviceImport) {
      found.push(`${at}: component importando @services — busca de dado é do hook, não do component`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-components', match, checklist: CHECKLIST, violations })
