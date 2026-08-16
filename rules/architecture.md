# Regras de Arquitetura

Este arquivo define **restrições obrigatórias de implementação**. Não são recomendações e não são apenas critérios de revisão.

Quando uma regra deste arquivo se aplicar, o agente **DEVE** obedecê-la.

A ausência de uma permissão explícita **NÃO autoriza uma exceção**.

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

Um Atom é a menor unidade de UI com uma responsabilidade própria e única.

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

**Antes de criar um Atom, o agente DEVE:**

1. pesquisar o Design System;
2. pesquisar Atoms existentes no app;
3. verificar se o requisito realmente é atômico;
4. verificar se um componente existente pode ser reutilizado ou composto;
5. criar o Atom somente se nenhuma solução adequada já existir.

### Molecule

Uma Molecule combina Atoms em uma unidade funcional simples, coerente e com responsabilidade única.

**DEVE:**
- representar uma responsabilidade funcional pequena e única;
- combinar Atoms do DS e/ou da aplicação;
- receber dados e comportamentos por props/injeção quando necessário.

**NÃO PODE:**
- importar ou renderizar Organisms, Templates ou Pages;
- importar ou renderizar outra Molecule;
- acessar Zustand diretamente, Hooks de estado, Services ou APIs;
- conter regra de negócio.

Uma combinação de Atoms **SÓ DEVE ser classificada como Molecule quando formar uma unidade funcional/coerente**. A quantidade de Atoms, sozinha, **NÃO determina a camada**.

### Organism

Um Organism é uma seção significativa da UI composta por Molecules e/ou Atoms.

**PODE:**
- usar Molecules e Atoms diretamente;
- pular a camada de Molecule quando não existir uma unidade funcional de Molecule a representar;
- possuir estado e interação locais pertencentes à própria seção.

**NÃO PODE:**
- importar ou renderizar outro Organism;
- importar ou renderizar Templates ou Pages;
- acessar Zustand diretamente, Hooks de estado, Services ou APIs;
- conter regra de negócio;
- existir apenas como agrupamento arbitrário de Atoms.

Se um conjunto de Atoms formar uma unidade funcional coerente e reutilizável, ele **DEVE** ser extraído para uma Molecule.

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
- implementar composição visual que pertence ao Template;
- transformar-se em componente visual monolítico;
- escolher manualmente componentes visuais abaixo de Template;
- renderizar múltiplos Templates como alternativa para substituir a composição de um Template adequado.

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
- implementar composição visual específica de uma Page;
- importar e escolher manualmente qual Page está ativa;
- conter regra de negócio específica de uma rota;
- depender de detalhes internos de uma Page específica.

## Matriz de dependências

As únicas dependências de composição de UI permitidas são:

```text
Page       → Template
Template   → Organism | Molecule | Atom
Organism   → Molecule | Atom
Molecule   → Atom
Atom       → nenhuma camada de UI
Layout     → Page
```

Qualquer dependência de UI fora dessa matriz é **PROIBIDA**.

Em particular:

```text
Page      → Organism   ❌
Page      → Molecule   ❌
Page      → Atom       ❌
Template  → Template   ❌
Organism  → Organism   ❌
Molecule  → Molecule   ❌
Atom      → Atom       ❌
Molecule  → Organism   ❌
Organism  → Template   ❌
Atom      → Molecule   ❌
```

## Reutilização antes de criação

Antes de criar qualquer novo componente, o agente **DEVE executar esta sequência**:

1. procurar no Design System;
2. procurar componentes existentes no app;
3. identificar componentes com responsabilidade equivalente ou próxima;
4. verificar a API e o contrato do candidato;
5. avaliar reutilização direta;
6. avaliar composição dos componentes existentes;
7. só então criar algo novo se nenhuma solução existente atender ao requisito.

Criar um componente semanticamente duplicado quando uma solução adequada já existe é **PROIBIDO**.

## Regra de decisão antes de escrever TSX

Antes de escrever um novo TSX, o agente **DEVE conseguir responder**:

1. Qual é a responsabilidade deste componente?
2. Qual é sua camada no Atomic Design?
3. Qual é o caminho de dependência permitido para essa camada?
4. Quais componentes existentes foram avaliados?
5. Qual solução do Design System foi avaliada?
6. Por que uma nova unidade é necessária?

Se qualquer resposta necessária não puder ser determinada com segurança, o agente **NÃO DEVE inventar uma solução**. Deve continuar investigando ou reportar a ambiguidade.

## Regra de classificação

A camada deve ser determinada pela **responsabilidade do componente**, não pela conveniência de implementação.

É **PROIBIDO** escolher uma camada apenas para permitir uma importação que seria proibida na camada correta.

Exemplo:

```text
"Preciso de um componente que só poderia importar Organism."
            ↓
NÃO é permitido elevar o componente artificialmente só para liberar o import.
```

## Regra de não contorno

O agente **NÃO PODE**:

- criar um componente intermediário vazio apenas para satisfazer a hierarquia;
- mover lógica para outra camada apenas para contornar uma restrição de importação;
- renomear um componente para fingir que ele pertence a outra camada;
- criar uma abstração artificial para evitar uma regra;
- usar imports indiretos para acessar uma camada proibida.

## Princípio de implementação

Estas regras governam a criação e edição do código desde o início da tarefa.

Elas **NÃO devem ser tratadas como checklist para auditoria posterior**.

Quando uma regra puder ser verificada mecanicamente, ela **DEVE** ser protegida por enforcement automático.
