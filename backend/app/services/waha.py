"""
WAHA Service — helpers for sending and receiving WhatsApp messages.
"""

from __future__ import annotations

import httpx
from typing import Any, Dict

from app.config import settings


async def send_message(session: str, chat_id: str, text: str) -> Dict[str, Any]:
    """
    Send a WhatsApp text message via WAHA.
    Requires WAHA_API_KEY and WAHA_URL configured.
    """
    if not settings.WAHA_API_KEY:
        raise RuntimeError("WAHA_API_KEY is not configured")

    url = f"{settings.WAHA_URL}/api/sendMessage"
    body = {"session": session, "chatId": chat_id, "text": text}

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers={
                "Authorization": f"Bearer {settings.WAHA_API_KEY}",
                "Content-Type": "application/json",
            },
            json=body,
            timeout=30.0,
        )
        response.raise_for_status()
        return response.json()


async def get_sessions() -> Dict[str, Any]:
    url = f"{settings.WAHA_URL}/api/sessions"
    headers: Dict[str, str] = {}
    if settings.WAHA_API_KEY:
        headers["Authorization"] = f"Bearer {settings.WAHA_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, timeout=30.0)
        response.raise_for_status()
        return response.json()


async def create_session(session_name: str) -> Dict[str, Any]:
    url = f"{settings.WAHA_URL}/api/sessions/create"
    body = {"name": session_name, "config": {"ignoreMessagesFromSelf": True, "debug": False}}
    headers: Dict[str, str] = {}
    if settings.WAHA_API_KEY:
        headers["Authorization"] = f"Bearer {settings.WAHA_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=body, timeout=30.0)
        response.raise_for_status()
        return response.json()
