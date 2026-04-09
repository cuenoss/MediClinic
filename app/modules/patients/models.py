from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime
from modules.appointments.models import Consultation

class gender_enum:
    MALE = "male"
    FEMALE = "female"


class Patient(Base):
  __tablename__ = "patients"

  id = Column(Integer, primary_key=True, index=True)
  first_name = Column(String, nullable=False)
  last_name = Column(String, nullable=False)
  gender = Column(gender_enum, nullable=False)
  email = Column(String, nullable=False)
  phone = Column(String, nullable=False)
  address = Column(String, nullable=False)
  date_of_birth = Column(Date, nullable=False)
  last_visit = Column(Date, nullable=True)
  status = Column(String, nullable=False, default="active")
  created_at = Column(Date, nullable=False)
  updated_at = Column(Date, nullable=False)
  blood_type=Column(String, nullable=False)
  allergies=Column(String, nullable=True)
  chronic_conditions=Column(String, nullable=True)
  relationship_status=Column(String, nullable=True)
  emergency_contact_name=Column(String, nullable=True)
  emergency_contact_phone=Column(String, nullable=True)

  consultations = relationship("Consultation", back_populates="patient")



class attached_files(Base):
  __tablename__ = "attached_files"

  id = Column(Integer, primary_key=True, index=True)
  patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)  
  file_name = Column(String, nullable=False)
  file_path = Column(String, nullable=False)
  created_at = Column(Date, nullable=False)

