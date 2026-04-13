from typing import Optional

from pydantic import BaseModel


class Expense(BaseModel):
    id: int
    amount: float
    category: str
    date: str
    description: Optional[str] = None


class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: str = ""
    description: Optional[str] = None


class ExpenseResponse(Expense):
    model_config = {"from_attributes": True}


class ExpenseListResponse(BaseModel):
    todays_revenue: float
    total_revenue: float
    todays_expenses: float
    total_expenses: float
    todays_profit: float
    total_profit: float