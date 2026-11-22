# 📚 LendoMais — Operação Nuvem Literária

Plataforma web de catálogo e votação de livros conteinerizada com **Docker**, automatizada via pipeline **CI/CD no GitHub Actions** e hospedada em nuvem no **Render**.

---

## 🔗 Links da Entrega

* **Repositório GitHub:** [github.com/lngg21/LendoMais](https://github.com/lngg21/LendoMais)
* **Frontend (Render):** [lendomais-frontend-latest-1q5v.onrender.com](https://lendomais-frontend-latest-1q5v.onrender.com)
* **Backend API (Render):** [lendomais-backend-latest-d2di.onrender.com](https://lendomais-backend-latest-d2di.onrender.com)
* **Imagem Docker — Frontend:** [hub.docker.com/r/arthurmoraes21/lendomais-frontend](https://hub.docker.com/r/arthurmoraes21/lendomais-frontend)
* **Imagem Docker — Backend:** [hub.docker.com/r/arthurmoraes21/lendomais-backend](https://hub.docker.com/r/arthurmoraes21/lendomais-backend)

---

## 🏗️ Arquitetura e Stack Tecnológica

* **Frontend:** React + Vite empacotado em build multi-stage (`node:20-alpine` $\rightarrow$ `nginx:alpine`) com suporte a roteamento SPA (`try_files $uri $uri/ /index.html`).
* **Backend:** API REST em Node.js (`node:20-alpine` rodando com usuário não-root `node`), conectada a banco relacional PostgreSQL gerenciado no Render via `DATABASE_URL` com SSL.
* **CI/CD (GitHub Actions):** Esteira automatizada executando verificação de sintaxe/lint, auditoria de dependências (`npm audit`), análise estática de segurança (SAST com Semgrep) e build/push contínuo das imagens para o Docker Hub.

---

## 🛠️ Principais Desafios Técnicos Enfrentados

O maior desafio técnico durante a migração do ambiente local para a nuvem no Render envolveu a integração entre o Frontend e a API Backend — especificamente o comportamento de bloqueio de requisições cross-origin (CORS) aliado à injeção de variáveis de ambiente em aplicações Vite conteinerizadas. Como o Vite incorpora variáveis prefixadas com `VITE_` estaticamente durante a etapa de compilação (`npm run build`), a ausência do valor de `VITE_API_URL` no momento do `docker build` dentro da esteira de CI/CD fazia com que o bundle gerado em produção continuasse apontando para o fallback `http://localhost:3001/api`, resultando em falhas de conexão e bloqueios de CORS no navegador. A solução consistiu em injetar a URL pública da API via `--build-arg VITE_API_URL` no `Dockerfile` multi-stage antes da compilação, sanitizar a montagem da `baseURL` com o prefixo `/api` no serviço HTTP do React e restringir a política de `CORS_ORIGIN` no servidor Node.js para aceitar exclusivamente o domínio público do Frontend no Render, além de adaptar a conexão do PostgreSQL para utilizar `DATABASE_URL` com SSL e escutar na interface `0.0.0.0` exigida pelos contêineres da plataforma.