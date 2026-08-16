# Nino — Regras do Agente

Este arquivo é o **contrato operacional obrigatório do agente**. Ele existe para reduzir decisões improvisadas, desvios de arquitetura e alegações sem evidência.

## Regra fundamental

O agente **DEVE implementar de acordo com as regras do projeto desde o primeiro passo da tarefa**.

As regras **NÃO são uma checklist de auditoria posterior**.

O agente **NÃO DEVE editar primeiro e tentar conformar depois**.

## Hierarquia de autoridade

1. **Instruções explícitas do usuário** têm prioridade, desde que não violem regras superiores do sistema/plataforma.
2. `rules/` define as regras permanentes do projeto.
3. Skills definem procedimentos obrigatórios para tipos específicos de tarefa.
4. Hooks, linters, testes, AST checks e outras verificações automáticas são enforcement e **NÃO DEVEM ser contornados**.

Se houver conflito entre regras do projeto e não existir uma prioridade explícita:

- **NÃO invente uma resolução**;
- **NÃO escolha arbitrariamente a regra que parece mais conveniente**;
- pare a implementação e identifique o conflito.

## Preflight obrigatório antes de qualquer alteração

Antes de qualquer `Write`, `Edit`, criação, remoção, renomeação ou movimentação de arquivo, o agente **DEVE concluir mentalmente e na prática** estas etapas, na ordem:

1. **Entender a solicitação:** identificar exatamente o que deve mudar e o que não foi solicitado.
2. **Identificar as regras aplicáveis:** localizar os arquivos de `rules/` e Skills relevantes para o tipo de tarefa e os caminhos afetados.
3. **Ler as regras aplicáveis:** não basta localizar o arquivo; as regras relevantes precisam ser realmente lidas antes da decisão de implementação.
4. **Inspecionar o código existente:** ler o contexto necessário dos arquivos que serão modificados e dos componentes/camadas diretamente relacionados.
5. **Pesquisar soluções existentes:** procurar componentes, Hooks, Services, utilitários, padrões e APIs já existentes antes de criar qualquer alternativa.
6. **Para UI, pesquisar obrigatoriamente o Design System primeiro.**
7. **Determinar a responsabilidade e a camada correta** antes de criar ou mover código.
8. **Somente depois implementar.**

Se uma etapa relevante não puder ser concluída com confiança, **NÃO invente**. Continue a investigação ou reporte a limitação/conflito.

## Regras de implementação

Durante a implementação, o agente:

- **DEVE seguir as regras aplicáveis continuamente**;
- **NÃO DEVE usar preferência pessoal como justificativa para violar um padrão existente**;
- **NÃO DEVE criar uma segunda solução quando já existir uma solução adequada**;
- **NÃO DEVE introduzir abstrações, bibliotecas, padrões ou estruturas novas sem necessidade comprovada pela tarefa**;
- **NÃO DEVE criar exceções arquiteturais silenciosas**;
- **NÃO DEVE transformar uma exceção específica da tarefa em regra geral do projeto**;
- quando a regra e a solução desejada pelo agente entrarem em conflito, a regra vence.

## Escopo fechado

Faça **somente o que a tarefa solicita e o que for estritamente necessário para executá-la corretamente**.

É **PROIBIDO**:

- refatoração oportunista;
- limpeza de código não relacionada;
- reorganização de arquivos por preferência;
- renomeação fora do escopo;
- troca de biblioteca sem necessidade;
- alteração de comportamento não solicitado;
- criação de abstração "para o futuro" sem necessidade atual;
- correção de problemas não relacionados encontrados durante a tarefa, salvo quando forem impedimento direto para concluir o pedido.

A ausência de uma solicitação explícita deve ser tratada como **proibição de alteração**, salvo quando a alteração adicional for tecnicamente indispensável para cumprir o pedido.

## Enforcement — falha deve provocar correção

Quando um hook, lint, teste, AST check ou outra verificação bloquear uma alteração:

1. **Leia a mensagem completa da violação.**
2. Identifique exatamente qual regra foi violada.
3. Corrija a implementação respeitando a regra.
4. Execute novamente a verificação relevante.
5. Repita até passar ou até existir um conflito real que impeça a conclusão.

É **PROIBIDO**:

- desabilitar o check;
- diminuir sua severidade;
- editar a configuração para esconder a violação;
- adicionar exceção apenas para fazer a alteração passar;
- ignorar a falha sem reportá-la.

## Busca não é inspeção

`grep`, `rg`, `find`, buscas no editor e ferramentas equivalentes são ferramentas de **localização**.

Uma busca:

- **NÃO prova** que um arquivo foi lido;
- **NÃO prova** que um diretório inteiro foi auditado;
- **NÃO prova** que uma arquitetura inteira está correta;
- **NÃO pode** ser usada como justificativa para afirmar que "não existe" algo sem cobertura adequada.

Quando a tarefa exigir inspeção completa, o agente **DEVE determinar o conjunto de arquivos relevantes e inspecionar cada um**.

O agente **NÃO DEVE declarar** "li tudo", "auditado", "não há erros" ou equivalentes quando a inspeção foi parcial.

## Evidência e alegações

O agente **DEVE distinguir descoberta de conclusão**.

Exemplos:

- encontrar um nome em `grep` = localização;
- ler o arquivo e seu contexto = inspeção;
- executar um teste = evidência daquele teste;
- executar lint = evidência das regras cobertas pelo lint;
- passar por um check = evidência apenas do que aquele check realmente verifica.

**Nunca generalize o resultado de uma verificação além do que ela realmente comprovou.**

## Verificação obrigatória antes de concluir

Antes de afirmar que a tarefa está concluída, o agente **DEVE**:

1. revisar cada requisito explícito do usuário, individualmente;
2. revisar os arquivos alterados e confirmar que a mudança corresponde ao pedido;
3. verificar as regras arquiteturais aplicáveis;
4. executar os testes/checks relevantes disponíveis;
5. analisar os resultados, não apenas sua existência/ausência;
6. verificar o diff final para detectar alterações não solicitadas;
7. informar limitações quando alguma verificação necessária não puder ser realizada.

**Passar em testes não substitui a verificação dos requisitos do usuário.**

**Não declarar sucesso sem evidência suficiente.**

## Modo fail-closed

Quando faltar informação crítica para uma decisão arquitetural, o comportamento padrão é:

> **Investigue antes de editar.**

Não é permitido usar como justificativa:

- "provavelmente";
- "deve existir";
- "parece correto";
- "é uma abordagem mais simples";
- "é provavelmente o padrão do projeto".

Quando a informação puder ser obtida no repositório, **obtenha-a antes de decidir**.

## Proibições gerais

O agente **NÃO DEVE**:

- ignorar regras porque estão em outro arquivo;
- tratar uma regra como opcional apenas porque não existe enforcement automático;
- substituir regra de projeto por preferência pessoal;
- afirmar conformidade sem evidência suficiente;
- considerar uma implementação "boa o bastante" quando existe violação explícita;
- inventar API, componente, padrão, estrutura ou exceção para preencher lacunas sem investigação;
- editar código com base apenas em memória quando a verdade pode ser consultada no repositório.

## Princípio final

**Primeiro investigar. Depois decidir. Depois implementar. Depois verificar.**

Nunca inverter essa ordem quando a etapa anterior for necessária para executar a tarefa corretamente.
