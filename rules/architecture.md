# Regras de Arquitetura

Este arquivo define **restrições de implementação**. Não são recomendações nem critérios opcionais de revisão.

Quando uma regra deste arquivo se aplicar, o agente **DEVE** obedecê-la. A ausência de uma permissão explícita **NÃO autoriza** a criação de uma exceção.

## Atomic Design

A UI segue esta hierarquia:

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

`Layout` é uma responsabilidade estrutural da aplicação e fica fora da hierarquia do Atomic Design.

### Atom

Um Atom é a menor unidade de UI com responsabilidade própria.

**DEVE:**
- representar uma responsabilidade visual/funcional única;
- ser independente de negócio e infraestrutura;
- receber dados e comportamentos por props/injeção quando necessário;
- reutilizar um Atom do Design System quando o DS já resolver o requisito;
- poder ser específico da aplicação quando o DS não possuir solução adequada.

**NÃO PODE:**
- importar ou renderizar Molecules, Organisms, Templates ou Pages;
- importar ou renderizar outro Atom da aplicação;
- acessar Zustand, Hooks de estado, Services ou APIs;
- conter regra de negócio;
- ser criado apenas para agrupar outros Atoms;
- descobrir, criar ou buscar dependências externas por conta própria.

**Antes de criar um Atom:**

1. procurar no Design System;
2. procurar Atoms existentes no app;
3. verificar se o requisito realmente é atômico;
4. criar o Atom somente se não houver solução adequada.

### Molecule

Uma Molecule combina Atoms em uma unidade funcional simples e coerente.

**DEVE:**
- representar uma responsabilidade funcional pequena e única;
- combinar Atoms do DS e/ou da aplicação;
- receber dados e comportamentos por props/injeção quando necessário.

**NÃO PODE:**
- importar ou renderizar Organisms, Templates ou Pages;
- importar ou renderizar outra Molecule;
- acessar Zustand diretamente, Hooks de estado, Services ou APIs;
- conter regra de negócio.

Uma combinação de Atoms **só é uma Molecule quando forma uma unidade funcional/coerente**. A quantidade de Atoms, sozinha, não determina a camada.

### Organism

Um Organism é uma seção significativa da UI composta por Molecules e/ou Atoms.

**PODE:**
- usar Molecules e Atoms diretamente;
- pular a camada de Molecule quando não houver uma unidade funcional de Molecule a representar;
- possuir estado e interação locais pertencentes à própria seção.

**NÃO PODE:**
- importar ou renderizar outro Organism;
- importar ou renderizar Templates ou Pages;
- acessar Zustand diretamente, Hooks de estado, Services ou APIs;
- conter regra de negócio;
- existir apenas como um agrupamento arbitrário de Atoms.

Se um conjunto de Atoms formar uma unidade funcional coerente e reutilizável, **DEVE** ser extraído para uma Molecule.

### Template

Template é a camada responsável pela composição visual e estrutural de uma página.

**DEVE:**
- compor Organisms, Molecules e/ou Atoms;
- poder pular níveis inferiores quando isso for necessário para representar corretamente a estrutura;
- representar uma estrutura de página reutilizável, sem depender de rota concreta ou dados concretos.

**NÃO PODE:**
- importar ou renderizar outro Template;
- acessar Zustand diretamente, Hooks de estado, Services ou APIs;
- conter regra de negócio;
- assumir responsabilidades específicas de uma Page;
- decidir qual rota concreta está ativa.

### Page

Page representa uma rota/contexto concreto da aplicação e é a **camada de governança da UI** daquela rota.

**DEVE:**
- coordenar contexto, estado, dados e dependências da página;
- utilizar **exatamente um Template como sua camada de composição visual**;
- passar ao Template os dados, ações e dependências necessários.

**NÃO PODE:**
- importar, renderizar ou compor diretamente Organisms, Molecules ou Atoms;
- implementar a composição visual que pertence ao Template;
- transformar-se em um componente visual monolítico;
- escolher manualmente componentes visuais abaixo de Template.

**Permitido:**

```tsx
// ✅ Page → Template
return <UserTemplate user={user} onSelect={handleSelect} />
```

**Proibido:**

```tsx
// ❌ Page → Organism
return <UserProfile user={user} />
```

```tsx
// ❌ Page → Molecule
return <UserSearch />
```

```tsx
// ❌ Page → Atom
return <Button onClick={handleClick}>Salvar</Button>
```

## Layout

Layout é uma camada estrutural externa ao Atomic Design.

**DEVE:**
- fornecer o chrome persistente da aplicação;
- envolver Pages;
- controlar estrutura compartilhada como header, sidebar, navegação e áreas persistentes;
- usar o mecanismo de composição de rota da aplicação para renderizar a Page ativa.

**NÃO PODE:**
- implementar a composição visual específica de uma Page;
- importar e escolher manualmente qual Page está ativa;
- conter regra de negócio específica de uma rota;
- depender de detalhes internos de uma Page específica.

## Dependências entre camadas

A direção permitida da composição é para baixo:

```text
Page → Template → Organism → Molecule → Atom
```

Regras obrigatórias:

- uma camada **NUNCA** depende de outra unidade da mesma camada;
- uma camada superior pode pular camadas inferiores somente quando a composição continuar semanticamente correta;
- pular uma camada **NÃO pode** ser usado para evitar a criação de uma unidade intermediária que deveria existir;
- componentes **NÃO PODEM** depender de uma camada arquitetural superior;
- Page **NÃO PODE** pular Template;
- Template **PODE** pular Organism/Molecule quando isso for necessário para representar a estrutura;
- Organism **PODE** pular Molecule quando não existir uma unidade funcional de Molecule;
- Molecule **NÃO PODE** pular para Organism/Template/Page;
- Atom **NÃO PODE** consumir qualquer camada superior.

## Reutilização antes de criação

Antes de criar qualquer novo componente, o agente **DEVE** executar esta sequência:

1. procurar no Design System;
2. procurar componentes existentes no app;
3. identificar componentes com responsabilidade equivalente ou próxima;
4. avaliar reutilização direta;
5. avaliar composição de componentes existentes;
6. criar algo novo somente se nenhuma solução existente atender ao requisito.

Criar um componente semanticamente duplicado quando uma solução adequada já existe é **PROIBIDO**.

## Regra de decisão

Antes de escrever um novo TSX, o agente **DEVE** conseguir responder:

1. Qual é a responsabilidade deste componente?
2. Qual é sua camada no Atomic Design?
3. Quais componentes existentes foram avaliados?
4. Qual solução do Design System foi avaliada?
5. Quais dependências são permitidas para essa camada?
6. Por que uma nova unidade é necessária?

Se essas respostas não puderem ser determinadas com segurança, o agente **NÃO DEVE inventar uma solução**; deve continuar a investigação ou reportar a ambiguidade.

## Princípio de implementação

Estas regras governam a criação e edição do código desde o início da tarefa. Elas não devem ser tratadas como checklist para uma auditoria posterior.

Quando uma regra puder ser verificada mecanicamente, ela **DEVE** ser protegida por enforcement automático em vez de depender apenas da interpretação do modelo.
