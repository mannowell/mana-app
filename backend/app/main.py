"""
Mannobot FastAPI Backend
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import json
import yaml

from app.database import get_db, engine, Base
from app import models, schemas, routes
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

openapi_schema: dict = {}

try:
    with open(os.path.join(os.path.dirname(__file__), "..", "..", "openapi.yaml"), "r") as f:
        openapi_schema = yaml.safe_load(f) or {}
except Exception:
    openapi_schema = {}

app = FastAPI(
    title="Mannobot API",
    description="AI WhatsApp Assistant for Small Businesses",
    version="0.1.0",
    servers=[{"url": "https://mana.mannotech.duckdns.org/api", "description": "Production API"}],
)


@app.get("/openapi.json", include_in_schema=False)
def get_openapi_schema():
    return openapi_schema or {
        "openapi": "3.0.3",
        "info": {"title": "Mannobot API", "version": "0.1.0"},
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "mannobot", "version": "0.1.0"}

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(routes.appointments.router, prefix="/api/v1/appointments", tags=["appointments"])
app.include_router(routes.scheduler.router, prefix="/api/v1/scheduler", tags=["scheduler"])
app.include_router(routes.transactions.router, prefix="/api/v1/transactions", tags=["transactions"])
app.include_router(routes.finance.router, prefix="/api/v1/finance", tags=["finance"])
app.include_router(routes.reminders.router, prefix="/api/v1/reminders", tags=["reminders"])
app.include_router(routes.webhooks.router, prefix="/api/v1/webhooks", tags=["webhooks"])
