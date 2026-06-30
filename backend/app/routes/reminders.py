"""
Reminder routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.ReminderOut])
def list_reminders(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return db.query(models.Reminder).offset(skip).limit(limit).all()


@router.post("/", response_model=schemas.ReminderOut)
def create_reminder(
    reminder: schemas.ReminderCreate, db: Session = Depends(get_db)
):
    db_rem = models.Reminder(**reminder.model_dump())
    db.add(db_rem)
    db.commit()
    db.refresh(db_rem)
    return db_rem


@router.post("/{reminder_id}/send")
def mark_sent(reminder_id: int, db: Session = Depends(get_db)):
    rem = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    from datetime import datetime
    rem.status = "sent"
    rem.sent_at = datetime.utcnow()
    db.commit()
    return {"sent": True}
