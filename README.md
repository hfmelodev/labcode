<div align="center">
  <img src="./public/labcode-icon.svg" alt="LabCode" width="96" height="96" />

  <h1>LabCode</h1>

  <p><strong>Plataforma completa de cursos online (LMS)</strong> — área do aluno, painel administrativo, player de vídeo, pagamentos, ranking e muito mais.</p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
    <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
    <img alt="Clerk" src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" />
  </p>
</div>

---

## 📖 Sobre o projeto

O **LabCode** é uma **LMS (Learning Management System)** — uma plataforma de ensino onde alunos compram e assistem cursos em vídeo, acompanham o próprio progresso, comentam as aulas e competem por posições em um ranking, enquanto administradores gerenciam todo o catálogo, usuários e conteúdos por um painel dedicado.

O projeto foi construído com o stack mais atual do ecossistema React/Next.js, com foco em performance, tipagem ponta a ponta e uma experiência de uso fluida tanto para o aluno quanto para o administrador.

---

## ✨ Funcionalidades

### 🎓 Área do aluno
- **Catálogo de cursos** com busca, filtros e tags
- **Página de detalhes** do curso com descrição rica (rich-text)
- **Player de vídeo** profissional para as aulas (Vidstack)
- **Organização em módulos e aulas** com navegação fluida
- **Progresso de conclusão** — marca aulas concluídas e acompanha o avanço
- **Comentários nas aulas** com respostas aninhadas (threads)
- **Meus cursos** — acesso rápido aos cursos adquiridos
- **Ranking** de alunos para gamificar o aprendizado
- **Notificações** in-app
- **Tema claro/escuro**

### 🛠️ Painel administrativo
- **Gestão de cursos** — criação e edição com editor rich-text e upload de thumbnail
- **Módulos e aulas** com reordenação por **drag-and-drop**
- **Status de publicação** (rascunho / publicado) e nível de dificuldade
- **Gestão de usuários**
- **Moderação de comentários**
- **Tabelas com paginação, ordenação e busca**

### ⚙️ Plataforma
- **Autenticação** completa via Clerk (com webhooks de sincronização)
- **Pagamentos** integrados via **Asaas** (com webhooks de confirmação)
- **Upload de arquivos** em nuvem (**Cloudflare R2**, compatível com S3)
- **Cron jobs** para envio/limpeza de notificações
- **Validação de dados** ponta a ponta com Zod

---

## 🖼️ Screenshots

> 💡 As imagens abaixo são carregadas de `docs/screenshots/`. Basta adicionar os arquivos com os nomes indicados que eles aparecem automaticamente.

### Home / Catálogo de cursos
![Catálogo de cursos](./docs/screenshots/home.png)

### Detalhes do curso
![Detalhes do curso](./docs/screenshots/course-details.png)

### Player de aula
![Player de aula](./docs/screenshots/lesson-player.png)

### Ranking
![Ranking](./docs/screenshots/ranking.png)

### Painel administrativo — Cursos
![Admin - Cursos](./docs/screenshots/admin-courses.png)

### Painel administrativo — Editor de curso
![Admin - Editor de curso](./docs/screenshots/admin-course-edit.png)

---

## 🧰 Stack & tecnologias

| Camada | Tecnologias |
| --- | --- |
| **Framework** | Next.js 16 (App Router) · React 19 · React Compiler |
| **Linguagem** | TypeScript |
| **Banco de dados** | PostgreSQL · Prisma ORM 7 |
| **Autenticação** | Clerk |
| **Pagamentos** | Asaas |
| **Storage** | Cloudflare R2 (AWS S3 SDK) |
| **Estilização** | Tailwind CSS 4 · shadcn/ui · Radix UI · Lucide |
| **Estado & dados** | TanStack Query · Zustand |
| **Formulários** | React Hook Form · Zod |
| **Editor & mídia** | Tiptap (rich-text) · Vidstack (player) |
| **UI/UX** | TanStack Table · Recharts · @hello-pangea/dnd · Sonner |
| **Tooling** | Biome · Turbopack · pnpm |

