#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

const CHECKLIST = [
  'Todo arquivo elegível (componente, service, hook, util) sem teste precisa ganhar um, cobrindo caminho feliz + borda + erro',
  'Teste em src/__tests__/, espelhando src/, import pelo alias normal — nunca relativo, nunca colocado',
  'Um describe(Component.name, ...) por arquivo, sem aninhar',
  'Mock em <nome>.mock.ts separado, nunca inline no .test.tsx',
  'it() com mais de uma linha tem comentário Arrange/Act/Assert',
  'Nunca as any/as never em mock — usar Partial<T>/Pick<T> ou as unknown as T',
  'Nunca criar helper só pra fazer o teste passar (createAxiosResponse) — sinal de que o service vaza HTTP cru',
  'Nome de describe/it/fixture autoexplicativo — nunca "test 1"/data/fn',
]

const match = (path) => /\.test\.tsx?$/.test(path) || path.endsWith('.mock.ts')

const violations = (path, toolName, lines) => {
  const found = []
  const isTestFile = /\.test\.tsx?$/.test(path)
  const isMockFile = path.endsWith('.mock.ts')

  if (
    isTestFile &&
    /\/src\/(components|compositions|elements)\//.test(path) &&
    !path.includes('__tests__')
  ) {
    found.push('teste fica em src/__tests__/, espelhando a estrutura de src/')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/\bas never\b/.test(line)) {
      found.push(`${at}: as never — usar as unknown as T`)
    }

    if (isMockFile && /\bvi\.fn\(/.test(line)) {
      found.push(`${at}: vi.fn() em .mock.ts — isso vai no .test.tsx, aqui é só dado`)
    }

    if (isMockFile && /^\s*(export\s+)?const [A-Za-z]+\s*=\s*\(/.test(line)) {
      found.push(`${at}: função em .mock.ts — .mock.ts é só fixture de dado`)
    }

    if (
      isTestFile &&
      /^\s*const [A-Za-z]+\s*=\s*\([^()]*\)(?::\s*[\w<>[\], ]+)?\s*=>\s*\(\{/.test(line)
    ) {
      found.push(`${at}: factory de dado mockado dentro do teste — mover fixture pra .mock.ts`)
    }

    if (isTestFile && /it\(['"]test ?\d*['"]/i.test(line)) {
      found.push(`${at}: nome de it() genérico — descrever o comportamento verificado`)
    }
  })

  return found
}

await runSkillHook({ name: 'audit-tests', match, checklist: CHECKLIST, violations })
