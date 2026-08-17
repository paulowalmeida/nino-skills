#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { extractImports, lineAt, loadTsConfig, resolveImport, SOURCE_EXTENSIONS } from "./module-graph.mjs";

const root = process.argv[2];
const policyFile = process.argv[3] ?? new URL("./architecture-boundaries.json", import.meta.url).pathname;

if (!root) {
  console.error("Usage: node enforcement/check-architecture-boundaries.mjs <project-src-root> [policy-file]");
  process.exit(2);
}

const sourceRoot = path.resolve(root);
if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
  console.error(`Source root does not exist or is not a directory: ${sourceRoot}`);
  process.exit(2);
}

function loadPolicy(file) {
  try {
    const policy = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(policy.rules)) throw new Error("policy.rules must be an array");

    const ids = new Set();
    for (const rule of policy.rules) {
      if (!rule.id || ids.has(rule.id)) throw new Error(`rules require unique non-empty ids: ${rule.id ?? "missing id"}`);
      if (!rule.severity || !["block", "warning"].includes(rule.severity)) {
        throw new Error(`rule ${rule.id} requires severity=block|warning`);
      }
      if (!rule.mode || !["direct", "transitive"].includes(rule.mode)) {
        throw new Error(`rule ${rule.id} requires mode=direct|transitive`);
      }
      if (!Array.isArray(rule.sourceDirectories) || rule.sourceDirectories.length === 0) {
        throw new Error(`rule ${rule.id} requires a non-empty sourceDirectories array`);
      }
      if (!Array.isArray(rule.targetDirectories) || rule.targetDirectories.length === 0) {
        throw new Error(`rule ${rule.id} requires a non-empty targetDirectories array`);
      }
      ids.add(rule.id);
    }
    return policy.rules;
  } catch (error) {
    console.error(`Invalid architecture policy: ${error.message}`);
    process.exit(2);
  }
}

const layerRules = loadPolicy(policyFile);
const config = loadTsConfig(sourceRoot);
const violations = [];
const warnings = [];
const unresolved = [];
const files = [];
const sourceCache = new Map();
const importsCache = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) files.push(fullPath);
  }
}
walk(sourceRoot);

function relative(file) {
  return path.relative(sourceRoot, file).split(path.sep).join("/");
}

function inDirectory(file, directory) {
  const value = relative(file);
  return value === directory || value.startsWith(`${directory}/`);
}

function sourceOf(file) {
  if (!sourceCache.has(file)) sourceCache.set(file, fs.readFileSync(file, "utf8"));
  return sourceCache.get(file);
}

function dependenciesOf(file) {
  if (importsCache.has(file)) return importsCache.get(file);
  const source = sourceOf(file);
  const dependencies = [];
  for (const { specifier, index } of extractImports(source)) {
    if (!specifier.startsWith(".") && !specifier.startsWith("@")) continue;
    const resolved = resolveImport(specifier, file, config);
    if (!resolved) {
      unresolved.push({ file: relative(file), line: lineAt(source, index), specifier });
      continue;
    }
    dependencies.push({ resolved, specifier, index, file });
  }
  importsCache.set(file, dependencies);
  return dependencies;
}

function directForbiddenDependency(startFile, targetDirectories) {
  return dependenciesOf(startFile).find((dependency) =>
    targetDirectories.some((directory) => inDirectory(dependency.resolved, directory)),
  ) ?? null;
}

function transitiveForbiddenDependency(startFile, targetDirectories, visited = new Set()) {
  if (visited.has(startFile)) return null;
  visited.add(startFile);

  for (const dependency of dependenciesOf(startFile)) {
    if (targetDirectories.some((directory) => inDirectory(dependency.resolved, directory))) {
      return { ...dependency, target: dependency.resolved };
    }

    const nested = transitiveForbiddenDependency(dependency.resolved, targetDirectories, visited);
    if (nested) return nested;
  }

  return null;
}

for (const file of files) {
  for (const rule of layerRules) {
    if (!rule.sourceDirectories.some((directory) => inDirectory(file, directory))) continue;

    const dependency = rule.mode === "transitive"
      ? transitiveForbiddenDependency(file, rule.targetDirectories)
      : directForbiddenDependency(file, rule.targetDirectories);
    if (!dependency) continue;

    const diagnosticSource = sourceOf(dependency.file ?? file);
    const diagnostic = {
      file: relative(dependency.file ?? file),
      line: lineAt(diagnosticSource, dependency.index),
      rule: rule.id,
      message: rule.message ?? "Architecture boundary violation.",
      import: dependency.specifier,
      target: relative(dependency.target ?? dependency.resolved),
    };

    if (rule.severity === "warning") warnings.push(diagnostic);
    else violations.push(diagnostic);
  }
}

for (const warning of warnings) {
  console.error(`${warning.file}:${warning.line} [WARNING] ${warning.rule}: ${warning.message} (${warning.import} → ${warning.target})`);
}
for (const violation of violations) {
  console.error(`${violation.file}:${violation.line} [BLOCK] ${violation.rule}: ${violation.message} (${violation.import} → ${violation.target})`);
}

if (unresolved.length > 0) {
  console.error(`Unable to resolve ${unresolved.length} local import(s). These are errors so boundary checks cannot silently pass unresolved imports.`);
  for (const item of unresolved) console.error(`${item.file}:${item.line} [ERROR] unresolved import: ${item.specifier}`);
  process.exit(2);
}

if (violations.length > 0) process.exit(1);
console.log(`Architecture boundary check passed${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`);
