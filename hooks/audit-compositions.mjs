#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Composition é uma seção coesa combinando app components/elements',
  'Pode ter estado local de interação/formulário, mas nunca chama service diretamente',
  'Nunca duplica governança de página nem vira primitivo do DS',
  'Uma pasta = um componente; CSS module só se usa classe própria',
  'Nome autoexplicativo — nunca Content/section/handleChange/open',
]

const match = (path) => /\/src\/compositions\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  if (/\/src\/compositions\/[^/]+\/index\.ts$/.test(path)) {
    found.push('index.ts de barrel dentro de pasta de composition é proibido')
  }

  if (!path.includes('nino-app/packages/ds/') && path.endsWith('.stories.tsx')) {
    found.push('stories são exclusivas do design system')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const serviceImport = line.match(/from ['"]@services\//)
    if (serviceImport) {
      found.push(`${at}: composition importando @services — chamada de service direta é proibida aqui`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-compositions', match, checklist: CHECKLIST, violations })
