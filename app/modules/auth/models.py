from sqlalchemy import Column, Integer, String
from app.db import Base
from datetime import datetime

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


