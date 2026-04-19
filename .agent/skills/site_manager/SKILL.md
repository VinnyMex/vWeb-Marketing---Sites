---
name: site-manager
description: Administrador mestre para criação, gerenciamento e publicação de sites de clientes.
---

# Site Manager Master Ability

Você é o mestre de criação de sites. Use esta habilidade para automatizar o ciclo de vida dos projetos dos clientes dentro da pasta `_sites`.

## Fluxos de Trabalho

### 1. Criar Novo Site (`create site <nome>`)
**Objetivo:** Inicializar um novo projeto de forma limpa e organizada.
- **Pasta:** Criar em `f:\Antigravity\vWeb Marketing - Sites\_sites\<nome>`.
- **Framework:** Next.js (padrão) via `npx create-next-app@latest .`.
- **Configuração:** 
    - Adicionar um `README.md` personalizado.
    - **Contexto:** Copiar `_templates/CLIENT_CONTEXT_TEMPLATE.md` para `_sites/<nome>/CLIENT_CONTEXT.md` e solicitar/preencher os dados do cliente.
- **Assets:** Sugerir o uso das skills `image-ai-generator` e `template-designer` para o visual inicial.

### 2. Editar Site Existente (`edit site <nome>`)
**Objetivo:** Realizar alterações mantendo a consistência da marca.
- **Ação:** O usuário pede mudanças (ex: "mude o CTA", "ajuste as cores").
- **Regra de Ouro:** O agente **deve** carregar o conteúdo de `_sites/<nome>/CLIENT_CONTEXT.md` para sua memória de trabalho antes de propor soluções.
- **Consistência:** Garantir que novas seções sigam o Design System e o Tom de Voz definidos.

### 3. Publicar no GitHub (`publish github <nome>`)
**Objetivo:** Criar um repositório remoto e sincronizar.
- **Repositório:** Usar `github-mcp-server` tool `create_repository`.
- **Nome:** Sugerir `sites-<nome-do-cliente>`.
- **Git:** 
    1. `git init` na pasta do site.
    2. `git add .`, `git commit -m "Initial commit"`.
    3. `git remote add origin <url-do-mcp>`.
    4. `git push -u origin main`.

### 4. Deploy na Vercel (`deploy vercel <nome>`)
**Objetivo:** Colocar o site no ar.
- **Comando:** Usar a CLI da Vercel (`vercel link` e `vercel deploy --prod`).
- **Feedback:** Retornar a URL final para o usuário.

## Regras de Ouro
- Nunca misture arquivos de sites de clientes diferentes.
- Sempre verifique se a pasta `_sites` existe antes de criar.
- Use o arquivo `mcp-config.md` para recuperar os tokens de acesso necessários.
- Cada site deve ter seu próprio `.gitignore` para não subir `node_modules`.
- **IA First:** Todo site deve ser "IA-Editable", mantendo o `CLIENT_CONTEXT.md` atualizado.

## Ferramentas MCP Relacionadas
- **GitHub:** Para versionamento individual.
- **Supabase:** Caso o usuário solicite um banco de dados para o site.
- **n8n:** Para automações de formulários ou notificações.
- **Perplexity:** Para pesquisas de tendências de design e copy.
