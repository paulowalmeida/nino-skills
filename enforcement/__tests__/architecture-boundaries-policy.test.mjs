#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundaries-"));
const src = path.join(root, "src");
fs.mkdirSync(path.join(src, "UI", "atoms"), { recursive: true });
fs.mkdirSync(path.join(src, "states"), { recursive: true });
fs.writeFileSync(path.join(src, "states", "store.ts"), "export const state = {};\n");
fs.writeFileSync(path.join(src, "UI", "atoms", "Button.tsx"), "import { state } from \"../../states/store\"; export const Button = () => state;\n");
fs.writeFileSync(path.join(root, "tsconfig.json"), JSON.stringify({ compilerOptions: { baseUrl: "." } }));

const checker = path.resolve("enforcement/check-architecture-boundaries.mjs");
const policy = path.join(root, "policy.json");
fs.writeFileSync(policy, JSON.stringify({
  rules: [{
    id: "presentation-cannot-import-state",
    severity: "block",
    sourceDirectories: ["UI/atoms"],
    targetDirectories: ["states"],
    message: "state access is forbidden",
  }],
}));

let result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 1);
assert.match(result.stderr, /\[BLOCK\].*presentation-cannot-import-state/);

fs.writeFileSync(policy, JSON.stringify({
  rules: [{
    id: "presentation-cannot-import-state",
    severity: "warning",
    sourceDirectories: ["UI/atoms"],
    targetDirectories: ["states"],
  }],
}));
result = spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
assert.equal(result.status, 0);
assert.match(result.stderr, /\[WARNING\].*presentation-cannot-import-state/);

fs.rmSync(root, { recursive: true, force: true });
console.log("architecture boundary policy tests passed.");
