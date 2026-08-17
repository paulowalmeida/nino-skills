#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/lib\//.test(path)
const violations = (path, toolName, lines) => lines.flatMap((line, index) => /^\s*export const (helper|utils|client\d*)\s*=/i.test(line) ? [`linha ${index + 1} do trecho escrito: nome genérico de infraestrutura`] : [])
await runSkillHook({ name: 'enforce-lib', match, violations })
