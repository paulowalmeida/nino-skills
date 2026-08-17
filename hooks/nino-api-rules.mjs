#!/usr/bin/env node

/*
 * Regras do nino-api cobradas na hora da escrita, não depois da revisão.
 *
 * PreToolUse  → devolve o checklist do tipo de arquivo antes da escrita.
 * PostToolUse → escaneia só o que a chamada escreveu (new_string do Edit,
 *               content do Write) e sai com código 2 no que estiver errado.
 *
 * Escanear só o texto novo, nunca o arquivo inteiro, é deliberado: o repo
 * tem débito conhecido (linha >80, any/unknown) em código legado. Escanear
 * o arquivo inteiro bloquearia qualquer edição não relacionada num arquivo
 * antigo por causa de uma violação que já estava lá antes desta chamada.
 */

const API_ROOT = 'nino-api/'

const CHECKLIST = {
  spec: [
    'Um describe(ClassName.name) por arquivo, sem aninhar',
    'it() em inglês, máximo 80 caracteres',
    'Mock tipado com Partial<T> ou Pick<T, ...> — nunca as any',
  ],
  controller: [
    '@UseGuards(JwtAuthGuard, RolesGuard) na classe',
    '@Roles(...) em cada endpoint, com GlobalRole ou TenantRole',
    'Resposta com relação: omitir a FK por destructuring, incluir a entidade',
  ],
  repository: [
    'Sem try/catch manual — o BaseRepository encapsula em executeFnWithTryCatch',
    'P2025 já dispara em update/delete: nunca checar existência antes',
  ],
  ts: [
    'Máximo 80 caracteres por linha, sem ponto e vírgula, aspas simples',
    'Zero any e zero unknown — types reais',
    'Retorno explícito em todo método',
    'Type nunca inline em arquivo de classe: um por arquivo em types/',
    'Service fala só com o próprio repository, sem injetar service de outro',
    'Complexidade é sinal diagnóstico; não refatorar apenas para satisfazer métrica',
    'Todo identificador (variável, método, classe, DTO) autoexplicativo sem abrir o arquivo',
    'Zero comentário narrativo — só WHY escondido (constraint, motivo, workaround)',
    'Teste cobre caminho feliz, borda e erro',
  ],
}

const readStdin = async () => {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

const kindOf = (path) => {
  if (!path.endsWith('.ts')) return null
  if (path.endsWith('.spec.ts')) return 'spec'
  if (path.endsWith('.controller.ts')) return 'controller'
  if (path.endsWith('.repository.ts')) return 'repository'
  return 'ts'
}

const textWrittenBy = (toolName, toolInput) => {
  if (toolName === 'Write') return toolInput?.content ?? null
  if (toolName === 'Edit') return toolInput?.new_string ?? null
  return null
}

const classFileViolations = (path, toolName, source, lines, found) => {
  const isClassFile = /\.(controller|service|repository|module)\.ts$/.test(path)

  if (isClassFile && /^\s*(export\s+)?(type|interface)\s+\w+/m.test(source)) {
    found.push('type declarado em arquivo de classe: mover para types/')
  }

  if (path.endsWith('.controller.ts') && toolName === 'Write') {
    if (!source.includes('@UseGuards(')) {
      found.push('controller sem @UseGuards(JwtAuthGuard, RolesGuard)')
    }

    const endpoints = source.match(/@(Get|Post|Patch|Put|Delete)\(/g) ?? []
    const roles = source.match(/@Roles\(/g) ?? []
    if (endpoints.length > roles.length) {
      found.push(
        `${endpoints.length} endpoints e ${roles.length} @Roles — falta @Roles`
      )
    }
  }

  if (path.endsWith('.repository.ts') && /^\s*try\s*{/m.test(source)) {
    found.push('try/catch manual: o BaseRepository já encapsula')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const code = line.replace(/\/\/.*$/, '')

    if (/;\s*$/.test(code) && !/^\s*(for|\/\*|\*)/.test(code)) {
      found.push(`${at}: ponto e vírgula no fim da linha`)
    }

    if (/(:\s*(any|unknown)\b|\bas (any|unknown)\b)/.test(code)) {
      found.push(`${at}: any/unknown — usar o type real`)
    }

    if (/\bRole\b/.test(code) && !/\/\//.test(line)) {
      found.push(`${at}: enum Role foi removido — usar GlobalRole ou TenantRole`)
    }

    const method = code.match(/^ {2}(async\s+)?([a-zA-Z]\w*)\s*\([^)]*\)\s*{\s*$/)
    if (method && method[2] !== 'constructor') {
      found.push(`${at}: método ${method[2]} sem tipo de retorno explícito`)
    }
  })
}

const specViolations = (source, found) => {
  const describes = source.match(/^\s*describe\(/gm) ?? []
  if (describes.length > 1) {
    found.push(`${describes.length} describes: usar um só por arquivo`)
  }
}

const lineLengthViolations = (lines) =>
  lines
    .map((line, index) => [index + 1, line.length])
    .filter(([, length]) => length > 80)
    .map(([number, length]) => `linha ${number} do trecho escrito: ${length} caracteres (máx 80)`)

const main = async () => {
  const input = JSON.parse((await readStdin()) || '{}')
  const path = input.tool_input?.file_path ?? ''

  if (!path.includes(API_ROOT)) process.exit(0)

  const kind = kindOf(path)
  if (!kind) process.exit(0)

  if (input.hook_event_name === 'PreToolUse') {
    const items = [...CHECKLIST.ts, ...(CHECKLIST[kind] ?? [])]
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext:
            'Regras do nino-api para este arquivo:\n' +
            items.map((item) => `- ${item}`).join('\n'),
        },
      })
    )
    process.exit(0)
  }

  const toolName = input.tool_name
  const source = textWrittenBy(toolName, input.tool_input)
  if (source === null) process.exit(0)

  const lines = source.split('\n')
  const found = lineLengthViolations(lines)

  if (kind === 'spec') specViolations(source, found)
  else classFileViolations(path, toolName, source, lines, found)

  if (found.length === 0) process.exit(0)

  console.error(
    `${path} viola as regras do nino-api. Corrija antes de seguir:\n` +
      found.map((item) => `  ${item}`).join('\n')
  )
  process.exit(2)
}

main()
