#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

const resolveTypeScript = (sourcePath) => {
  let current = path.dirname(path.resolve(sourcePath))
  while (true) {
    const candidate = path.join(current, 'node_modules', 'typescript', 'lib', 'typescript.js')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(current)
    if (parent === current) break
    current = parent
  }
  throw new Error('TypeScript runtime was not found in the source repository ancestors')
}

const loadTypeScript = async (sourcePath) => import(pathToFileURL(resolveTypeScript(sourcePath)).href)

const isFunction = (node, ts) =>
  ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
  ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)

const functionName = (node, ts) => {
  if (node.name) return node.name.getText()
  if (ts.isVariableDeclaration(node.parent) && node.parent.name) return node.parent.name.getText()
  if (ts.isPropertyAssignment(node.parent) && node.parent.name) return node.parent.name.getText()
  return '<anonymous>'
}

const isCyclomaticDecision = (node, ts) =>
  ts.isIfStatement(node) || ts.isForStatement(node) || ts.isForInStatement(node) ||
  ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node) ||
  ts.isCatchClause(node) || ts.isConditionalExpression(node) || ts.isCaseClause(node)

const isNestingNode = (node, ts) =>
  ts.isIfStatement(node) || ts.isForStatement(node) || ts.isForInStatement(node) ||
  ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node) ||
  ts.isCatchClause(node) || ts.isConditionalExpression(node) || ts.isSwitchStatement(node)

const logicalOperatorAddsComplexity = (node, ts) =>
  ts.isBinaryExpression(node) &&
  (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
    node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
    node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)

const analyzeFunction = (node, sourceFile, ts) => {
  let cyclomatic = 1
  let cognitive = 0
  let maxNesting = 0
  let currentNesting = 0

  const visit = (current) => {
    if (current !== node && isFunction(current, ts)) return
    const decision = isCyclomaticDecision(current, ts)
    const nesting = isNestingNode(current, ts)
    if (decision) {
      cyclomatic += 1
      cognitive += 1 + currentNesting
    }
    if (logicalOperatorAddsComplexity(current, ts)) cognitive += 1
    if (nesting) {
      currentNesting += 1
      maxNesting = Math.max(maxNesting, currentNesting)
    }
    ts.forEachChild(current, visit)
    if (nesting) currentNesting -= 1
  }

  ts.forEachChild(node, visit)
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1

  return {
    name: functionName(node, ts),
    kind: ts.SyntaxKind[node.kind],
    start,
    end,
    lines: end - start + 1,
    cyclomatic,
    cognitive,
    nesting: maxNesting,
    parameters: node.parameters.length,
  }
}

export const analyzeSource = async (sourcePath) => {
  const extension = path.extname(sourcePath)
  if (!SOURCE_EXTENSIONS.has(extension)) return []
  const source = fs.readFileSync(sourcePath, 'utf8')
  const ts = await loadTypeScript(sourcePath)
  const scriptKind = extension === '.tsx' || extension === '.jsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, scriptKind)
  const results = []

  const visit = (node) => {
    if (isFunction(node, ts)) {
      const metric = analyzeFunction(node, sourceFile, ts)
      metric.tsxCompositionException = extension === '.tsx' && /^[A-Z]/.test(metric.name) && node.getText(sourceFile).includes('<')
      results.push(metric)
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return results
}

const main = async () => {
  const input = process.argv[2]
  if (!input) {
    console.error('Usage: node tools/complexity-analyzer.mjs <file-or-directory>')
    process.exit(1)
  }
  const target = path.resolve(input)
  const files = []
  const collect = (entry) => {
    const stat = fs.statSync(entry)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry)) collect(path.join(entry, child))
      return
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry))) files.push(entry)
  }
  collect(target)
  const report = []
  for (const file of files) {
    const functions = await analyzeSource(file)
    report.push(...functions.map((metric) => ({ file, ...metric })))
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main()
