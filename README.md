# MANA App — AI WhatsApp Assistant MVP

Stack: FastAPI (backend) + React/Vite/Tailwind (frontend) + PostgreSQL + WAHA/Evolution + OpenRouter (free models). Deploy: Docker Compose local. Produção: Traefik + Let's Encrypt em `mana.mannotech.duckdns.org`. CI: GitHub Actions. Deploy: Dokploy.

## Repositório

`https://github.com/mannowell/mana-app` (owner: mannowell)

## Estrutura

```
mana-app/
├── backend/          # FastAPI
│   ├── app/          # Rotas, schemas, services, models
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # React + Vite + Tailwind
│   ├── src/          # Páginas, components, API client
│   ├── package.json
│   └── Dockerfile
├── ops/
├── .github/workflows/ci.yml
├── docker-compose.yml
└── openapi.yaml
```

## Rodar localmente

Clone e suba os serviços:

```bash
git clone https://github.com/mannowell/mana-app.git
cd mana-app
cp .env.example .env   # ajustar chaves
docker compose up --build
```

Serviços:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs

## Variáveis de ambiente (backend)

- `DATABASE_URL`: Postgres, ex: `postgresql://mannobot:senha@db:5432/mannobot`
- `OPENROUTER_API_KEY`: chave OpenRouter (mantida em segredo)
- `WAHA_URL`: `http://waha:3000`
- `WAHA_API_KEY`: chave Evolution/WAHA
- `WAHA_SESSION_NAME`: `mannobot`
- `SECRET_KEY`: chave JWT/sessão

## Deploy produção (Traefik)

O `docker-compose.yml` já inclui labels do Traefik para roteamento e TLS:

- `mana.mannotech.duckdns.org` → frontend
- `mana.mannotech.duckdns.org/api` → backend

Certificado via Let's Encrypt usando certresolver `letsencrypt` (configurado no Traefik do host).

Para atualizar produção sem downtime, replique o compose no host/Dokploy.

## CI (GitHub Actions)

Workflow `.github/workflows/ci.yml`:

1. Lint + build/test em PR/push para `main`
2. Build e push das imagens para `ghcr.io` no push de `main`
   - Tags: `:${{ github.sha }}` e `:latest`

Para usar as imagens em produção, substitua a seção `build:` no `docker-compose.yml` por `image:` apontando para o `ghcr.io`.

## Checklist de produção

- [ ] DNS `mana.mannotech.duckdns.org` apontando para o host Traefik
- [ ] Traefik com network externa acessível aos containers do compose
- [ ] Entrypoints/certresolver `letsencrypt` configurados no Traefik
- [ ] Secrets configurados no painel do Dokploy/GitHub
- [ ] Volume `pgdata` persistido no host

## Time

- **Sam** — DevOps
- **Leo** — Backend + AI
- **Mia** — Frontend
- **Alex** — QA