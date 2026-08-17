#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { analyzeSource } from '../complexity-analyzer.mjs'

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-complexity-'))
const file = path.join(tempDir, 'fixture.ts')

fs.writeFileSync(file, `
export function sample(value: number, enabled: boolean) {
  if (enabled && value > 0) {
    for (const item of [value]) {
      if (item > 1) return item
    }
  }
  return 0
}

export function outer() {
  return () => {
    if (true) return 1
    return 0
  }
}
`)

try {
  const metrics = await analyzeSource(file)
  const sample = metrics.find((metric) => metric.name === 'sample')
  const outer = metrics.find((metric) => metric.name === 'outer')

  assert.ok(sample)
  assert.equal(sample.parameters, 2)
  assert.equal(sample.cyclomatic, 4)
  assert.equal(sample.nesting, 3)
  assert.equal(sample.cognitive, 7)

  assert.ok(outer)
  assert.equal(metrics.filter((metric) => metric.name === '<anonymous>').length, 1)
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

console.log('Complexity analyzer tests passed.')