---

## 🗂️ Estrutura do projeto

```
labcode/
├── prisma/
│   ├── schema.prisma          # Modelos: User, Course, Module, Lesson, Comment, Purchase...
│   ├── migrations/            # Migrações do banco
│   ├── seed.ts                # Seed de cursos de exemplo
│   └── sample-courses.json
├── public/
│   ├── labcode-icon.svg
│   └── sample-courses/        # Thumbnails dos cursos de exemplo
├── src/
│   └── app/
│       ├── (with-layout)/
│       │   ├── courses/       # Catálogo, detalhes e player de aulas
│       │   ├── my-courses/    # Cursos do aluno
│       │   ├── ranking/       # Ranking de alunos
│       │   ├── admin/         # Painel: courses, users, comments
│       │   ├── _actions/      # Server Actions
│       │   └── _components/   # Componentes de página e compartilhados
│       ├── api/
│       │   ├── webhooks/      # clerk, asaas
│       │   └── cron/          # notifications
│       └── auth/              # Fluxo de autenticação
└── docs/screenshots/          # Imagens do README
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- Banco **PostgreSQL** acessível
- Contas/credenciais: **Clerk**, **Asaas** e **Cloudflare R2**

### 1. Clone o repositório
```bash
git clone git@github.com:hfmelodev/labcode.git
cd labcode
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz (veja a tabela abaixo):

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/labcode"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Asaas (pagamentos)
ASAAS_API_URL="https://api-sandbox.asaas.com/v3"
ASAAS_API_KEY="..."
ASAAS_WEBHOOK_TOKEN="..."

# Cloudflare R2 (storage)
CLOUDFLARE_ACCOUNT_ID="..."
CLOUDFLARE_ACCESS_ID="..."
CLOUDFLARE_ACCESS_KEY="..."
CLOUDFLARE_R2_BUCKET="..."
CLOUDFLARE_FILE_BASE_PATH="..."

# Cron
CRON_SECRET="..."
DAYS_TO_KEEP="30"
```

### 4. Prepare o banco de dados
```bash
pnpm prisma migrate dev     # aplica as migrações
pnpm prisma generate        # gera o client
pnpm tsx prisma/seed.ts     # (opcional) popula cursos de exemplo
```

### 5. Inicie o servidor de desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em **http://localhost:25800** 🚀

---

## 🔐 Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Chave pública do Clerk |
| `CLERK_SECRET_KEY` | Chave secreta do Clerk |
| `CLERK_WEBHOOK_SECRET` | Segredo do webhook do Clerk (sync de usuários) |
| `ASAAS_API_URL` | URL base da API do Asaas |
| `ASAAS_API_KEY` | Chave de API do Asaas |
| `ASAAS_WEBHOOK_TOKEN` | Token de validação do webhook do Asaas |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare |
| `CLOUDFLARE_ACCESS_ID` | Access Key ID do R2 |
| `CLOUDFLARE_ACCESS_KEY` | Secret Access Key do R2 |
| `CLOUDFLARE_R2_BUCKET` | Nome do bucket R2 |
| `CLOUDFLARE_FILE_BASE_PATH` | URL pública base dos arquivos |
| `CRON_SECRET` | Segredo para autenticar as rotas de cron |
| `DAYS_TO_KEEP` | Dias de retenção das notificações |

---

## 📜 Scripts

| Script | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento (Turbopack, porta 25800) |
| `pnpm build` | Aplica migrações e faz o build de produção |
| `pnpm start` | Inicia o servidor de produção (porta 25800) |
| `pnpm format` | Formata e corrige o código com Biome |
| `pnpm format:check` | Verifica formatação sem alterar arquivos |
| `pnpm prisma:generate` | Gera o Prisma Client |

---

## 👨‍💻 Autor

Desenvolvido com 💜 por **Hilquias Ferreira Melo**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/hfmelodev)

---

<div align="center">
  <sub>⭐ Se este projeto te ajudou ou te inspirou, deixe uma estrela no repositório!</sub>
</div>
