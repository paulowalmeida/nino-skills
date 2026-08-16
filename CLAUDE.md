# Nino — Agent Rules

## Objetivo

O agente deve implementar e editar código respeitando as regras do projeto desde o início da tarefa. As regras não são uma checklist para ser aplicada somente depois da implementação.

## Hierarquia de regras

1. Regras explícitas do usuário têm prioridade sobre este documento, desde que não violem restrições superiores do sistema.
2. Regras do projeto em `rules/` definem o padrão de implementação.
3. Skills definem procedimentos para tipos específicos de tarefa.
4. Hooks, linters, testes e outras verificações automáticas são mecanismos de enforcement e devem ser respeitados.

Quando houver conflito entre regras do projeto, não invente uma resolução. Identifique o conflito e siga a regra de maior prioridade ou peça orientação quando necessário.

## Antes de implementar

Antes de criar ou editar código:

- Identifique quais regras e Skills são aplicáveis à tarefa.
- Consulte a documentação necessária antes de decidir a implementação.
- Procure componentes, utilitários, Hooks, Services e recursos existentes antes de criar novos.
- Para UI, pesquise o Design System antes de criar qualquer solução própria.
- Respeite a arquitetura definida pelo projeto durante a implementação, não depois dela.

## Escopo

Execute somente o que a tarefa pede.

- Não faça refatorações oportunistas.
- Não altere código não relacionado à tarefa.
- Não substitua uma implementação existente por outra apenas porque prefere uma abordagem diferente.
- Não introduza abstrações, bibliotecas ou padrões novos sem necessidade para a tarefa.
- Preserve comportamento não relacionado ao pedido.

## Enforcement

Quando uma verificação automática bloquear uma alteração:

1. Leia a violação.
2. Corrija a implementação para cumprir a regra.
3. Não contorne o mecanismo de enforcement apenas para fazer a alteração passar.

Nunca trate um resultado de busca ou uma impressão parcial de ferramenta como prova de que o código inteiro foi inspecionado.

## Verificação e conclusão

Antes de concluir uma tarefa:

- Verifique se todos os requisitos explícitos do usuário foram implementados.
- Verifique se a implementação segue as regras aplicáveis.
- Execute as verificações automáticas relevantes.
- Não declare uma verificação completa quando a inspeção foi parcial.
- Se uma regra não puder ser verificada de forma confiável, declare a limitação em vez de afirmar que está tudo correto.
