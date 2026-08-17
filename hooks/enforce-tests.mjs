#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'
const match = (path) => /\.test\.tsx?$/.test(path) || path.endsWith('.mock.ts')
const violations = (path, toolName, lines) => {
  const found = []
  const isTest = /\.test\.tsx?$/.test(path)
  const isMock = path.endsWith('.mock.ts')
  if (isTest && /\/src\/(components|compositions|elements)\//.test(path) && !path.includes('__tests__')) found.push('teste deve ficar em src/__tests__/')
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/\bas never\b/.test(line)) found.push(`${at}: as never — usar as unknown as T`)
    if (isMock && /\bvi\.fn\(/.test(line)) found.push(`${at}: vi.fn() em .mock.ts — mock comportamental vai no teste`)
    if (isMock && /^\s*(export\s+)?const [A-Za-z]+\s*=\s*\(/.test(line)) found.push(`${at}: função em .mock.ts — manter fixture como dado`)
    if (isTest && /it\(['"]test ?\d*['"]/i.test(line)) found.push(`${at}: nome de it() genérico`)
  })
  return found
}
await runSkillHook({ name: 'enforce-tests', match, violations })
