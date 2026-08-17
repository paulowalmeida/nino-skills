#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/router\//.test(path)
const violations = (path, toolName, lines) => {
  const found = []
  if (toolName === 'Write' && !/\/router\/routes\.tsx$/.test(path) && !/\.test\.tsx?$/.test(path)) found.push('router/ só pode conter routes.tsx e testes')
  lines.forEach((line, index) => {
    if (/^\s*loader:\s*(async\s*)?\(/.test(line)) found.push(`linha ${index + 1} do trecho escrito: loader inline — mover para src/loaders/`)
    if (/path:\s*['"]section-?\d*['"]/.test(line)) found.push(`linha ${index + 1} do trecho escrito: path genérico — nomear pela tela/seção real`)
  })
  return found
}
await runSkillHook({ name: 'enforce-router', match, violations })
