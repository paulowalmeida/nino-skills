#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { extractImports, lineAt, loadTsConfig, resolveImport, SOURCE_EXTENSIONS } from "./module-graph.mjs";

const root = process.argv[2];
if (!root) {
  console.error("Usage: node enforcement/check-architecture-boundaries.mjs <project-src-root>");
  process.exit(2);
}

const sourceRoot = path.resolve(root);
if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
  console.error(`Source root does not exist or is not a directory: ${sourceRoot}`);
  process.exit(2);
}

const config = loadTsConfig(sourceRoot);
const violations = [];
const unresolved = [];
const files = [];
const sourceCache = new Map();
const importsCache = new Map();

const layerRules = [
  {
    name: "presentation-cannot-import-state",
    sourceDirectories: ["UI/atoms", "UI/molecules", "UI/organisms"],
    targetDirectories: ["states"],
    message: "Presentation components must not depend on state modules, directly or transitively.",
  },
];

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
    dependencies.push({ resolved, specifier, index });
  }
  importsCache.set(file, dependencies);
  return dependencies;
}

function findForbiddenDependency(startFile, targetDirectories, visited = new Set()) {
  if (visited.has(startFile)) return null;
  visited.add(startFile);

  for (const dependency of dependenciesOf(startFile)) {
    if (targetDirectories.some((directory) => inDirectory(dependency.resolved, directory))) {
      return { ...dependency, target: dependency.resolved };
    }

    const nested = findForbiddenDependency(dependency.resolved, targetDirectories, visited);
    if (nested) return nested;
  }

  return null;
}

for (const file of files) {
  for (const rule of layerRules) {
    if (!rule.sourceDirectories.some((directory) => inDirectory(file, directory))) continue;

    const dependency = findForbiddenDependency(file, rule.targetDirectories);
    if (!dependency) continue;

    const source = sourceOf(file);
    violations.push({
      file: relative(file),
      line: lineAt(source, dependency.index),
      rule: rule.name,
      message: rule.message,
      import: dependency.specifier,
      target: relative(dependency.target),
    });
  }
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
console.log("Architecture boundary check passed.");
