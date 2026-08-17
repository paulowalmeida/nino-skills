import fs from "node:fs";
import path from "node:path";

export const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs"];

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function loadTsConfig(sourceRoot) {
  const candidates = [
    path.join(sourceRoot, "..", "tsconfig.app.json"),
    path.join(sourceRoot, "tsconfig.json"),
    path.join(sourceRoot, "..", "..", "tsconfig.json"),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const config = readJson(candidate);
    const compilerOptions = config.compilerOptions ?? {};
    return {
      baseUrl: path.resolve(path.dirname(candidate), compilerOptions.baseUrl ?? "."),
      paths: compilerOptions.paths ?? {},
    };
  }

  return { baseUrl: sourceRoot, paths: {} };
}

function fileCandidates(base) {
  return [
    base,
    ...SOURCE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) => path.join(base, `index${extension}`)),
  ];
}

export function resolveImport(specifier, importer, config) {
  const candidates = [];

  if (specifier.startsWith(".")) {
    candidates.push(path.resolve(path.dirname(importer), specifier));
  }

  for (const [alias, targets] of Object.entries(config.paths)) {
    const prefix = alias.endsWith("/*") ? alias.slice(0, -2) : alias;
    if (specifier !== prefix && !specifier.startsWith(`${prefix}/`)) continue;

    const remainder = specifier.slice(prefix.length).replace(/^\//, "");
    for (const target of targets) {
      const targetPrefix = target.endsWith("/*") ? target.slice(0, -2) : target;
      candidates.push(path.resolve(config.baseUrl, targetPrefix, remainder));
    }
  }

  for (const candidate of candidates) {
    for (const file of fileCandidates(candidate)) {
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
    }
  }

  return null;
}

export function extractImports(source) {
  const imports = [];
  const pattern = /(?:^|[;\n])\s*import\s+(?:type\s+)?(?:[^;\n]*?\s+from\s+)?["']([^"']+)["']|(?:^|[;\n])\s*export\s+(?:[^;\n]*?\s+from\s+)["']([^"']+)["']|\brequire\s*\(\s*["']([^"']+)["']\s*\)/gm;
  let match;

  while ((match = pattern.exec(source))) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier) imports.push({ specifier, index: match.index });
  }

  return imports;
}

export function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}
