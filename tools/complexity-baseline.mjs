#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { analyzeSource } from './complexity-analyzer.mjs'

const metrics = ['lines', 'cyclomatic', 'cognitive', 'nesting', 'parameters']

const percentile = (values, p) => {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const index = (sorted.length - 1) * p
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}

const collectFiles = (root) => {
  const files = []
  const visit = (entry) => {
    const stat = fs.statSync(entry)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) visit(path.join(entry, child))
      return
    }
    if (/\.(ts|tsx|js|jsx)$/.test(entry)) files.push(entry)
  }
  visit(path.resolve(root))
  return files
}

const root = process.argv[2]
if (!root) {
  console.error('Usage: node tools/complexity-baseline.mjs <source-directory>')
  process.exit(1)
}

const all = []
for (const file of collectFiles(root)) {
  const functions = await analyzeSource(file)
  all.push(...functions.map((metric) => ({ file, ...metric })))
}

const implementationFunctions = all.filter((metric) => !metric.tsxCompositionException)
const report = {
  functionCount: all.length,
  nonCompositionFunctionCount: implementationFunctions.length,
  metrics: Object.fromEntries(
    metrics.map((metric) => {
      const values = implementationFunctions.map((item) => item[metric])
      return [metric, {
        min: Math.min(...values),
        p50: percentile(values, 0.5),
        p75: percentile(values, 0.75),
        p90: percentile(values, 0.9),
        p95: percentile(values, 0.95),
        max: Math.max(...values),
      }]
    })
  ),
  highestRiskFunctions: implementationFunctions
    .slice()
    .sort((a, b) =>
      (b.cognitive + b.cyclomatic + b.nesting) -
      (a.cognitive + a.cyclomatic + a.nesting)
    )
    .slice(0, 20),
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
