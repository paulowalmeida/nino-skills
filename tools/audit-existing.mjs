#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const HOOKS_DIR = path.join(ROOT, 'hooks')
const SKILLS_DIR = path.join(ROOT, 'skills')
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.scss', '.sass'])
const DEFAULT_EXCLUDES = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'out'])

const hookFiles = () =>
  fs.readdirSync(HOOKS_DIR)
    .filter((name) => /^enforce-.+\.mjs$/.test(name))
    .sort()
    .map((name) => path.join(HOOKS_DIR, name))

const shouldExclude = (entry, excludes) =>
  excludes.some((segment) => entry.split(path.sep).includes(segment))

const collectFiles = (target, excludes, files = []) => {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    if (shouldExclude(target, excludes)) return files
    for (const child of fs.readdirSync(target).sort()) collectFiles(path.join(target, child), excludes, files)
    return files
  }

  if (!shouldExclude(target, excludes) && SOURCE_EXTENSIONS.has(path.extname(target))) files.push(target)
  return files
}

const runHook = (hook, file, root) => {
  const relative = path.relative(root, file)
  const displayPath = `nino-app/${relative.replaceAll(path.sep, '/')}`
  const content = fs.readFileSync(file, 'utf8')
  const input = JSON.stringify({
    hook_event_name: 'PostToolUse',
    tool_name: 'Write',
    tool_input: { file_path: displayPath, content },
  })

  const result = spawnSync(process.execPath, [hook], {
    input,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  })

  if (result.error) {
    return [{ type: 'hook-error', hook: path.basename(hook), file: displayPath, message: result.error.message }]
  }

  if (result.status === 2) {
    const message = (result.stderr || '').trim()
    return [{ type: 'violation', hook: path.basename(hook), file: displayPath, message }]
  }

  if (result.status !== 0) {
    return [{
      type: 'hook-error',
      hook: path.basename(hook),
      file: displayPath,
      message: (result.stderr || result.stdout || `exit ${result.status}`).trim(),
    }]
  }

  return []
}

const listSemanticSkills = () =>
  fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('audit-'))
    .sort()
    .map((name) => ({ name, skillFile: `skills/${name}/SKILL.md` }))

const printTextReport = ({ root, files, hooks, violations, hookErrors, semanticSkills }) => {
  console.log(`Audit root: ${root}`)
  console.log(`Files scanned: ${files}`)
  console.log(`Enforcement hooks: ${hooks}`)
  console.log(`Mechanical violations: ${violations}`)
  console.log(`Hook errors: ${hookErrors}`)
  console.log('')

  if (violations.length > 0) {
    console.log('=== Mechanical violations ===')
    for (const item of violations) {
      console.log(`\n[${item.hook}] ${item.file}`)
      console.log(item.message || '(no diagnostic message)')
    }
    console.log('')
  }

  console.log('=== Semantic review required ===')
  for (const skill of semanticSkills) {
    console.log(`- ${skill.name} (${skill.skillFile})`)
  }
  console.log('\nSemantic Skills are intentionally not converted into regex checks.')
  console.log('They require agent judgment against the existing code and the Skill instructions.')
}

const main = () => {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const targets = args.filter((arg) => !arg.startsWith('--'))
  const targetArgs = targets.length > 0 ? targets : ['.']
  const excludes = new Set(DEFAULT_EXCLUDES)
  for (const arg of args.filter((arg) => arg.startsWith('--exclude='))) excludes.add(arg.slice('--exclude='.length))

  const root = path.resolve(process.cwd())
  const hooks = hookFiles()
  const files = [...new Set(targetArgs.flatMap((target) => collectFiles(path.resolve(root, target), excludes)))].sort()
  const violations = []
  const hookErrors = []

  for (const file of files) {
    for (const hook of hooks) {
      const findings = runHook(hook, file, root)
      for (const finding of findings) {
        if (finding.type === 'violation') violations.push(finding)
        else hookErrors.push(finding)
      }
    }
  }

  const report = {
    root,
    filesScanned: files.length,
    hooks: hooks.map((hook) => path.basename(hook)),
    mechanical: { violations, hookErrors },
    semanticSkills: listSemanticSkills(),
    notes: [
      'Mechanical checks reuse the same enforce-* hooks used by Write/Edit enforcement.',
      'Semantic Skills are reported for deliberate retrospective review; they are not approximated with regexes.',
      'Existing-code audit does not modify files.',
    ],
  }

  if (json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
    process.exit(hookErrors.length > 0 ? 2 : 0)
  }

  printTextReport({
    root,
    files: files.length,
    hooks: hooks.length,
    violations,
    hookErrors,
    semanticSkills: report.semanticSkills,
  })

  process.exit(hookErrors.length > 0 ? 2 : 0)
}

main()
