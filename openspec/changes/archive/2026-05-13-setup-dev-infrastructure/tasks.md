## 1. Instalar e configurar OpenSpec

- [x] 1.1 Adicionar `@fission-ai/openspec` ao `package.json` como dependência
- [x] 1.2 Adicionar `@fission-ai/openspec` à lista `onlyBuiltDependencies` do `pnpm-workspace.yaml`
- [x] 1.3 Executar `pnpm exec openspec init --tools claude --profile core` para inicializar o projeto
- [x] 1.4 Verificar que o diretório `openspec/` foi criado com `config.yaml`

## 2. Integrar workflow ao Claude Code

- [x] 2.1 Criar skill `openspec-propose` em `.claude/skills/openspec-propose/SKILL.md`
- [x] 2.2 Criar skill `openspec-apply-change` em `.claude/skills/openspec-apply-change/SKILL.md`
- [x] 2.3 Criar skill `openspec-archive-change` em `.claude/skills/openspec-archive-change/SKILL.md`
- [x] 2.4 Criar skill `openspec-explore` em `.claude/skills/openspec-explore/SKILL.md`
- [x] 2.5 Criar slash commands em `.claude/commands/opsx/` (propose, apply, archive, explore)

## 3. Corrigir configuração do Next.js

- [x] 3.1 Remover bloco `images: { unoptimized: true }` do `next.config.ts`
- [x] 3.2 Verificar que nenhum componente `<Image>` depende de domínios externos não configurados

## 4. Commitar e publicar

- [x] 4.1 Fazer `git add` nos arquivos modificados e nos novos diretórios `.claude/` e `openspec/`
- [x] 4.2 Criar commit com mensagem descritiva
- [x] 4.3 Fazer `git push origin main`
