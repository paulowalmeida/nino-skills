#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/skeletons\//.test(path)
const violations = (path, toolName, lines) => lines.flatMap((line, index) => /^\s*export const (Loading|Placeholder|Skeleton\d*)\b/.test(line) ? [`linha ${index + 1} do trecho escrito: nome genérico de skeleton`] : [])
await runSkillHook({ name: 'enforce-skeletons', match, violations })
