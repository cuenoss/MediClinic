from pydantic import BaseModel


class Expense(BaseModel):
  id: int
  amount: float
  category: str
  date: str
  description: str


class ExpenseCreate(BaseModel):
  amount: float
  category: str
  date: str
  description: str

class ExpenseResponse(Expense):
    class Config:
        orm_mode = True


class ExpenseListResponse(BaseModel):
    todays_revenue: float
    total_revenue: float
    todays_expenses: float
    total_expenses: float
    todays_profit: float
    total_profit: float