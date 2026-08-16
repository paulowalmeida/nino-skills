# Nino — Regras do Agente

## Objetivo

O agente deve **implementar e editar código já respeitando o padrão do projeto**. As regras abaixo são obrigatórias. Não são uma checklist para auditoria posterior.

## Hierarquia de autoridade

1. **Instruções explícitas do usuário** têm prioridade, desde que não violem regras superiores do sistema/plataforma.
2. `rules/` define as regras permanentes do projeto.
3. Skills definem procedimentos para tipos específicos de tarefa.
4. Hooks, linters, testes, AST checks e outras verificações automáticas são enforcement e não devem ser contornados.

Se duas regras do projeto entrarem em conflito e não houver uma prioridade definida, **não invente uma solução**. Identifique o conflito e pare a implementação até que ele possa ser resolvido.

## Antes de modificar código — obrigatório

Antes de qualquer `Write`, `Edit` ou criação de arquivo:

1. **Identifique as regras aplicáveis à tarefa e ao arquivo.**
2. **Leia essas regras antes de decidir a implementação.**
3. **Inspecione o código existente relevante.** Não presuma que uma solução ou componente não existe.
4. **Pesquise soluções existentes antes de criar algo novo.** Para UI, pesquise obrigatoriamente o Design System primeiro e depois os componentes existentes do app.
5. Determine a camada/responsabilidade correta antes de criar ou mover código.
6. Só então implemente.

Não comece a editar enquanto as etapas acima necessárias para a tarefa não tiverem sido cumpridas.

## Regras de implementação

- As regras arquiteturais devem ser obedecidas **durante** a implementação, não verificadas somente depois.
- Uma preferência pessoal do agente nunca supera uma regra do projeto.
- Não escolha uma implementação alternativa apenas porque parece mais simples, elegante ou rápida quando o padrão do projeto já define outra abordagem.
- Não invente componentes, APIs, padrões ou exceções para preencher lacunas de informação.
- Quando existir uma solução adequada já presente no projeto, reutilize-a ou componha-a em vez de duplicá-la.

## Escopo fechado

Faça **somente o que a tarefa solicita**.

- Não faça refatorações oportunistas.
- Não corrija problemas não relacionados.
- Não reorganize arquivos por preferência própria.
- Não renomeie coisas fora do escopo.
- Não introduza abstrações ou dependências novas sem necessidade para a tarefa.
- Preserve comportamento não relacionado ao pedido.

A ausência de uma solicitação explícita deve ser tratada como **proibição de alteração**, salvo quando uma alteração adicional for estritamente necessária para cumprir a tarefa.

## Enforcement

Quando um hook, lint, teste, AST check ou outra verificação bloquear uma alteração:

1. Leia exatamente a violação.
2. Corrija o código para cumprir a regra.
3. Tente novamente.
4. **Não contorne, desative ou enfraqueça o mecanismo de enforcement** para fazer a alteração passar.

Se uma regra automática parecer incorreta ou incompatível com a tarefa, não a ignore silenciosamente. Pare e reporte o conflito.

## Busca não é inspeção

Ferramentas de busca (`grep`, `rg`, `find`, buscas no editor etc.) são ferramentas de **localização**, não prova de inspeção completa.

- Não conclua que um arquivo, diretório ou arquitetura inteira foi verificado apenas porque uma busca não encontrou ocorrências.
- Não declare que "leu tudo", "auditou tudo" ou "não existem violações" quando a inspeção foi parcial.
- Quando a tarefa exigir cobertura completa, determine o conjunto completo de arquivos relevantes e inspecione cada um antes de concluir.

## Verificação antes de concluir

Antes de declarar a tarefa concluída, obrigatoriamente:

1. Verifique **cada requisito explícito do usuário**, individualmente.
2. Verifique as regras aplicáveis à implementação.
3. Execute as verificações automáticas relevantes.
4. Analise o resultado das verificações; não trate ausência de erro como prova de regras que não foram verificadas.
5. Se a verificação exigida não puder ser feita com confiança, **declare a limitação** e não afirme que está tudo correto.

## Proibições gerais

O agente **NÃO DEVE**:

- ignorar uma regra porque ela está em uma Skill/arquivo diferente;
- assumir que uma regra é opcional porque não existe enforcement automático para ela;
- substituir uma regra por uma preferência própria;
- afirmar que cumpriu uma exigência sem evidência suficiente;
- considerar uma implementação "boa o bastante" quando ela viola uma regra explícita;
- transformar uma exceção necessária para a tarefa em uma nova regra geral do projeto.

## Princípio final

**Quando houver duas opções e uma delas segue explicitamente o padrão do projeto, use a opção que segue o padrão. Quando não for possível determinar qual opção segue o padrão, não invente: investigue antes de editar.**
