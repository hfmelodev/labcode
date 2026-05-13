## Context

O projeto LabCode não possuía um processo formal para documentar, revisar e rastrear mudanças ao longo do desenvolvimento. Mudanças eram implementadas diretamente sem artefatos de proposta, design ou especificação, dificultando o entendimento do histórico e da motivação por trás de cada decisão.

Além disso, o `next.config.ts` tinha `images.unoptimized: true`, o que desativava a otimização automática de imagens do Next.js e degradava a performance em produção.

## Goals / Non-Goals

**Goals:**
- Estabelecer fluxo estruturado de gerenciamento de mudanças com OpenSpec
- Integrar o workflow ao Claude Code via skills e slash commands
- Reativar otimização de imagens do Next.js

**Non-Goals:**
- Migrar mudanças passadas para o OpenSpec (apenas mudanças futuras)
- Configurar CI/CD para validar artefatos OpenSpec automaticamente

## Decisions

### 1. OpenSpec como ferramenta de change management

**Decisão**: Usar `@fission-ai/openspec` com o schema `spec-driven`.

**Rationale**: O schema `spec-driven` força criação de proposal → design → specs → tasks em ordem de dependência, garantindo que implementações sejam precedidas por documentação de requisitos e decisões técnicas.

**Alternativas consideradas**:
- ADRs (Architecture Decision Records) manuais: mais simples, mas sem fluxo de implementação integrado
- Notion/Linear para specs: fora do repositório, dificulta rastreabilidade com o código

### 2. Integração via Claude Code skills

**Decisão**: Criar skills em `.claude/skills/` e commands em `.claude/commands/opsx/`.

**Rationale**: Permite invocar o workflow diretamente no Claude Code com `/opsx:propose`, sem precisar lembrar comandos CLI do OpenSpec. O Claude fica responsável por criar os artefatos com conteúdo relevante.

### 3. Remoção de `images.unoptimized`

**Decisão**: Remover a opção, voltando ao comportamento padrão do Next.js.

**Rationale**: A opção foi adicionada como workaround temporário e não havia mais necessidade. O Next.js Image Optimization melhora LCP e reduz bandwidth via formatos modernos (WebP/AVIF) e lazy loading automático.

## Risks / Trade-offs

- [Overhead de documentação] → Mitigação: o Claude Code automatiza a criação dos artefatos via skills, reduzindo o esforço manual
- [Imagens podem quebrar se dependiam do comportamento unoptimized] → Mitigação: verificar componentes `<Image>` que usam URLs externas sem domínios configurados em `next.config.ts`

## Migration Plan

1. Instalar `@fission-ai/openspec` via `pnpm add -D` ✅
2. Inicializar com `pnpm exec openspec init` ✅
3. Criar skills e commands no `.claude/` ✅
4. Remover `images.unoptimized` do `next.config.ts` ✅
5. Commitar e fazer push para o repositório ✅

Rollback: reverter o commit que removeu `images.unoptimized` se houver regressões de imagens em produção.

## Open Questions

_(nenhuma — todas as decisões foram tomadas e implementadas)_
