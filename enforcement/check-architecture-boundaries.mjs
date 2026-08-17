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

const layerRules = [
  {
    name: "presentation-cannot-import-state",
    sourceDirectories: ["UI/atoms", "UI/molecules", "UI/organisms"],
    targetDirectories: ["states"],
    message: "Presentation components must not import state modules directly.",
  },
];

const files = [];
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

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");

  for (const { specifier, index } of extractImports(source)) {
    if (!specifier.startsWith(".") && !specifier.startsWith("@")) continue;

    const resolved = resolveImport(specifier, file, config);
    if (!resolved) {
      unresolved.push({ file: relative(file), line: lineAt(source, index), specifier });
      continue;
    }

    for (const rule of layerRules) {
      if (!rule.sourceDirectories.some((directory) => inDirectory(file, directory))) continue;
      if (!rule.targetDirectories.some((directory) => inDirectory(resolved, directory))) continue;

      violations.push({
        file: relative(file),
        line: lineAt(source, index),
        rule: rule.name,
        message: rule.message,
        import: specifier,
        target: relative(resolved),
      });
    }
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
