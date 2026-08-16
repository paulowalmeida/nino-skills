# Regras do Design System

Este arquivo define **restrições obrigatórias para qualquer implementação de UI**.

## Fonte oficial

O Design System do `nino-app` está em:

```text
packages/ds/src/components/
```

Esse código é a **fonte oficial** para reutilização de componentes de UI.

O DS atualmente contém, entre outros, componentes como `Button`, `Dialog`, `Card`, `Input`, `Label`, `Toast`, `Alert`, `Switch`, `Slider`, `Drawer`, `Select`, `Avatar`, `Popover`, `Spinner`, `Tabs`, `Menu`, `Table`, `Badge`, `Tooltip` e `Stepper`.

A lista acima é apenas ilustrativa. **O código real do DS sempre tem precedência sobre memória ou exemplos desta documentação.**

## Regra DS-first

O Design System é **DS-first, não DS-only**.

Antes de criar, editar ou substituir qualquer UI própria, o agente **DEVE** seguir esta ordem:

1. localizar a área correspondente do Design System;
2. pesquisar componentes candidatos por nome e responsabilidade;
3. inspecionar a implementação e os tipos/props dos candidatos relevantes;
4. determinar se algum candidato atende ao requisito;
5. reutilizar o componente do DS quando ele atender;
6. somente depois considerar uma implementação específica da aplicação.

**É PROIBIDO criar uma implementação própria antes de concluir a pesquisa necessária do DS.**

## O que significa "atende ao requisito"

Um componente do DS é considerado adequado quando ele atende ao **comportamento e à responsabilidade solicitados** sem exigir uma adaptação que destrua seu contrato, semântica ou finalidade.

Diferença visual pequena, preferência estética ou preferência pessoal do agente **NÃO são justificativas suficientes** para abandonar um componente existente do DS.

Uma necessidade funcional que o componente do DS não suporta de forma compatível **PODE justificar composição ou uma implementação local**, respeitando as regras de arquitetura.

## Não duplicar o DS

É **PROIBIDO** criar no app uma implementação semanticamente equivalente a um componente do DS quando o componente existente atende ao requisito.

Exemplos:

```tsx
// ❌ recriar um Button do DS
<button className="...">Salvar</button>
```

```tsx
// ❌ criar um equivalente local de Button sem necessidade real
function SaveButton() {
  return <button>Salvar</button>
}
```

Outro exemplo conceitual:

```text
DS já fornece Select
        ↓
criar LocalSelect com a mesma responsabilidade
        ↓
❌ PROIBIDO
```

## DS-first não significa DS-forçado

Não force o uso de um componente do DS quando ele **não atende ao requisito real**.

Quando o DS não fornecer uma solução adequada:

- um componente específico da aplicação **PODE** ser criado;
- ele **DEVE** obedecer às regras do Atomic Design;
- a ausência de solução adequada no DS é a justificativa para a criação local;
- preferência pessoal, conveniência ou desconhecimento do DS **NÃO são justificativas**.

## Composição antes de duplicação

Se o DS não resolver sozinho, o agente **DEVE avaliar composição antes de duplicar implementação**.

Exemplo:

```text
DS Button + comportamento específico
        ↓
compor o Button
        ✅

recriar Button localmente
        ❌
```

A composição deve adicionar responsabilidade real. Um wrapper sem responsabilidade própria, criado apenas para reproduzir a API/estilo do DS, é suspeito e deve ser evitado.

## Descoberta do DS

O agente **NÃO PODE assumir que um componente não existe**.

Também é proibido concluir "o DS não possui" baseado apenas em:

- memória do modelo;
- um único nome pesquisado;
- uma busca superficial;
- inspeção de um arquivo diferente;
- documentação antiga sem confirmação no código atual.

Quando houver candidato plausível, o agente **DEVE ler a implementação e/ou tipos relevantes antes de descartá-lo**.

## Evidência da decisão

Para qualquer componente UI novo ou substituição de componente, o agente deve conseguir identificar:

```text
1. o requisito solicitado;
2. os componentes do DS considerados;
3. o candidato escolhido, se houver;
4. por que ele atende;
5. ou qual lacuna real impediu seu uso.
```

Se uma implementação local for criada porque o DS não atende, **a razão deve ser específica e verificável**, não uma frase genérica como "não se encaixa".

## Imports do DS

Quando o projeto possuir uma API pública/padrão de importação para o DS, o agente **DEVE usar essa API**.

É **PROIBIDO** acessar arquivos internos do DS por caminhos profundos quando existir uma entrada pública destinada ao consumidor.

Exemplo conceitual:

```tsx
// ✅ API pública do DS
import { Button } from '@ds/components/Button'

// ❌ caminho interno arbitrário, se não for API pública
import { Button } from '@ds/components/Button/Button'
```

A implementação real do repositório é a autoridade para determinar qual caminho é oficial.

## Não alterar o DS por conveniência

Durante uma tarefa normal de UI de uma aplicação consumidora:

- **NÃO criar novos componentes em `packages/ds`** apenas para resolver uma necessidade local;
- **NÃO alterar um componente existente do DS** apenas para atender uma necessidade específica do app sem uma tarefa explícita para isso;
- **NÃO introduzir API nova no DS silenciosamente**.

Uma mudança no Design System é uma mudança de escopo/arquitetura e deve ser explícita.

## Procedimento obrigatório para criação de UI

Antes de escrever TSX de UI, o agente **DEVE** completar:

```text
[ ] Requisito da UI identificado
[ ] DS pesquisado
[ ] Candidato(s) relevante(s) inspecionado(s)
[ ] Composição avaliada
[ ] Componente existente do app pesquisado
[ ] Decisão DS vs. local tomada
[ ] Camada Atomic Design definida
[ ] Só então: implementação
```

**Não pule uma etapa relevante para acelerar a tarefa.**

## Verificação antes de concluir

Antes de concluir uma tarefa de UI, o agente **DEVE verificar**:

- se uma implementação própria duplicou algo que o DS já fornecia;
- se o componente do DS utilizado corresponde ao requisito real;
- se os imports seguem a API oficial;
- se qualquer decisão de não reutilização do DS possui justificativa concreta;
- se a solução criada respeita as regras de arquitetura.

Passar em testes ou lint **não prova sozinho** que a regra DS-first foi cumprida.

## Enforcement

Regras objetivas devem ser protegidas por mecanismos automáticos sempre que possível.

### Enforcement mínimo esperado

1. **Imports:** detectar caminhos de import proibidos e imports do DS fora da API oficial.
2. **Catálogo:** manter uma representação machine-readable dos componentes do DS, seus imports oficiais e responsabilidade.
3. **Duplicação objetiva:** detectar recriações claras de primitivas/componentes do DS.
4. **Arquitetura:** verificar se componentes de camadas proibidas estão recriando componentes do DS em vez de reutilizá-los.
5. **Bloqueio:** uma violação objetiva deve fazer o check falhar.

A mensagem de falha deve informar, quando possível:

- arquivo;
- linha;
- regra violada;
- componente do DS esperado;
- caminho oficial de import.

O agente **DEVE corrigir a causa**. É **PROIBIDO desabilitar ou enfraquecer o check** para permitir a alteração.

## Regra final

> **Pesquisar o Design System é obrigatório antes de qualquer criação ou substituição de UI. Reutilizar uma solução adequada é obrigatório. Criar algo próprio exige uma lacuna real e verificável do DS.**
