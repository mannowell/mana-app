"""
Finance routes — AI categorization and cash flow insights
"""

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models, schemas
from app.services import ai

router = APIRouter()


@router.post("/categorize", response_model=schemas.CategorizeResponse)
async def categorize(request: schemas.CategorizeRequest):
    """AI categorize a transaction."""
    try:
        result = await ai.categorize_transaction(request.description, request.amount)
        return schemas.CategorizeResponse(
            category=result.get("category", "outros"),
            suggestion=result.get("insight", ""),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI categorization failed: {str(e)}")


@router.get("/insights", response_model=schemas.CashFlowInsight)
async def get_insights(db: Session = Depends(get_db)):
    """Get AI-generated cash flow insights."""
    # Aggregate data
    income = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.amount > 0
    ).scalar() or 0

    expenses = db.query(func.sum(func.abs(models.Transaction.amount))).filter(
        models.Transaction.amount < 0
    ).scalar() or 0

    # Category breakdown
    categories = {}
    txs = db.query(models.Transaction).all()
    for tx in txs:
        cat = tx.category or "outros"
        categories[cat] = categories.get(cat, 0) + abs(tx.amount)

    # Get AI insight
    try:
        insight = await ai.generate_cashflow_insight(income, expenses, categories)
    except Exception:
        insight = "Add more transactions to get AI insights."

    return schemas.CashFlowInsight(
        total_income=income,
        total_expenses=expenses,
        net_cashflow=income - expenses,
        top_categories=categories,
        insight=insight,
    )
