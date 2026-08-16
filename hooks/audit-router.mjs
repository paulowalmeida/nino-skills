#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'router/ só tem routes.tsx e o teste que exercita as rotas montadas',
  'Guard e loader nunca inline/redefinido aqui — vivem em src/guards, src/loaders',
  'Tela com seções independentes = rotas filhas + { index: true, element: <Navigate/> }, nunca accordion/tabs',
  'path da rota e chave do objeto legíveis sozinhos (path: "horario-funcionamento", não "section-2")',
]

const match = (path) => /\/src\/router\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []
  const isRoutesFile = /\/router\/routes\.tsx$/.test(path)
  const isTestFile = /\.test\.tsx?$/.test(path)

  if (toolName === 'Write' && !isRoutesFile && !isTestFile) {
    found.push('arquivo fora de routes.tsx/teste dentro de router/ — router/ só tem essas duas coisas')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/^\s*loader:\s*(async\s*)?\(/.test(line)) {
      found.push(`${at}: loader inline em routes.tsx — mover para src/loaders/`)
    }
    if (/path:\s*['"]section-?\d*['"]/.test(line)) {
      found.push(`${at}: path genérico (section-N) — nomear pela tela/seção real`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-router', match, checklist: CHECKLIST, violations })
