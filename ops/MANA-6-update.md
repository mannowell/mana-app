# MANA-6 Update — API Contracts and Integration

Owner: Alex (Evan Boss)
Priority: high
Status: blocked (WAHA not running on host)

## Progress (done in this run)

- Created `openapi.yaml` as API contract source of truth
- Backend now serves schema at `GET /openapi.json`
- Shared types in `frontend/src/types/api.ts` aligned with backend Pydantic schemas
- Added `frontend/src/api/client.ts` API client with auth header injection
- Added `backend/app/services/waha.py` for send/reply/session management
- Wired `/api/webhooks/waha` to respond via OpenRouter + WAHA when API key is configured
- Added `WAHA_SESSION_NAME` to config defaults
- Added pyyaml requirement for schema loading
- `docker-compose.yml`:
  - Added `restart: unless-stopped` to backend/frontend/db
  - Added compose healthchecks for db, backend, frontend
  - Made WAHA_URL/WAHA_API_KEY/WAHA_SESSION_NAME configurable via env
- Updated `README.md` with contract map and deployment rules

## OpenAPI Coverage

Auth: register/login
Appointments: CRUD
Scheduler: parse endpoint (future)
Transactions + Finance
Reminders
Webhooks: /api/webhooks/waha (AI responder wired)

## Blocker

- WAHA container not running on host now
  - Prevents testing WhatsApp end-to-end
  - Unblock action: start WAHA (session `mannobot`, key from env), reachable at built-in host address
  - Once up, backend `/api/webhooks/waha` will reply to inbound messages with AI

## Verification

- Contracts are now explicit (openapi.yaml)
- Frontend types exist for current backend schemas
- Code changes static-clean (lint ok for .py files)
- Docker-compose changes are additive; no containers destroyed/recreated

## Next Steps

1. Unblock: start WAHA with admin/Manno2026! (if not already) and set `WAHA_URL`/`WAHA_API_KEY` in backend env
2. Bring up compose: `docker compose -f mana-app/docker-compose.yml up -d --build`
3. Instant integration: inbound WAHA messages trigger AI reply via OpenRouter
4. Frontend: wire Dashboard to `/health` and auth endpoints
5. Code review: Leo review backend routes + MIa review frontend pages
6. Deploy orchestration: Sam reviews compose + Traefik labels
