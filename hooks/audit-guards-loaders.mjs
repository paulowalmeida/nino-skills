#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Mora em src/guards/* ou src/loaders/*, nunca dentro de router/',
  'Um guard ou loader por arquivo, nome do arquivo bate com o nome exportado',
  'Guard controla acesso à rota (redirect/block); loader busca dado antes da rota montar',
  'Nenhum dos dois carrega lógica de composição ou de página',
  'Nome autoexplicativo (sessionGuard, nunca check/guard2/verify)',
]

const match = (path) => /\/src\/(guards|loaders)\//.test(path)

const GENERIC_NAMES = /^\s*export const (check|verify|load|guard\d*|loader\d*)\s*=/i

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (GENERIC_NAMES.test(line)) {
      found.push(`${at}: nome genérico — dizer o que guarda/carrega (sessionGuard, rootLoader)`)
    }
  })
  return found
}

await runSkillHook({ name: 'audit-guards-loaders', match, checklist: CHECKLIST, violations })
