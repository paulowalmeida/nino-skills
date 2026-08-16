# Regras do Design System

## Fonte oficial

O Design System do `nino-app` está em:

```text
packages/ds/src/components/
```

O repositório contém componentes como `Button`, `Dialog`, `Card`, `Input`, `Label`, `Toast`, `Alert`, `Switch`, `Slider`, `Drawer`, `Select`, `Avatar`, `Popover`, `Spinner` e outros componentes do DS. O código do DS é a referência oficial para reutilização de UI.

## DS-first

O Design System é **DS-first, não DS-only**.

Antes de criar qualquer UI, o agente **DEVE**:

1. pesquisar `packages/ds/src/components/`;
2. identificar componentes do DS que possam atender ao requisito;
3. verificar a API/props do candidato encontrado;
4. reutilizar o componente do DS quando ele atender ao requisito;
5. somente criar uma solução específica da aplicação quando não existir uma solução adequada no DS.

**NÃO DEVE** criar uma implementação própria antes de pesquisar o DS.

## Não duplicar o Design System

É proibido criar no app uma implementação semanticamente equivalente a um componente existente do DS.

Exemplos proibidos quando o DS já possui solução adequada:

```tsx
// ❌ recriar um botão do DS
<button className="...">Salvar</button>
```

```tsx
// ❌ criar um componente local equivalente a Button sem necessidade
function SaveButton() {
  return <button>Salvar</button>
}
```

O componente do app pode **compor** um componente do DS quando precisar adicionar comportamento/composição específica do domínio.

## O DS não é obrigatório quando não resolve

Não force o uso de um componente do DS quando ele não atende ao requisito real.

Quando não houver solução adequada no DS, um componente específico da aplicação pode ser criado, respeitando as regras do Atomic Design.

A ausência de um componente no DS é uma justificativa válida para criar uma solução local; preferência pessoal do agente não é.

## Descoberta de componentes

O agente **NÃO DEVE** assumir que um componente não existe.

A descoberta deve ser feita no catálogo/código real do DS.

Para um componente candidato, o agente deve consultar sua implementação e/ou tipos antes de decidir que ele não atende ao requisito.

Uma busca por nome isolada não é suficiente para declarar que o DS não possui uma solução adequada.

## Composição do DS

Componentes próprios da aplicação podem compor componentes do DS.

O componente próprio deve adicionar uma responsabilidade real que não exista no componente do DS, em vez de apenas duplicar sua implementação ou estilo.

## Criação de novo componente no DS

A criação de um novo componente no Design System é diferente da criação de um componente específico de um app.

**Não crie um novo componente dentro de `packages/ds` apenas para resolver uma necessidade local da aplicação**.

Quando a necessidade parecer genérica o suficiente para pertencer ao DS, essa decisão deve ser tratada como uma mudança arquitetural explícita e não como uma escolha silenciosa durante uma tarefa comum de UI.

## Verificação obrigatória antes de concluir UI

Antes de concluir uma tarefa de UI, o agente deve conseguir responder:

- Qual solução do DS foi considerada?
- Ela foi reutilizada? Se não, por quê?
- Se uma implementação própria foi criada, qual lacuna do DS justificou a criação?

Não declare que uma implementação está alinhada ao DS sem evidência de que o DS foi consultado.

## Enforcement mecânico

As seguintes regras devem ser transformadas em verificações automáticas sempre que tecnicamente possível:

### 1. Importações

Componentes do app devem importar componentes do DS a partir da API/padrão oficial do pacote, evitando caminhos internos quando houver uma API pública definida.

### 2. Duplicação óbvia

Checks devem detectar implementações locais que recriem primitivas/componentes conhecidos do DS quando houver equivalência objetiva.

### 3. Catálogo machine-readable

O enforcement do DS não deve depender apenas do julgamento do LLM.

Criar posteriormente um catálogo machine-readable dos componentes do DS, contendo pelo menos:

- nome;
- caminho oficial de import;
- categoria/responsabilidade;
- aliases semânticos úteis;
- primitivas que substitui, quando aplicável.

Esse catálogo será usado por hooks/AST checks para detectar violações objetivas e para auxiliar o agente na descoberta.

### 4. Falha deve bloquear

Quando uma regra objetiva do DS for violada, o mecanismo de enforcement deve bloquear a alteração e informar:

- arquivo;
- linha;
- regra violada;
- componente do DS esperado, quando identificável.

O agente deve corrigir a implementação. Ele não deve desabilitar ou contornar o check.

## Regra final

> **Pesquisar o Design System é uma etapa obrigatória de qualquer implementação de UI. Reutilizar quando aplicável é obrigatório. Criar uma alternativa própria exige uma justificativa baseada em uma lacuna real do DS, não em preferência do agente.**
