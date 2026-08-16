# Nino — Regras de Arquitetura TSX

> Contrato de trabalho para a arquitetura de componentes frontend. Este documento consolida as decisões tomadas durante a revisão da arquitetura.

## 1. Modelo arquitetural

A UI segue **Atomic Design**:

```text
Layout
  ↓
Page
  ↓
Template
  ↓
Organism
  ↓
Molecule
  ↓
Atom
```

`Layout` é uma responsabilidade estrutural da aplicação e está **fora da hierarquia do Atomic Design**. Ele envolve/governa Pages e fornece a estrutura persistente da aplicação, como header, sidebar, navegação e áreas de conteúdo.

### Atoms

- Unidades básicas de UI.
- Podem vir do Design System ou ser específicos da aplicação consumidora.
- Não possuem lógica de negócio.
- Não acessam API/Service.
- Não podem depender de níveis superiores do Atomic Design.

### Molecules

- Combinam dois ou mais Atoms em uma unidade funcional de UI.
- Podem utilizar Atoms do DS e Atoms específicos da aplicação.
- Não possuem lógica de negócio.
- Não acessam API/Service diretamente.
- Podem possuir estado local quando esse estado pertence à própria interação da Molecule.

### Organisms

- Seções significativas da UI compostas por Molecules e/ou Atoms.
- Podem possuir estado local e interação pertencentes à própria seção.
- Não possuem lógica de negócio.
- Não acessam API/Service diretamente.
- Não podem depender de Templates ou Pages.

### Templates

- Definem a composição estrutural de uma página.
- São a camada responsável por compor Organisms, Molecules e Atoms.
- Representam a estrutura da página, não uma rota concreta nem dados concretos da aplicação.
- Não possuem lógica de negócio.
- Não acessam API/Service diretamente.
- Um Template pode pular níveis inferiores quando isso fizer sentido (por exemplo, Template → Organism → Atom).

### Pages

- Representam uma rota/contexto concreto da aplicação.
- Atuam como a **camada de governança da UI** daquela rota.
- Coordenam contexto, estado, dados e dependências da página.
- **Devem utilizar um Template como sua camada de composição visual.**
- **Não devem compor diretamente Organisms, Molecules ou Atoms.**
- Não devem absorver responsabilidades visuais pertencentes às camadas inferiores.

## 2. Composição e dependências

### Direção

As dependências seguem a hierarquia:

```text
Page → Template → Organism → Molecule → Atom
```

Um componente **não pode depender de outro componente da mesma camada do Atomic Design**.

Uma camada superior pode pular camadas inferiores quando isso fizer sentido. Por exemplo, um Template pode utilizar um Organism diretamente, sem precisar criar uma Molecule artificialmente.

Porém:

> Um componente de nível superior não deve se tornar um agrupamento arbitrário de componentes de nível inferior. Se um conjunto de Atoms formar uma unidade funcional coerente e reutilizável, ele deve ser representado como uma Molecule em vez de permanecer como um agrupamento incidental de Atoms dentro de um Organism.

## 3. Design System — DS-first

O Design System é **DS-first, não DS-only**.

Antes de criar qualquer UI, o agente deve:

1. Procurar no Design System uma solução existente adequada.
2. Reutilizar a solução existente quando ela atender ao requisito.
3. Se o DS não possuir uma solução adequada, criar um componente específico da aplicação quando apropriado.

O mesmo princípio vale para componentes existentes na própria aplicação: antes de criar um novo componente, procurar um componente com a mesma responsabilidade ou suficientemente próxima e priorizar reutilização/composição quando apropriado.

## 4. Estrutura dos componentes

Os componentes são organizados por camada do Atomic Design:

```text
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── pages/
└── layouts/
```

Regras:

- Um componente por pasta.
- Não utilizar barrel files / `index.ts` para exportar componentes.
- A pasta do componente contém o TSX e seu CSS Module.
- Os testes ficam fora de `src`, dentro de `__tests__`, replicando a estrutura de `src`.

Exemplo:

```text
src/
└── atoms/
    └── Button/
        ├── Button.tsx
        └── Button.module.css

__tests__/
└── atoms/
    └── Button/
        └── Button.test.tsx
```

