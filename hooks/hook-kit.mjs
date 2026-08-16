// Utilitário compartilhado pelos 21 hooks audit-*.mjs. Cada hook continua
// sendo seu próprio processo, com sua própria entrada em settings.json — isto
// aqui só evita repetir o protocolo de stdin/stdout em cada um.

export const readStdin = async () => {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export const textWrittenBy = (toolName, toolInput) => {
  if (toolName === 'Write') return toolInput?.content ?? null
  if (toolName === 'Edit') return toolInput?.new_string ?? null
  return null
}

export const lineLengthViolations = (lines) =>
  lines
    .map((line, index) => [index + 1, line.length])
    .filter(([, length]) => length > 80)
    .map(
      ([number, length]) =>
        `linha ${number} do trecho escrito: ${length} caracteres (máx 80)`
    )

/**
 * Roda um hook de skill. `skill` = { name, match(path), checklist, violations }
 * - match(path): filtro de arquivo — a skill só age se retornar true
 * - checklist: string[] — devolvido no PreToolUse como lembrete
 * - violations(path, toolName, lines): string[] — checagem mecânica; se
 *   vazio, a skill nunca bloqueia (PostToolUse sempre sai 0)
 */
export const runSkillHook = async (skill) => {
  const input = JSON.parse((await readStdin()) || '{}')
  const path = input.tool_input?.file_path ?? ''

  if (!path.includes('nino-app/') || !skill.match(path)) process.exit(0)

  if (input.hook_event_name === 'PreToolUse') {
    const checklist = skill.checklist.map((item) => `- ${item}`).join('\n')
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext: `[${skill.name}] Regras para este arquivo:\n${checklist}`,
        },
      })
    )
    process.exit(0)
  }

  const toolName = input.tool_name
  const text = textWrittenBy(toolName, input.tool_input)
  if (text === null) process.exit(0)

  const lines = text.split('\n')
  const found = skill.violations(path, toolName, lines)

  if (found.length === 0) process.exit(0)

  console.error(
    `${path} viola regras de [${skill.name}]. Corrija antes de seguir:\n` +
      found.map((item) => `  ${item}`).join('\n')
  )
  process.exit(2)
}
