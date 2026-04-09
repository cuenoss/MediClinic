from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import date, datetime
from typing import Optional, List

from app.db import get_db
from app.modules.patients.models import Patient
from app.modules.appointments.models import Appointment
from .schemas import (
    DashboardStatsResponse
)

router = APIRouter( tags=["Dashboard"])

# ===== API ENDPOINTS =====

# Main Dashboard Overview
@router.get("/overview")
async def get_dashboard_overview(
    doctor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get complete dashboard overview with all data"""
    #calculating the stats of the dashboard 
    total_patients = db.query(func.count(Patient.id)).scalar()
    today_appointments = db.query(func.count(Appointment.id)).filter(func.date(Appointment.date) == date.today()).scalar()
    consultations = db.query(func.count(Appointment.id)).scalar()
    
    stats = DashboardStatsResponse(
        total_patients=total_patients,
        today_appointments=today_appointments,
        consultations=consultations,
      )
    

    
    
    # Today's appointments (direct query)
    today = date.today()
    today_appointments_data = db.query(AppointmentSummary).filter(func.date(AppointmentSummary.appointment_date) == today).order_by(AppointmentSummary.appointment_time).all()
    today_appointments = [AppointmentSummaryResponse.from_orm(a) for a in today_appointments_data]
    
    # Recent patients (direct query)
    recent_patients_data = db.query(PatientSummary).order_by(desc(PatientSummary.last_visit_date)).limit(5).all()
    recent_patients = [PatientSummaryResponse.from_orm(p) for p in recent_patients_data]
    
    
    return DashboardOverview(
        stats=stats,
        today_appointments=today_appointments,
        recent_patients=recent_patients
    
    )





# # Appointments
# @router.get("/appointments/today", response_model=list[AppointmentSummaryResponse])
# async def get_today_appointments(db: Session = Depends(get_db)):
#     """Get today's appointments"""
#     today = date.today()
#     appointments = db.query(AppointmentSummary).filter(func.date(AppointmentSummary.appointment_date) == today).order_by(AppointmentSummary.appointment_time).all()
#     return [AppointmentSummaryResponse.from_orm(a) for a in appointments]

# @router.get("/appointments", response_model=list[AppointmentSummaryResponse])
# async def get_appointments(
#     patient_id: Optional[int] = Query(None),
#     start_date: Optional[date] = Query(None),
#     end_date: Optional[date] = Query(None),
#     status: Optional[str] = Query(None),
#     db: Session = Depends(get_db)
# ):
#     """Get appointments"""
#     query = db.query(AppointmentSummary)
    
#     if patient_id:
#         query = query.filter(AppointmentSummary.patient_id == patient_id)
#     if start_date:
#         query = query.filter(AppointmentSummary.appointment_date >= start_date)
#     if end_date:
#         query = query.filter(AppointmentSummary.appointment_date <= end_date)
#     if status:
#         query = query.filter(AppointmentSummary.status == status)
    
#     appointments = query.order_by(desc(AppointmentSummary.appointment_date)).all()
#     return [AppointmentSummaryResponse.from_orm(a) for a in appointments]

# @router.post("/appointments", response_model=AppointmentSummaryResponse)
# async def create_appointment(appointment_data: AppointmentSummaryCreate, db: Session = Depends(get_db)):
#     """Create appointment"""
#     appointment = AppointmentSummary(**appointment_data.dict())
#     db.add(appointment)
#     db.commit()
#     db.refresh(appointment)
#     return AppointmentSummaryResponse.from_orm(appointment)

# @router.put("/appointments/{appointment_id}", response_model=AppointmentSummaryResponse)
# async def update_appointment(appointment_id: int, appointment_data: dict, db: Session = Depends(get_db)):
#     """Update appointment"""
#     appointment = db.query(AppointmentSummary).filter(AppointmentSummary.id == appointment_id).first()
#     if not appointment:
#         raise HTTPException(status_code=404, detail="Appointment not found")
    
#     for field, value in appointment_data.items():
#         setattr(appointment, field, value)
    
#     db.commit()
#     db.refresh(appointment)
#     return AppointmentSummaryResponse.from_orm(appointment)

# @router.delete("/appointments/{appointment_id}")
# async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
#     """Delete appointment"""
#     appointment = db.query(AppointmentSummary).filter(AppointmentSummary.id == appointment_id).first()
#     if not appointment:
#         raise HTTPException(status_code=404, detail="Appointment not found")
    
#     db.delete(appointment)
#     db.commit()
#     return {"message": "Appointment deleted successfully"}

# # Patients
# @router.get("/patients/recent", response_model=list[PatientSummaryResponse])
# async def get_recent_patients(
#     limit: int = Query(10),
#     patient_status: Optional[str] = Query(None),
#     db: Session = Depends(get_db)
# ):
#     """Get recent patients"""
#     query = db.query(PatientSummary)
    
#     if patient_status:
#         query = query.filter(PatientSummary.status == patient_status)
    
#     patients = query.order_by(desc(PatientSummary.last_visit_date)).limit(limit).all()
#     return [PatientSummaryResponse.from_orm(p) for p in patients]

# @router.get("/patients/{patient_id}/summary", response_model=PatientSummaryResponse)
# async def get_patient_summary(patient_id: int, db: Session = Depends(get_db)):
#     """Get patient summary"""
#     summary = db.query(PatientSummary).filter(PatientSummary.patient_id == patient_id).first()
#     if not summary:
#         raise HTTPException(status_code=404, detail="Patient summary not found")
    
#     return PatientSummaryResponse.from_orm(summary)

# @router.post("/patients/summary", response_model=PatientSummaryResponse)
# async def create_patient_summary(summary_data, db: Session = Depends(get_db)):
#     """Create patient summary"""
#     summary = PatientSummary(**summary_data.dict())
#     db.add(summary)
#     db.commit()
#     db.refresh(summary)
#     return PatientSummaryResponse.from_orm(summary)

# @router.put("/patients/{patient_id}/summary", response_model=PatientSummaryResponse)
# async def update_patient_summary(patient_id: int, summary_update: PatientSummaryUpdate, db: Session = Depends(get_db)):
#     """Update patient summary"""
#     summary = db.query(PatientSummary).filter(PatientSummary.patient_id == patient_id).first()
#     if not summary:
#         raise HTTPException(status_code=404, detail="Patient summary not found")
    
#     update_data = summary_update.dict(exclude_unset=True)
#     for field, value in update_data.items():
#         setattr(summary, field, value)
    
#     summary.updated_at = datetime.utcnow()
#     db.commit()
#     db.refresh(summary)
#     return PatientSummaryResponse.from_orm(summary)

# # Revenue
# @router.get("/revenue", response_model=RevenueSummaryResponse)
# async def get_revenue_summary(target_date: Optional[date] = Query(None), db: Session = Depends(get_db)):
#     """Get revenue summary"""
#     if target_date is None:
#         target_date = date.today()
    
#     return RevenueSummaryResponse(
#         date=target_date,
#         daily_revenue=1200.0,
#         weekly_revenue=8400.0,
#         monthly_revenue=36000.0,
#         yearly_revenue=432000.0,
#         total_transactions=15,
#         average_transaction=80.0
#     )

# # Doctor Profile
# @router.get("/doctor/{doctor_id}/profile", response_model=DoctorProfile)
# async def get_doctor_profile(doctor_id: int, db: Session = Depends(get_db)):
#     """Get doctor profile"""
#     return DoctorProfile(
#         id=doctor_id,
#         full_name="Dr. John Smith",
#         email="john.smith@mediclinic.com",
#         specialization="General Practitioner",
#         license_number="MD-123456",
#         next_appointment="09:00 AM",
#         total_patients=1234,
#         total_appointments=42,
#         created_at=datetime.utcnow()
#     )

# # Dashboard Settings
# @router.get("/settings", response_model=DashboardSettings)
# async def get_dashboard_settings(doctor_id: int = Query(1), db: Session = Depends(get_db)):
#     """Get dashboard settings"""
#     return DashboardSettings()

# @router.put("/settings", response_model=DashboardSettings)
# async def update_dashboard_settings(settings_update: DashboardSettingsUpdate, doctor_id: int = Query(1), db: Session = Depends(get_db)):
#     """Update dashboard settings"""
#     current_settings = DashboardSettings()
    
#     update_data = settings_update.dict(exclude_unset=True)
#     for field, value in update_data.items():
#         setattr(current_settings, field, value)
    
#     return current_settings

# # Health Check
# @router.get("/health")
# async def dashboard_health_check():
#     """Dashboard health check"""
#     return {
#         "status": "healthy",
#         "timestamp": datetime.utcnow(),
#         "module": "dashboard"
#     }
