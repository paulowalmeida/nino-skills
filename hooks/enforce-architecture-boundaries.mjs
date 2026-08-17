#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";

const checker = path.resolve(
  new URL("../enforcement/check-architecture-boundaries.mjs", import.meta.url).pathname,
);
const projectRoot = process.argv[2] ?? process.cwd();

const result = spawnSync(process.execPath, [checker, projectRoot], {
  stdio: "inherit",
});

if (result.error) {
  console.error(`Failed to execute architecture enforcement: ${result.error.message}`);
  process.exit(2);
}

process.exit(result.status ?? 2);
