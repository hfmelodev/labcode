## ADDED Requirements

### Requirement: Desenvolvedor pode propor uma mudança estruturada

O sistema SHALL permitir que o desenvolvedor crie uma mudança com artefatos (proposal, design, specs, tasks) via comando `pnpm exec openspec new change "<name>"`, com os artefatos gerados em sequência de dependência.

#### Scenario: Criação de nova mudança

- **WHEN** o desenvolvedor executa `/opsx:propose` com uma descrição
- **THEN** o Claude Code cria o diretório `openspec/changes/<name>/` com `.openspec.yaml` e gera `proposal.md`, `design.md`, `specs/` e `tasks.md` em ordem de dependência

#### Scenario: Consulta de status da mudança

- **WHEN** o desenvolvedor executa `pnpm exec openspec status --change "<name>"`
- **THEN** o sistema exibe quais artefatos estão prontos, bloqueados ou concluídos

### Requirement: Desenvolvedor pode implementar tarefas de uma mudança

O sistema SHALL permitir que o desenvolvedor implemente as tarefas definidas em `tasks.md` via `/opsx:apply`, com rastreamento de progresso.

#### Scenario: Início de implementação

- **WHEN** o desenvolvedor executa `/opsx:apply` após todos os artefatos estarem criados
- **THEN** o Claude Code lê `tasks.md` e executa as tarefas em sequência, marcando cada uma como concluída

### Requirement: Desenvolvedor pode arquivar uma mudança concluída

O sistema SHALL permitir arquivar uma mudança implementada via `/opsx:archive`, consolidando os artefatos no histórico do projeto.

#### Scenario: Arquivamento de mudança

- **WHEN** o desenvolvedor executa `/opsx:archive` após implementação completa
- **THEN** o OpenSpec consolida os specs do change em `openspec/specs/` e marca a mudança como arquivada

### Requirement: Imagens são otimizadas automaticamente pelo Next.js

O sistema SHALL utilizar a otimização nativa de imagens do Next.js (sem `unoptimized: true`), servindo imagens em formatos modernos (WebP/AVIF) com lazy loading automático.

#### Scenario: Carregamento de imagem em produção

- **WHEN** um componente `<Image>` renderiza uma imagem
- **THEN** o Next.js serve a imagem otimizada no formato mais eficiente suportado pelo browser, com dimensões adequadas ao viewport