## 5. Nomes autoexplicativos

Os nomes devem comunicar claramente a **responsabilidade, domínio e/ou intenção** do elemento que representam, sem exigir que o leitor consulte sua implementação.

Regras:

- Nomear pela responsabilidade/intenção, não pela aparência.
- Evitar nomes genéricos quando eles escondem a intenção (`Container`, `Wrapper`, `Item`, `Data`, etc.).
- Evitar nomes baseados em detalhes de implementação (`FlexContainer`, etc.).
- Evitar abreviações desnecessárias.
- O nome deve continuar válido caso a implementação visual seja alterada.
- Não utilizar comentários para compensar um nome ruim; primeiro melhorar o nome.

## 6. Props e injeção de dependência

- Props devem ser explicitamente tipadas.
- Passar somente os dados que o componente realmente precisa.
- Evitar passar um objeto de domínio inteiro quando apenas uma parte dele é necessária.
- Comportamentos e dependências externas devem ser injetados, em vez de descobertos/criados dentro dos componentes de apresentação.
- Evitar `any`.

Exemplo:

```tsx
<UserCard
  name={user.name}
  avatar={user.avatar}
  onSelect={handleSelect}
/>
```

## 7. Estado

### Estado de negócio/compartilhado

**Zustand é a fonte da verdade para o estado de negócio/aplicação.**

- Componentes de apresentação não devem consumir Zustand diretamente.
- O acesso da UI ao Zustand é mediado por um Hook elegível.
- Atoms, Molecules e Organisms não devem consumir Hooks do Zustand diretamente.
- Eles recebem os dados e ações necessários por props ou injeção de dependência.
- Pages são a camada de governança que coordena o estado e injeta o necessário na árvore de apresentação.

Fluxo de integração:

```text
Page / Hook elegível
        ↓
     Zustand
        ↓
     Service
        ↓
    API / Endpoint
```

Um Service pode se comunicar diretamente com Zustand quando a operação exigir isso, mas um Service nunca deve se comunicar diretamente com as camadas de apresentação/UI.

### Estado local de UI

Estado exclusivamente de UI deve permanecer no menor componente capaz de governá-lo.

Exemplos: visibilidade de modal, aba selecionada, expansão de accordion e estado temporário de input.

Usar mecanismos locais do React, como `useState` ou `useReducer`, para esse estado por padrão. Não transformar estado de UI em estado global no Zustand sem uma necessidade real de compartilhamento.

## 8. Hooks

- Todo Hook possui **responsabilidade única**.
- Todo Hook deve executar **uma única operação coerente**; não deve acumular operações diferentes apenas porque pertencem ao mesmo domínio.
- Hooks podem compor outros Hooks sem absorver as responsabilidades deles.
- Hooks são organizados por domínio/responsabilidade, não por camada do Atomic Design.
- Hooks específicos de domínio ficam em subpastas do domínio.
- Hooks realmente genéricos podem ficar diretamente em `hooks/`.

Exemplo:

```text
hooks/
├── auth/
│   ├── useAuth.ts
│   └── usePermissions.ts
├── orders/
│   ├── useOrders.ts
│   ├── useCreateOrder.ts
│   └── useCancelOrder.ts
└── useDebounce.ts
```

## 9. Services

Um Service é responsável pela comunicação com fontes externas de dados ou infraestrutura.

- Services podem se comunicar diretamente com Zustand.
- Services se comunicam com APIs/endpoints através do mecanismo de integração apropriado.
- Services nunca se comunicam diretamente com as camadas de apresentação/UI.
- Services não renderizam UI.
- Services não possuem lógica de apresentação.
- Um Service deve possuir responsabilidade única e representar uma única operação coerente.

Relações diretas proibidas:

```text
Service → Atom
Service → Molecule
Service → Organism
Service → Template
Service → Page
```

## 10. Princípio arquitetural central

O agente deve **implementar respeitando estas regras**, e não tratá-las como uma checklist de auditoria executada somente depois da implementação.

As regras críticas devem, quando possível, ser posteriormente protegidas por enforcement mecânico (lint, AST, hooks, etc.), em vez de depender exclusivamente de instruções em uma Skill.
