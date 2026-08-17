// Shared runtime for executable enforcement hooks.

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
  lines.map((line, index) => [index + 1, line.length]).filter(([, length]) => length > 80).map(([number, length]) => `linha ${number} do trecho escrito: ${length} caracteres (máx 80)`)

export const runSkillHook = async (skill) => {
  const input = JSON.parse((await readStdin()) || '{}')
  const path = input.tool_input?.file_path ?? ''
  if (!path.includes('nino-app/') || !skill.match(path)) process.exit(0)
  if (input.hook_event_name === 'PreToolUse') {
    const checklist = (skill.checklist ?? []).map((item) => `- ${item}`).join('\n')
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: checklist ? `[${skill.name}] Regras para este arquivo:\n${checklist}` : `[${skill.name}] Enforcement ativo.` } }))
    process.exit(0)
  }
  const text = textWrittenBy(input.tool_name, input.tool_input)
  if (text === null) process.exit(0)
  const found = skill.violations(path, input.tool_name, text.split('\n'))
  if (found.length === 0) process.exit(0)
  console.error(`${path} viola regras de [${skill.name}]. Corrija antes de seguir:\n${found.map((item) => `  ${item}`).join('\n')}`)
  process.exit(2)
}
