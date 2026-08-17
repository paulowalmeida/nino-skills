#!/usr/bin/env node

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  if (!match(path)) return []

  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    const workspaceBarrel = line.match(/from ['"]@nino\/(ds|lib|forms|api-types)['"]/) 
    if (workspaceBarrel) found.push(`${at}: barrel de @nino/${workspaceBarrel[1]} — importar subcaminho`)

    const folderBarrel = line.match(/from ['"]@(components|compositions|elements|skeletons|layouts)\/[A-Za-z0-9]+['"]/) 
    if (folderBarrel) found.push(`${at}: barrel de pasta — importar o arquivo concreto`)

    if (/from ['"]@\//.test(line)) found.push(`${at}: alias @/ não existe`)
  })

  return found
}

export { match, violations }
