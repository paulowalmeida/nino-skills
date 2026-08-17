#!/usr/bin/env node

/**
 * Mechanical architecture-boundary checker.
 *
 * This checker intentionally verifies only import boundaries. It does not
 * attempt to decide semantic responsibility, cohesion, or component quality.
 *
 * Usage:
 *   node enforcement/check-architecture-boundaries.mjs <project-src-root>
 */

import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];

if (!root) {
  console.error("Usage: node enforcement/check-architecture-boundaries.mjs <project-src-root>");
  process.exit(2);
}

const sourceRoot = path.resolve(root);

if (!fs.existsSync(sourceRoot)) {
  console.error(`Source root does not exist: ${sourceRoot}`);
  process.exit(2);
}

const rules = [
  {
    name: "presentation-cannot-import-zustand",
    directories: ["UI/atoms", "UI/molecules", "UI/organisms"],
    forbidden: /(?:^|[/\\])(?:useStore|stores?|store)(?:[/\\]|\.|$)/i,
    message: "Presentation components must not import Zustand/store modules directly.",
  },
];

const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs"]);
const violations = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (extensions.has(path.extname(entry.name))) inspect(fullPath);
  }
}

function inspect(file) {
  const relative = path.relative(sourceRoot, file).split(path.sep).join("/");
  const source = fs.readFileSync(file, "utf8");

  for (const rule of rules) {
    if (!rule.directories.some((directory) => relative === directory || relative.startsWith(`${directory}/`))) continue;

    const importPattern = /(?:import\s+(?:[^;]*?\s+from\s+)?|export\s+[^;]*?\s+from\s+|require\s*\(\s*)(["'])([^"']+)\1/g;
    let match;

    while ((match = importPattern.exec(source))) {
      const specifier = match[2];
      if (!rule.forbidden.test(specifier)) continue;

      const line = source.slice(0, match.index).split("\n").length;
      violations.push({
        file: relative,
        line,
        rule: rule.name,
        message: rule.message,
        import: specifier,
      });
    }
  }
}

walk(sourceRoot);

for (const violation of violations) {
  console.error(`${violation.file}:${violation.line} [BLOCK] ${violation.rule}: ${violation.message} (${violation.import})`);
}

if (violations.length > 0) {
  process.exit(1);
}

console.log("Architecture boundary check passed.");
