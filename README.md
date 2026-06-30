# Mannobot — AI WhatsApp Assistant for Small Businesses

Mannotech MVP: FastAPI backend + React frontend + WAHA + OpenRouter (free models).

## API Contract

- OpenAPI schema: `openapi.yaml` (source of truth)
- Backend exposes it at `GET /openapi.json`
- Frontend types mirror the schema in `frontend/src/types/api.ts`

- Frontend API client: `frontend/src/api/client.ts`

## Project Structure

```
mana-app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   │       ├── ai.py
│   │       └── waha.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/client.ts
│   │   ├── types/api.ts
│   │   ├── pages/
│   │   └── components/
│   └── ...
├── openapi.yaml
├── docker-compose.yml
└── README.md
```

## Environment (backend)

```
OPENROUTER_API_KEY=
WAHA_URL=http://waha:3000
WAHA_API_KEY=
WAHA_SESSION_NAME=mannobot
SECRET_KEY=change-me-in-production
```
## Deployment

- Domain: mana.mannotech.duckdns.org (Traefik + Let’s Encrypt)
- Backend router: `Host(mana.mannotech.duckdns.org) && PathPrefix(/api)`
- compose healthchecks: db (pg_isready), backend (/health), frontend (HTTP 200 on /)

## Team

- **Sam** — DevOps
- **Leo** — Backend + AI integration  
- **Mia** — Frontend + UX  
- **Alex** — API contracts + integration
