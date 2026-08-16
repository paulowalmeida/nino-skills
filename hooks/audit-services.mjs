#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Service fala com um recurso/entidade da API só — sem UI, sem estado React, sem formatação de apresentação',
  'Retorna tipo de domínio, nunca resposta/envelope HTTP cru',
  'Um arquivo por entidade; métodos agrupados num objeto exportado',
  'Busca por id sempre getById(id) — nunca get/show/find',
  'Nome autoexplicativo — nunca get/show/fetchData/service2',
]

const match = (path) => /\/src\/services\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/\buseState\(/.test(line)) {
      found.push(`${at}: useState em service — estado React não pertence a esta camada`)
    }

    if (/^\s*(export\s+)?(const|async function) (get|show|find|fetchData)\s*[=(]/.test(line)) {
      found.push(`${at}: nome genérico de método — usar getById ou o verbo real da ação`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-services', match, checklist: CHECKLIST, violations })
