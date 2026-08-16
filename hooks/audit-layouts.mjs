#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Layout é chrome compartilhado e renderiza <Outlet />; nunca importa/escolhe a página ativa',
  'Guarda sidebar/header/navegação e estado local de UI do shell — nunca dado de rota, redirect ou regra de negócio',
  'Nome autoexplicativo — nunca Layout2/open/handleToggle/wrapper',
]

const match = (path) => /\/src\/layouts\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const pageImport = line.match(/from ['"]@pages\//)
    if (pageImport) {
      found.push(`${at}: layout importando @pages — layout nunca escolhe a página ativa`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-layouts', match, checklist: CHECKLIST, violations })
