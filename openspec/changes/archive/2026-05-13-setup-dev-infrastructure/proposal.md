## Why

A plataforma precisava de ferramentas para gerenciar mudanças de forma estruturada e rastreável ao longo do desenvolvimento, além de corrigir uma configuração desnecessária que desabilitava a otimização de imagens do Next.js.

## What Changes

- Adicionado `@fission-ai/openspec` como dependência de desenvolvimento para gerenciamento de mudanças com fluxo `propose → apply → archive`
- Criados skills e slash commands do Claude Code para o workflow OpenSpec (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`, `/opsx:explore`)
- Criado diretório `openspec/` com configuração inicial do projeto
- Removida a opção `images.unoptimized: true` do `next.config.ts`, reativando a otimização nativa de imagens do Next.js

## Capabilities

### New Capabilities

- `change-management`: Gerenciamento estruturado de mudanças via OpenSpec com artefatos (proposal, design, specs, tasks) e fluxo rastreável de implementação

### Modified Capabilities

_(nenhuma)_

## Impact

- **Dependências**: adicionado `@fission-ai/openspec ^1.3.1` ao `package.json` e `pnpm-workspace.yaml`
- **Config**: `next.config.ts` — remoção de `images.unoptimized` melhora performance de carregamento de imagens em produção
- **Tooling**: `.claude/` com skills e commands do OpenSpec disponíveis para todos os desenvolvedores do projeto
- **Processo**: todas as futuras mudanças podem ser documentadas e rastreadas via `openspec/changes/`
