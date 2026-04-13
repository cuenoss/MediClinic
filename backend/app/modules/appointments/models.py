from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime

    

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    time=Column(String, nullable=False)
    duration=Column(Integer, nullable=False)
    type=Column(String, nullable=False)
    payment_amount = Column(Integer, nullable=True, default=0)

    # Foreign key relationship with the patient table
    patient = relationship("Patient", back_populates="appointments")    