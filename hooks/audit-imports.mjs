#!/usr/bin/env node
import { runSkillHook, lineLengthViolations } from './hook-kit.mjs'

const CHECKLIST = [
  'Ordem: React/framework → libs terceiras → workspace/aliases locais (mesmo grupo) → relativos → estilos por último',
  'Linha em branco entre cada grupo (workspace+aliases locais não separam entre si)',
  'Nunca importar raiz de pacote workspace (@nino/ds) — sempre subcaminho',
  'Nunca importar raiz de pasta de componente (@components/Nome) — sempre @components/Nome/Nome',
  'manager e consumer não têm plugin de sort — checar ordem visualmente',
  'Alias renomeado (import { X as Y }) precisa de nome autoexplicativo, nunca letra solta',
]

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  const found = [...lineLengthViolations(lines)]

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const code = line

    const workspaceBarrel = code.match(/from ['"]@nino\/(ds|lib|forms|api-types)['"]/)
    if (workspaceBarrel) {
      found.push(`${at}: barrel de @nino/${workspaceBarrel[1]} — importar o subcaminho`)
    }

    const folderBarrel = code.match(
      /from ['"]@(components|compositions|elements|skeletons|layouts)\/[A-Za-z0-9]+['"]/
    )
    if (folderBarrel) {
      found.push(`${at}: barrel de pasta — importar @${folderBarrel[1]}/Nome/Nome`)
    }

    if (/from ['"]@\//.test(code)) {
      found.push(`${at}: alias @/ não existe — usar @components, @hooks, etc`)
    }

    const singleLetterAlias = code.match(/\bas\s+([a-zA-Z])\b\s*[,}]/)
    if (singleLetterAlias) {
      found.push(`${at}: alias de import "${singleLetterAlias[1]}" não é autoexplicativo`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-imports', match, checklist: CHECKLIST, violations })
