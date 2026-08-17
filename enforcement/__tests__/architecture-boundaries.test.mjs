#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const checker = path.resolve("enforcement/check-architecture-boundaries.mjs");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundary-"));

function write(relativePath, content) {
  const target = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function run() {
  return spawnSync(process.execPath, [checker, tempRoot], { encoding: "utf8" });
}

try {
  write("UI/atoms/Button.tsx", 'import { useState } from "react";\nexport function Button() { return null; }\n');
  write("UI/molecules/Search.tsx", 'export function Search() { return null; }\n');
  write("UI/organisms/Table.tsx", 'export function Table() { return null; }\n');
  write("states/useStore.ts", "export const store = {};\n");

  let result = run();
  assert.equal(result.status, 0, result.stderr);

  write(
    "UI/atoms/Invalid.tsx",
    'import { store } from "../../states/useStore";\nexport function Invalid() { return store; }\n',
  );

  result = run();
  assert.equal(result.status, 1, "A presentation-layer state import must fail.");
  assert.match(result.stderr, /presentation-cannot-import-state/);

  write(
    "services/Valid.ts",
    'import { store } from "../states/useStore";\nexport function Valid() { return store; }\n',
  );

  result = run();
  assert.equal(result.status, 1, "The existing invalid atom should still fail while service imports remain allowed.");

  fs.rmSync(path.join(tempRoot, "UI/atoms/Invalid.tsx"));
  result = run();
  assert.equal(result.status, 0, result.stderr);

  console.log("Architecture boundary checker tests passed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
