from datetime import date, datetime, timedelta
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.modules.appointments.models import Appointment
from .models import Expense
from .schemas import ExpenseCreate, ExpenseResponse, ExpenseListResponse

router = APIRouter(tags=["finance"])


def _normalize_expense_date_string(raw: str) -> str:
    """Store/compare as YYYY-MM-DD prefix for ISO-like strings."""
    if not raw:
        return date.today().isoformat()
    return raw.split("T")[0][:10]


@router.post("/expenses/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseCreate, db: AsyncSession = Depends(get_db)):
    data = expense.dict()
    data["amount"] = int(round(data["amount"]))
    data["date"] = _normalize_expense_date_string(data.get("date") or "")
    new_expense = Expense(**data)
    db.add(new_expense)
    await db.commit()
    await db.refresh(new_expense)
    return new_expense


@router.get("/expenses/", response_model=ExpenseListResponse)
async def expense_stats(db: AsyncSession = Depends(get_db)):
    """
    Expense totals and profit calculations including revenue from appointments.
    """
    today = date.today().isoformat()

    todays_expenses = (
        await db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0)).where(Expense.date.like(f"{today}%"))
        )
    ).scalar_one()

    total_expenses = (await db.execute(select(func.coalesce(func.sum(Expense.amount), 0)))).scalar_one()

    # Calculate revenue from appointments
    todays_revenue = (
        await db.execute(
            select(func.coalesce(func.sum(Appointment.payment_amount), 0)).where(Appointment.time.like(f"{today}%"))
        )
    ).scalar_one()

    total_revenue = (await db.execute(select(func.coalesce(func.sum(Appointment.payment_amount), 0)))).scalar_one()

    return ExpenseListResponse(
        todays_revenue=float(todays_revenue or 0),
        total_revenue=float(total_revenue or 0),
        todays_expenses=float(todays_expenses or 0),
        total_expenses=float(total_expenses or 0),
        todays_profit=float((todays_revenue or 0) - (todays_expenses or 0)),
        total_profit=float((total_revenue or 0) - (total_expenses or 0)),
    )


@router.get("/overview/")
async def monthly_overview(db: AsyncSession = Depends(get_db)) -> Dict[str, float]:
    cutoff = (date.today() - timedelta(days=30)).isoformat()
    expenses = (
        await db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0)).where(Expense.date >= cutoff)
        )
    ).scalar_one()
    revenue = (
        await db.execute(
            select(func.coalesce(func.sum(Appointment.payment_amount), 0)).where(Appointment.time >= cutoff)
        )
    ).scalar_one()
    return {"revenue": float(revenue or 0), "expenses": float(expenses or 0)}


@router.get("/expenses/category/")
async def expenses_by_category(db: AsyncSession = Depends(get_db)) -> Dict[str, float]:
    cutoff = (date.today() - timedelta(days=30)).isoformat()
    cat_result = await db.execute(select(Expense.category).distinct())
    categories = [row[0] for row in cat_result.all() if row[0]]

    out: Dict[str, float] = {}
    for category in categories:
        total = (
            await db.execute(
                select(func.coalesce(func.sum(Expense.amount), 0)).where(
                    Expense.category == category,
                    Expense.date >= cutoff,
                )
            )
        ).scalar_one()
        out[category] = float(total or 0)
    return out


def _expense_to_dict(e: Expense) -> Dict[str, Any]:
    return {
        "id": e.id,
        "category": e.category,
        "amount": e.amount,
        "description": e.description,
        "date": e.date,
    }


@router.get("/transactions/recent/")
async def recent_transactions(db: AsyncSession = Depends(get_db)) -> Dict[str, List[Any]]:
    cutoff = (date.today() - timedelta(days=3)).isoformat()
    exp_result = await db.execute(
        select(Expense).where(Expense.date >= cutoff).order_by(Expense.date.desc())
    )
    expenses = [_expense_to_dict(e) for e in exp_result.scalars().all()]

    # Appointments use string `time`; include rows whose time starts with today or previous 3 calendar dates
    day_prefixes = [(date.today() - timedelta(days=i)).isoformat() for i in range(4)]
    appt_result = await db.execute(
        select(Appointment).where(or_(*[Appointment.time.like(f"{p}%") for p in day_prefixes]))
    )
    appointments = [
        {
            "id": a.id,
            "patient_id": a.patient_id,
            "time": a.time,
            "duration": a.duration,
            "type": a.type,
        }
        for a in appt_result.scalars().all()
    ]

    return {"expenses": expenses, "appointments": appointments}
