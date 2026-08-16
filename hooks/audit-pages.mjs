#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Página é só governança: params, redirect, loading/error do topo (via hook), decidir qual composition mostrar',
  'Regra de negócio, chamada de API, validação, formatação, payload — isso é do hook/composition/adapter/constants abaixo, nunca da página',
  'Independente saved sections precisa de rotas filhas + SectionNav + <Outlet />',
  'Nome autoexplicativo — nunca Page/Screen2/handleClick/data',
]

const match = (path) => /\/src\/pages\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    const serviceImport = line.match(/from ['"]@services\//)
    if (serviceImport) {
      found.push(`${at}: page importando @services — chamada de API direta não é governança`)
    }

    if (/\b(fetch\(|axios\.)/.test(line)) {
      found.push(`${at}: fetch/axios direto na page — busca de dado é do hook`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-pages', match, checklist: CHECKLIST, violations })
