#!/usr/bin/env node
import { runSkillHook } from './hook-kit.mjs'

// Fronteira de camada é julgamento (não regex): as checagens mecânicas de
// import indevido já ficam em cada hook de camada (audit-elements,
// audit-components, audit-pages, audit-layouts). Este hook só lembra.

const CHECKLIST = [
  'Elements: simples, não compõem nada além de DS/router glue',
  'Components: combinam elements/DS numa unidade — não compõem outro app component',
  'Compositions: seção coesa combinando components/elements — nunca chamam service direto',
  'Pages: só governança (params, redirect, loading via hook, qual composition mostrar)',
  'Layouts: chrome + <Outlet /> — nunca escolhem a página ativa',
  'Nome sinaliza a camada certa (element = unidade pequena, composition = seção, page = rota)',
]

const match = (path) => /\/src\/(elements|components|compositions|pages|layouts)\//.test(path)

const violations = () => []

await runSkillHook({ name: 'audit-architecture', match, checklist: CHECKLIST, violations })
