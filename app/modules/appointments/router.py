from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from .models import Appointment
from .schemas import AppointmentCreate
from app.modules.patients.models import Patient
from datetime import datetime

router = APIRouter(tags=["appointments"])

# Create appointment with minimal patient data and store in database
@router.post("/create")
async def create_appointment(
    appointment: AppointmentCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        patient = None
        if appointment.patient_id:
            result = await db.execute(select(Patient).where(Patient.id == appointment.patient_id))
            patient = result.scalars().first()

        if not patient:
            patient_result = await db.execute(select(Patient).where(Patient.phone == appointment.phone_number))
            patient = patient_result.scalars().first()

        current_date = datetime.utcnow().date()
        if not patient:
            patient = Patient(
                full_name=appointment.patient_name,
                phone=appointment.phone_number,
                created_at=current_date,
                updated_at=current_date
            )
            db.add(patient)
            await db.flush()
        else:
            if not patient.full_name:
                patient.full_name = appointment.patient_name
            if not patient.phone:
                patient.phone = appointment.phone_number
            patient.updated_at = current_date

        # Check if patient has an appointment at the same time
        existing_result = await db.execute(
            select(Appointment).where(
                Appointment.patient_id == patient.id,
                Appointment.time == appointment.time
            )
        )
        existing_appointment = existing_result.scalars().first()
        if existing_appointment:
            return {"message": "Patient already has an appointment at this time"}

        new_appointment = Appointment(
            patient_id=patient.id,
            time=appointment.time,
            duration=appointment.duration,
            type=appointment.type
        )

        db.add(new_appointment)
        await db.commit()
        await db.refresh(new_appointment)
        return {
            "message": "Appointment created successfully",
            "appointment_id": new_appointment.id,
            "patient_id": patient.id,
        }
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Database error while creating the appointment. Check that PostgreSQL is running and the schema matches the models.",
        )


#get all the appointments 
@router.get("/all")
async def get_appointments(db: AsyncSession = Depends(get_db)):
  
    result = await db.execute(select(Appointment))
    appointments = result.scalars().all()
    return appointments


#remove an appointment by id
@router.delete("/{appointment_id}")
async def delete_appointment(appointment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalar_one_or_none()
    if appointment is None:
        return {"message": "Appointment not found"}
    db.delete(appointment)
    await db.commit()
    return {"message": "Appointment deleted successfully"}