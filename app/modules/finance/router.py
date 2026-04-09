from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from .models import Expense
from .schemas import ExpenseCreate, ExpenseResponse, ExpenseListResponse
from app.modules.appointments.models import Appointment

router = APIRouter(
    tags=["Finance"],
)


#creating an expense
@router.post("/expenses/", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate, db: AsyncSession = Depends(get_db)):
    new_expense = Expense(**expense.dict())
    db.add(new_expense)
    await db.commit()
    await db.refresh(new_expense)
    return new_expense


#the statsics of the expenses
@router.get("/expenses/", response_model=ExpenseListResponse)
async def stats(db: AsyncSession = Depends(get_db)):
    #the revenue is calculated from the paiment amount in the appointments table
    todays_revenue = select(Appointment).where(Appointment.date == datetime.utcnow().date()).with_only_columns([Appointment.payment_amount]).scalar() or 0
    total_revenue = select(Appointment).with_only_columns([Appointment.payment_amount]).scalar() or 0
    todays_expenses = select(Expense).where(Expense.date == datetime.utcnow().date()).with_only_columns([Expense.amount]).scalar() or 0
    total_expenses = select(Expense).with_only_columns([Expense.amount]).scalar() or 0
    todays_profit = (todays_revenue - todays_expenses) 
    total_profit = (total_revenue - total_expenses)

    return {
        "todays_revenue": todays_revenue,
        "total_revenue": total_revenue,
        "todays_expenses": todays_expenses,
        "total_expenses": total_expenses,
        "todays_profit": todays_profit,
        "total_profit": total_profit,
    }


#monthly overview of the expenses and revenue 
@router.get("/overview/")
async def monthly_overview(db: AsyncSession = Depends(get_db)):
    
    revenue = select(Appointment).where(Appointment.date >= datetime.utcnow().date() - timedelta(days=30)).with_only_columns([Appointment.payment_amount]).scalar() or 0
    expenses = select(Expense).where(Expense.date >= datetime.utcnow().date() - timedelta(days=30)).with_only_columns([Expense.amount]).scalar() or 0


    return {
        "revenue": revenue,
        "expenses": expenses,
    }


#displaying all the expenses by category for a 30 day period
@router.get("/expenses/category/")
async def expenses_by_category(db: AsyncSession = Depends(get_db)):
    
    categories = select(Expense.category).distinct().scalar() or []
    category_expenses = {}
    for category in categories:
        total = select(Expense).where(
            Expense.category == category,
            Expense.date >= datetime.utcnow().date() - timedelta(days=30)
        ).with_only_columns([Expense.amount]).scalar() or 0
        category_expenses[category] = total

    return category_expenses


#displaying the recent transactions (both expenses and revenue) for the last 3 days
@router.get("/transactions/recent/")
async def recent_transactions(db: AsyncSession = Depends(get_db)):
    recent_transactions ={ 
        "expenses": select(Expense).where(Expense.date >= datetime.utcnow().date() - timedelta(days=3)).all(),
        "appointments": select(Appointment).where(Appointment.date >= datetime.utcnow().date() - timedelta(days=3)).all()
    }

    return recent_transactions
