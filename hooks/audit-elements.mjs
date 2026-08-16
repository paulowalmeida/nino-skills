#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Elemento é uma unidade pequena — usa DS primitives, router glue ou condicional simples',
  'Nunca compõe outro app component (@components, @compositions) nem carrega lógica de domínio',
  'Uma pasta = um componente, CSS só quando usado',
  'Primitivo reusável vai pro DS; unidade maior vai pra components/compositions',
  'Nome autoexplicativo — nunca Link/iconThing/onClick/value',
]

const match = (path) => /\/src\/elements\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  if (/\/src\/elements\/[^/]+\/index\.ts$/.test(path)) {
    found.push('index.ts de barrel dentro de pasta de element é proibido')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const appComponentImport = line.match(/from ['"]@(components|compositions)\//)
    if (appComponentImport) {
      found.push(`${at}: element importando @${appComponentImport[1]} — element não compõe outro app component`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-elements', match, checklist: CHECKLIST, violations })
