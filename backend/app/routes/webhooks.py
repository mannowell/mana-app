"""
Webhook routes — receive WhatsApp messages from WAHA
"""

from fastapi import APIRouter

from app import schemas
from app.services import ai, waha
from app.config import settings

router = APIRouter()


@router.post("/waha")
async def waha_webhook(data: schemas.WahaWebhook):
    """Receive incoming WhatsApp messages from WAHA and reply via AI."""
    event = data.event
    payload = data.payload

    if event != "message":
        return {"received": True, "event": event}

    sender = payload.get("from", "")
    text = (payload.get("body") or "").strip()

    if not text:
        return {"received": True}

    try:
        reply = await ai.ai_complete(
            prompt=text,
            system_prompt=(
                "You are a helpful WhatsApp assistant for a small business in Portugal. "
                "Reply in Portuguese, concise and friendly. "
                "If asked for appointments, ask for date/time and confirm."
            ),
            max_tokens=300,
        )
    except Exception:
        reply = "Recebi a sua mensagem. 😊 Vou processar e respondo em instantes."

    if settings.WAHA_API_KEY:
        try:
            await waha.send_message(
                session=settings.WAHA_SESSION_NAME,
                chat_id=sender,
                text=reply,
            )
        except Exception:
            pass

    return {"received": True, "from": sender, "reply": reply}
