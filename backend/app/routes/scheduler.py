"""
Scheduler route — NLP parsing for appointments
"""

from fastapi import APIRouter, HTTPException
from app import schemas
from app.services import ai

router = APIRouter()


@router.post("/parse", response_model=schemas.ScheduleParseResponse)
async def parse_schedule(request: schemas.ScheduleParseRequest):
    """Parse natural language into appointment data."""
    try:
        result = await ai.parse_schedule_request(request.text)
        return schemas.ScheduleParseResponse(
            title=result.get("title", "Untitled"),
            customer_name=result.get("customer_name"),
            appointment_time=result.get("appointment_time"),
            confidence=result.get("confidence", 0.5),
            raw_parsed=result,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI parsing failed: {str(e)}")
