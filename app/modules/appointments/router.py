from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from .models import Appointment
from .schemas import AppointmentCreate
from app.modules.patients.models import Patient

router = APIRouter(tags=["appointments"])

# Create appointment with minimal patient data and store in database
@router.post("/create")
async def create_appointment(
    appointment: AppointmentCreate,
    db: AsyncSession = Depends(get_db)
):
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

    existing_result = await db.execute(
        select(Appointment).where(
            Appointment.patient_id == patient.id,
            Appointment.time == appointment.time
        )
    )
    existing_appointment = existing_result.scalars().first()
    if existing_appointment:
        return {"message": "Patient already has an appointment"}

    new_appointment = Appointment(
        patient_id=patient.id,
        time=appointment.time,
        duration=appointment.duration,
    )

    db.add(new_appointment)
    await db.commit()
    await db.refresh(new_appointment)
    return {
        "message": "Appointment created successfully",
        "appointment_id": new_appointment.id,
        "patient_id": patient.id
    }


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
    await db.delete(appointment)
    await db.commit()
    return {"message": "Appointment deleted successfully"}