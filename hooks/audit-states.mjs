#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Zustand só pra estado de cliente compartilhado entre consumidores distantes',
  'Dado de servidor (pedido, produto, zona) nunca entra no zustand — isso é TanStack Query',
  'Um store por domínio, nomeado useXStore, com actions e clear/reset explícitos',
  'Nunca Context pra estado de aplicação',
  'Nome autoexplicativo — nunca useStore/selected/setData/resetThing',
]

const match = (path) => /\/src\/states\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/\bcreateContext\(/.test(line)) {
      found.push(`${at}: createContext em states — usar zustand`)
    }

    if (/\buseQuery\(|\buseMutation\(/.test(line)) {
      found.push(`${at}: react-query dentro de store — dado de servidor não entra no zustand`)
    }

    if (/^\s*export const useStore\s*=/.test(line)) {
      found.push(`${at}: useStore é nome genérico — nomear pelo domínio (useSessionStore)`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-states', match, checklist: CHECKLIST, violations })
