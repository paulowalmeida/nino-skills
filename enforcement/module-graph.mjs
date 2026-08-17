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

function skipTrivia(source, index) {
  let cursor = index;
  while (cursor < source.length) {
    if (/\s/.test(source[cursor])) {
      cursor += 1;
      continue;
    }
    if (source.startsWith("//", cursor)) {
      const end = source.indexOf("\n", cursor + 2);
      cursor = end === -1 ? source.length : end + 1;
      continue;
    }
    if (source.startsWith("/*", cursor)) {
      const end = source.indexOf("*/", cursor + 2);
      cursor = end === -1 ? source.length : end + 2;
      continue;
    }
    break;
  }
  return cursor;
}

function readString(source, index) {
  const quote = source[index];
  if (quote !== "\"" && quote !== "'") return null;

  let cursor = index + 1;
  let value = "";
  while (cursor < source.length) {
    const char = source[cursor];
    if (char === "\\") {
      if (cursor + 1 >= source.length) return null;
      value += source[cursor + 1];
      cursor += 2;
      continue;
    }
    if (char === quote) return { value, end: cursor + 1 };
    if (char === "\n" || char === "\r") return null;
    value += char;
    cursor += 1;
  }
  return null;
}

function skipStringOrTemplate(source, index) {
  const quote = source[index];
  if (quote === "'" || quote === '"') {
    const value = readString(source, index);
    return value?.end ?? source.length;
  }
  if (quote !== "`") return index;

  let cursor = index + 1;
  while (cursor < source.length) {
    if (source[cursor] === "\\") {
      cursor += 2;
      continue;
    }
    if (source[cursor] === "`") return cursor + 1;
    cursor += 1;
  }
  return source.length;
}

function readIdentifier(source, index) {
  const match = /^[A-Za-z_$][\w$]*/.exec(source.slice(index));
  return match ? { value: match[0], end: index + match[0].length } : null;
}

export function extractImports(source) {
  const imports = [];
  let cursor = 0;

  while (cursor < source.length) {
    if (source.startsWith("//", cursor)) {
      const end = source.indexOf("\n", cursor + 2);
      cursor = end === -1 ? source.length : end + 1;
      continue;
    }
    if (source.startsWith("/*", cursor)) {
      const end = source.indexOf("*/", cursor + 2);
      cursor = end === -1 ? source.length : end + 2;
      continue;
    }
    if (source[cursor] === "'" || source[cursor] === '"' || source[cursor] === "`") {
      cursor = skipStringOrTemplate(source, cursor);
      continue;
    }

    const token = readIdentifier(source, cursor);
    if (!token) {
      cursor += 1;
      continue;
    }

    if (token.value === "import") {
      let next = skipTrivia(source, token.end);
      if (source[next] === "(") {
        next = skipTrivia(source, next + 1);
        const literal = readString(source, next);
        if (literal) imports.push({ specifier: literal.value, index: cursor });
      } else if (source[next] === ".") {
        // import.meta is not a module dependency.
      } else {
        const literal = readString(source, next);
        if (literal) {
          imports.push({ specifier: literal.value, index: cursor });
        } else {
          const from = /\bfrom\b/g;
          from.lastIndex = next;
          const match = from.exec(source);
          if (match) {
            const candidate = readString(source, skipTrivia(source, match.index + match[0].length));
            if (candidate) imports.push({ specifier: candidate.value, index: cursor });
          }
        }
      }
    } else if (token.value === "export") {
      const next = skipTrivia(source, token.end);
      const from = /\bfrom\b/g;
      from.lastIndex = next;
      const match = from.exec(source);
      if (match) {
        const candidate = readString(source, skipTrivia(source, match.index + match[0].length));
        if (candidate) imports.push({ specifier: candidate.value, index: cursor });
      }
    } else if (token.value === "require") {
      const next = skipTrivia(source, token.end);
      if (source[next] === "(") {
        const literal = readString(source, skipTrivia(source, next + 1));
        if (literal) imports.push({ specifier: literal.value, index: cursor });
      }
    }

    cursor = token.end;
  }

  return imports;
}

export function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}
