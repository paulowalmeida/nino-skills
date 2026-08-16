#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Todo skeleton nomeado vive em src/skeletons/<NameSkeleton>/, um por pasta',
  'Reusar só quando a forma visual bate com o real; nunca placeholder genérico',
  'Mirrorar layout/campos/ações/breakpoints da tela real; CSS do dono pode ser reaproveitado',
  'Nome autoexplicativo — nunca Loading/Skeleton2/Placeholder/rows',
]

const match = (path) => /\/src\/skeletons\//.test(path)

const GENERIC_NAMES = /^\s*export const (Loading|Placeholder|Skeleton\d*)\b/

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (GENERIC_NAMES.test(line)) {
      found.push(`${at}: nome genérico — dizer qual UI representa (OrderDetailSkeleton)`)
    }
  })
  return found
}

await runSkillHook({ name: 'audit-skeletons', match, checklist: CHECKLIST, violations })
