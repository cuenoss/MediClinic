from sqlalchemy import Column, Integer, String
from app.db import Base
from datetime import datetime

category = ["clinic rent", "nurse salary", "electricity", "water", "internet", "medical material", "maintenance", "paper", "receipts", "office supplies"] 
class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    amount = Column(Integer)
    description = Column(String, nullable=True)
    date = Column(String, default=datetime.utcnow().isoformat())