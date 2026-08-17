#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nino-boundaries-"));
const src = path.join(root, "src");
const enforcement = path.resolve(new URL("..", import.meta.url).pathname);
const checker = path.join(enforcement, "check-architecture-boundaries.mjs");
const policy = path.join(enforcement, "architecture-boundaries.json");

function write(relative, content) {
  const file = path.join(src, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function run() {
  return spawnSync(process.execPath, [checker, src, policy], { encoding: "utf8" });
}

try {
  fs.writeFileSync(path.join(root, "tsconfig.app.json"), JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"] } } }));

  write("states/store.ts", "export const store = {};\n");
  write("UI/atoms/Button.tsx", "import { store } from \"@/states/store\"; export const Button = () => store;\n");
  let result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /presentation-cannot-import-state/);

  fs.rmSync(path.join(src, "UI/atoms/Button.tsx"));
  write("UI/atoms/Button.tsx", "export const Button = () => null;\n");
  write("UI/molecules/Form.tsx", "import { Button } from \"@/UI/atoms/Button\"; export const Form = () => Button;\n");
  write("UI/organisms/PanelWithState.tsx", "import { Form } from \"@/UI/molecules/Form\"; import { store } from \"@/states/store\"; export const PanelWithState = () => [Form, store];\n");
  result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /presentation-cannot-import-state/);

  fs.rmSync(path.join(src, "UI/organisms/PanelWithState.tsx"));
  result = run();
  assert.equal(result.status, 0, result.stderr);

  console.log("architecture boundary integration tests passed.");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
