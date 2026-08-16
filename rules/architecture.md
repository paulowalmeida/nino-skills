# Regras de Arquitetura

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
- usar um Atom do Design System quando o DS já resolver o requisito;
- poder ser específico da aplicação quando o DS não possuir solução adequada.

**NÃO PODE:**
- importar ou compor Molecules, Organisms, Templates ou Pages;
- depender de outro componente da mesma camada;
- acessar Zustand, Services ou APIs;
- conter regra de negócio;
- ser criado apenas para agrupar outros Atoms;
- descobrir ou criar dependências externas por conta própria.

### Molecule

Uma Molecule combina dois ou mais Atoms em uma unidade funcional simples e coerente.

**DEVE:**
- representar uma responsabilidade funcional pequena;
- combinar Atoms do DS e/ou da aplicação;
- permanecer independente de Organisms, Templates e Pages;
- receber dados e comportamentos por props/injeção quando necessário.

**NÃO PODE:**
- depender de Organisms, Templates ou Pages;
- depender de outra Molecule da mesma camada;
- acessar diretamente Zustand, Services ou APIs;
- conter regra de negócio.

Uma combinação de Atoms só deve ser considerada Molecule quando formar uma unidade funcional/coerente; quantidade de Atoms, sozinha, não determina a camada.

### Organism

Um Organism é uma seção significativa da UI composta por Molecules e/ou Atoms.

**PODE:**
- usar Molecules e Atoms diretamente;
- pular a camada de Molecule quando isso fizer sentido;
- possuir estado e interação locais pertencentes à própria seção.

**NÃO PODE:**
- depender de outro Organism da mesma camada;
- depender de Templates ou Pages;
- acessar diretamente Zustand, Services ou APIs;
- conter regra de negócio;
- virar apenas um agrupamento arbitrário de Atoms.

Se um conjunto de Atoms formar uma unidade funcional coerente e reutilizável, deve ser extraído para uma Molecule.

### Template

Template é a camada responsável pela composição visual e estrutural de uma página.

**DEVE:**
- compor Organisms, Molecules e/ou Atoms;
- poder pular níveis inferiores quando isso fizer sentido;
- representar uma estrutura de página reutilizável, sem depender de uma rota concreta ou de dados concretos.

**NÃO PODE:**
- depender de outro Template da mesma camada;
- acessar diretamente Zustand, Services ou APIs;
- conter regra de negócio;
- assumir responsabilidades específicas de uma Page.

### Page

Page representa uma rota/contexto concreto da aplicação e é a **camada de governança da UI** daquela rota.

**DEVE:**
- coordenar contexto, estado, dados e dependências da página;
- utilizar um Template como sua única camada de composição visual;
- passar ao Template os dados, ações e dependências necessários.

**NÃO PODE:**
- importar, renderizar ou compor diretamente Organisms, Molecules ou Atoms;
- implementar a composição visual que pertence ao Template;
- transformar-se em um componente visual monolítico.

Exemplo:

```tsx
// ✅ Page → Template
return <UserTemplate user={user} onSelect={handleSelect} />
```

Proibido:

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
- conter regra de negócio específica de uma rota.

## Dependências entre camadas

A direção permitida da composição é para baixo:

```text
Page → Template → Organism → Molecule → Atom
```

Regras:

- uma camada nunca depende de outra unidade da mesma camada;
- uma camada superior pode pular camadas inferiores quando isso for arquiteturalmente coerente;
- uma camada superior não deve usar um salto de camada para evitar uma composição que deveria existir na camada intermediária;
- componentes não podem depender de uma camada arquitetural superior.

## Reutilização antes de criação

Antes de criar qualquer novo componente:

1. procurar no Design System;
2. procurar componentes existentes no app;
3. avaliar reutilização direta;
4. avaliar composição de componentes existentes;
5. criar algo novo somente quando não houver solução adequada.

Criar um componente semanticamente duplicado quando uma solução adequada já existe é proibido.

## Princípio de implementação

Estas regras são **restrições de implementação**, não apenas critérios de auditoria. O agente deve tomar decisões de arquitetura obedecendo-as desde o início da tarefa.

Quando uma regra puder ser verificada mecanicamente, ela deve ser protegida por enforcement automático em vez de depender apenas da interpretação do modelo.
