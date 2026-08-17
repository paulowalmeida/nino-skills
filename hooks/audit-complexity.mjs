#!/usr/bin/env node

import fs from 'node:fs'
import { analyzeSource } from '../tools/complexity-analyzer.mjs'

const isSource = (path) => /\/nino-app\/.*\/src\/.*\.(ts|tsx|js|jsx)$/.test(path)

const readInput = async () => {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

const input = await readInput()
const filePath = input.tool_input?.file_path ?? ''

if (!isSource(filePath)) process.exit(0)

if (input.hook_event_name === 'PreToolUse') {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: [
        '[audit-complexity] Static analysis will inspect function LOC, CodeMetrics-adjacent cyclomatic complexity, cognitive complexity, nesting depth, and parameter count.',
        'These metrics are structural signals, not automatic maintainability verdicts.',
        'Do not split a function merely to lower a metric. Use the complexity-refactoring Skill for semantic judgment.',
      ].join('\n'),
    },
  }))
  process.exit(0)
}

if (input.hook_event_name !== 'PostToolUse') process.exit(0)

if (!fs.existsSync(filePath)) process.exit(0)

try {
  const metrics = await analyzeSource(filePath)

  if (metrics.length === 0) process.exit(0)

  const lines = metrics.map((metric) => {
    const exception = metric.tsxCompositionException ? ' [TSX composition candidate]' : ''
    return `  ${metric.name} (${metric.start}-${metric.end}): LOC=${metric.lines}, cyclomatic=${metric.cyclomatic}, cognitive=${metric.cognitive}, nesting=${metric.nesting}, params=${metric.parameters}${exception}`
  })

  console.error(
    `[audit-complexity] Structural metrics for ${filePath}:\n${lines.join('\n')}\n` +
      'These are diagnostic signals. No refactor is required solely because a metric is high; semantic review belongs to the complexity-refactoring Skill.'
  )
} catch (error) {
  console.error(
    `[audit-complexity] Unable to analyze ${filePath}: ${error instanceof Error ? error.message : String(error)}`
  )
}

process.exit(0)
