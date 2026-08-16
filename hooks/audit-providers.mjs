#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Provider compõe infraestrutura estável da aplicação, não estado mutável de domínio',
  'Nunca createContext pra estado de app do manager — estado de cliente compartilhado é zustand',
  'Nesting intencional, valor limitado à capacidade exposta — sem lógica de página/feature',
  'Nome autoexplicativo — nunca Provider/Context/data/wrapper',
]

const match = (path) => /\/src\/providers\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/\bcreateContext\(/.test(line)) {
      found.push(`${at}: createContext — estado de aplicação do manager é zustand, não Context`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-providers', match, checklist: CHECKLIST, violations })
