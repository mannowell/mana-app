"""
AI Service — OpenRouter integration
"""

import httpx
import json
from app.config import settings


async def ai_complete(prompt: str, system_prompt: str = "", max_tokens: int = 500) -> str:
    """Call OpenRouter API with free model."""
    if not settings.OPENROUTER_API_KEY:
        return "AI not configured — set OPENROUTER_API_KEY"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.OPENROUTER_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": max_tokens,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def parse_schedule_request(text: str) -> dict:
    """Parse natural language scheduling request into structured data."""
    system = """You are a scheduling assistant for a small business. Extract appointment details from natural language.
Return JSON with: title, customer_name, appointment_time (ISO format), confidence (0-1).
If time is relative (e.g. "sexta às 15h"), interpret it relative to today (2026-06-29).
Example: {"title": "corte de cabelo", "customer_name": "João", "appointment_time": "2026-07-03T15:00:00", "confidence": 0.9}"""

    result = await ai_complete(text, system_prompt=system, max_tokens=200)
    try:
        # Try to extract JSON from response
        start = result.index("{")
        end = result.rindex("}") + 1
        return json.loads(result[start:end])
    except (ValueError, json.JSONDecodeError):
        return {"title": text, "customer_name": None, "appointment_time": None, "confidence": 0.3}


async def categorize_transaction(description: str, amount: float) -> dict:
    """AI categorize a transaction and provide insight."""
    system = """You are a financial assistant. Categorize this transaction and give a brief insight.
Categories: alimentação, transporte, serviços, produtos, aluguel, utilities, marketing, outros.
Return JSON: {"category": "...", "insight": "..."}"""

    prompt = f"Transaction: {description}, Amount: {amount}"
    result = await ai_complete(prompt, system_prompt=system, max_tokens=150)
    try:
        start = result.index("{")
        end = result.rindex("}") + 1
        return json.loads(result[start:end])
    except (ValueError, json.JSONDecodeError):
        return {"category": "outros", "insight": "Unable to categorize"}


async def generate_cashflow_insight(income: float, expenses: float, categories: dict) -> str:
    """Generate AI insight about cash flow."""
    system = """You are a financial advisor for small businesses. Give one actionable insight about this cash flow situation. Be concise (1-2 sentences)."""
    prompt = f"Income: €{income}, Expenses: €{expenses}, Net: €{income-expenses}. Top categories: {categories}"
    return await ai_complete(prompt, system_prompt=system, max_tokens=100)
