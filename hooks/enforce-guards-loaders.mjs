#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\/src\/(guards|loaders)\//.test(path)
const violations = (path, toolName, lines) => lines.flatMap((line, index) => /^\s*export const (check|verify|load|guard\d*|loader\d*)\s*=/i.test(line) ? [`linha ${index + 1} do trecho escrito: nome genérico — explicitar o guard/loader`] : [])
await runSkillHook({ name: 'enforce-guards-loaders', match, violations })
