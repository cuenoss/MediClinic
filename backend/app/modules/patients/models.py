from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime




class Patient(Base):
  __tablename__ = "patients"

  id = Column(Integer, primary_key=True, index=True)
  full_name = Column(String, nullable=False)
  gender = Column(String, nullable=True)
  email = Column(String, nullable=True)
  phone = Column(String, nullable=False)
  address = Column(String, nullable=True)
  weight = Column(Integer, nullable=True)
  height = Column(Integer, nullable=True)
  date_of_birth = Column(Date, nullable=True)
  last_visit = Column(Date, nullable=True)
  created_at = Column(Date, nullable=False)
  updated_at = Column(Date, nullable=False)
  next_appointment = Column(Date, nullable=True)
  blood_type = Column(String, nullable=True)
  allergies = Column(String, nullable=True)
  chronic_conditions = Column(String, nullable=True)
  relationship_status = Column(String, nullable=True)
  emergency_contact_name = Column(String, nullable=True)
  emergency_contact_phone = Column(String, nullable=True)

  appointments = relationship("Appointment", back_populates="patient")
  consultations = relationship("Consultation", back_populates="patient")


class Consultation(Base):
  __tablename__ = "consultations"

  id = Column(Integer, primary_key=True, index=True)
  patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
  doctor_id = Column(Integer, nullable=True)
  date = Column(DateTime, nullable=False)
  notes = Column(Text, nullable=True)
  main_complaint = Column(Text, nullable=True)
  problem_history = Column(Text, nullable=True)
  current_medications = Column(Text, nullable=True)
  symptoms_checklist = Column(Text, nullable=True)
  medical_history = Column(Text, nullable=True)
  family_medical_history = Column(Text, nullable=True)
  diagnosis = Column(Text, nullable=True)

  patient = relationship("Patient", back_populates="consultations")


class attached_files(Base):
  __tablename__ = "attached_files"

  id = Column(Integer, primary_key=True, index=True)
  patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)  
  file_name = Column(String, nullable=False)
  file_path = Column(String, nullable=False)
  file_type=Column(String, nullable=False)
  created_at = Column(Date, nullable=False)



