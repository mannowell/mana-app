"""
Pydantic Schemas — request/validation models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# --- User / Auth ---

class UserCreate(BaseModel):
    email: str
    password: str
    business_name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    business_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str


# --- Appointment ---

class AppointmentCreate(BaseModel):
    title: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    appointment_time: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    title: str
    customer_name: Optional[str]
    customer_phone: Optional[str]
    appointment_time: datetime
    duration_minutes: int
    status: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Scheduler (NLP) ---

class ScheduleParseRequest(BaseModel):
    text: str  # "marcar corte de cabelo com João sexta às 15h"


class ScheduleParseResponse(BaseModel):
    title: str
    customer_name: Optional[str]
    appointment_time: Optional[datetime]
    confidence: float  # 0-1
    raw_parsed: dict


# --- Transaction ---

class TransactionCreate(BaseModel):
    amount: float
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None


class TransactionOut(BaseModel):
    id: int
    amount: float
    category: Optional[str]
    description: Optional[str]
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# --- Finance AI ---

class CategorizeRequest(BaseModel):
    description: str
    amount: float


class CategorizeResponse(BaseModel):
    category: str
    suggestion: str


class CashFlowInsight(BaseModel):
    total_income: float
    total_expenses: float
    net_cashflow: float
    top_categories: dict
    insight: str  # AI-generated insight


# --- Reminder ---

class ReminderCreate(BaseModel):
    message: str
    scheduled_time: datetime
    channel: str = "whatsapp"
    appointment_id: Optional[int] = None


class ReminderOut(BaseModel):
    id: int
    message: str
    scheduled_time: datetime
    channel: str
    status: str
    sent_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Webhook ---

class WahaWebhook(BaseModel):
    event: str
    payload: dict
