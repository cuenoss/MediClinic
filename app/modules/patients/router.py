from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from fastapi import HTTPException, Depends, APIRouter, UploadFile, File
from typing import Optional, List
from app.db import get_db
from .models import Patient, attached_files, Consultation 
from app.modules.appointments.models import Appointment
from .schemas import (
    AttachedFileResponse, AttachedFileCreate,
    PatientCreate, PatientUpdate, PatientResponse, PatientSearchFilters, 
    ConsultationResponse,ConsultationCreate,
    PrescriptionResponse
)
from datetime import datetime, timedelta
import os
import uuid

router = APIRouter(tags=["patients"])

# Helper functions for comma-separated data
def process_comma_separated_field(field_value: list[str] | str | None) -> str:
    """Convert list or string to comma-separated string for storage"""
    if not field_value:
        return ""
    
    if isinstance(field_value, list):
        return ", ".join([item.strip() for item in field_value if item.strip()])
    
    return str(field_value)

def parse_comma_separated_field(field_value: str | None) -> list[str]:
    """Convert comma-separated string to list for display"""
    if not field_value:
        return []
    
    return [item.strip() for item in field_value.split(',') if item.strip()]

# File upload configuration
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt', '.csv'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file: UploadFile) -> bool:
    """Validate uploaded file for security"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file_ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    return True



# Get all patients with search functionality
@router.get("/", response_model=List[PatientResponse])
async def list_patients(
    db: AsyncSession = Depends(get_db),
    filters: PatientSearchFilters = Depends(),
    page_size: int = 10,
    page: int = 1
) -> List[PatientResponse]:
    try:
        query = select(Patient)
        
        if filters.name:
            query = query.where(Patient.full_name.ilike(f"%{filters.name}%"))
        if filters.email:
            query = query.where(Patient.email.ilike(f"%{filters.email}%"))
        if filters.phone:
            query = query.where(Patient.phone.ilike(f"%{filters.phone}%"))
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)
        
        result = await db.execute(query)
        patients = result.scalars().all()
        
        return [PatientResponse.model_validate(patient) for patient in patients]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch patients")

# Get specific patient by ID
@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    db: AsyncSession = Depends(get_db)
) -> PatientResponse:
    try:
        result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        return PatientResponse.model_validate(patient)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch patient")

# Create new patient
@router.post("/", response_model=PatientResponse)
async def create_patient(
    patient_data: PatientCreate,
    db: AsyncSession = Depends(get_db)
) -> PatientResponse:
    try:
        patient_dict = patient_data.dict()
        current_date = datetime.utcnow().date()
        patient_dict["created_at"] = current_date
        patient_dict["updated_at"] = current_date
        
        # Process comma-separated fields
        patient_dict["allergies"] = process_comma_separated_field(patient_dict.get("allergies"))
        patient_dict["chronic_conditions"] = process_comma_separated_field(patient_dict.get("chronic_conditions"))
        
        new_patient = Patient(**patient_dict)
        db.add(new_patient)
        await db.commit()
        await db.refresh(new_patient)

        if not new_patient:
            raise HTTPException(status_code=500, detail="Failed to create patient")
        
        return PatientResponse.model_validate(new_patient)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create patient")

# Update existing patient
@router.patch("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: AsyncSession = Depends(get_db)
) -> PatientResponse:
    try:
        result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        update_data = patient_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            if key in ["allergies", "chronic_conditions"]:
                # Process comma-separated fields
                setattr(patient, key, process_comma_separated_field(value))
            else:
                setattr(patient, key, value)
        patient.updated_at = datetime.utcnow().date()
        
        await db.commit()
        await db.refresh(patient)
        
        return PatientResponse.model_validate(patient)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update patient")

# Delete patient
@router.delete("/{patient_id}")
async def delete_patient(
    patient_id: int,
    db: AsyncSession = Depends(get_db)
) -> dict:
    try:
        result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        await db.delete(patient)
        await db.commit()
        
        return {"message": "Patient deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete patient")

# Get patient consultation history
@router.get("/{patient_id}/consultations", response_model=List[ConsultationResponse])
async def get_patient_consultations(
    patient_id: int,
    db: AsyncSession = Depends(get_db)
) -> List[ConsultationResponse]:
    try:
        result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        consultations = patient.consultations or []
        return [ConsultationResponse.from_orm(consultation) for consultation in consultations]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch consultations")

# Add new consultation
@router.post("/{patient_id}/consultations", response_model=ConsultationResponse)
async def create_consultation(
    patient_id: int,
    consultation_data: ConsultationCreate,
    db: AsyncSession = Depends(get_db)
) -> ConsultationResponse:
    try:
        result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Update patient with consultation data
        update_data = consultation_data.dict(exclude_unset=True, exclude={'doctor_id', 'date', 'notes', 'main_complaint', 'problem_history', 'current_medications', 'symptoms_checklist', 'medical_history', 'family_medical_history', 'diagnosis'})
        for key, value in update_data.items():
            setattr(patient, key, value)
        patient.updated_at = datetime.utcnow().date()
        
        # Create consultation
        consultation_date = consultation_data.date or datetime.utcnow()
        symptoms_str = ", ".join(consultation_data.symptoms_checklist) if consultation_data.symptoms_checklist else None
        new_consultation = Consultation(
            patient_id=patient_id,
            doctor_id=consultation_data.doctor_id,
            date=consultation_date,
            notes=consultation_data.notes,
            main_complaint=consultation_data.main_complaint,
            problem_history=consultation_data.problem_history,
            current_medications=consultation_data.current_medications,
            symptoms_checklist=symptoms_str,
            medical_history=consultation_data.medical_history,
            family_medical_history=consultation_data.family_medical_history,
            diagnosis=consultation_data.diagnosis
        )
        
        db.add(new_consultation)
        await db.commit()
        await db.refresh(new_consultation)
        
        return ConsultationResponse.from_orm(new_consultation)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create consultation")
    

# Get patient files
@router.get("/{patient_id}/files", response_model=List[AttachedFileResponse])
async def get_patient_files(
    patient_id: int,
    db: AsyncSession = Depends(get_db)
) -> List[AttachedFileResponse]:
    try:
        result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        files_result = await db.execute(
            select(attached_files).where(attached_files.patient_id == patient_id)
        )
        files = files_result.scalars().all()
        
        return [AttachedFileResponse.from_orm(file) for file in files]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch patient files")

# Upload file for patient
@router.post("/{patient_id}/files", response_model=AttachedFileResponse)
async def upload_patient_file(
    patient_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
) -> AttachedFileResponse:
    try:
        # Validate patient exists
        patient_result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = patient_result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Validate file
        validate_file(file)
        
        # Check file size
        if file.size and file.size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/patients"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file with proper error handling
        try:
            content = await file.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400, 
                    detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
                )
            
            with open(file_path, "wb") as buffer:
                buffer.write(content)
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Save file record to database
        new_file = attached_files(
            patient_id=patient_id,
            file_name=file.filename,
            file_path=file_path,
            created_at=datetime.utcnow()
        )
        
        db.add(new_file)
        await db.commit()
        await db.refresh(new_file)
        
        return AttachedFileResponse.from_orm(new_file)
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to upload file")

# Delete patient file
@router.delete("/{patient_id}/files/{file_id}")
async def delete_patient_file(
    patient_id: int,
    file_id: int,
    db: AsyncSession = Depends(get_db)
) -> dict:
    try:
        # Validate patient exists
        patient_result = await db.execute(select(Patient).where(Patient.id == patient_id))
        patient = patient_result.scalars().first()
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Find file record
        file_result = await db.execute(
            select(attached_files).where(
                attached_files.id == file_id,
                attached_files.patient_id == patient_id
            )
        )
        file_record = file_result.scalars().first()
        
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Delete physical file with error handling
        try:
            if os.path.exists(file_record.file_path):
                os.remove(file_record.file_path)
        except Exception as e:
            # Log error but continue with database deletion
            print(f"Warning: Failed to delete physical file {file_record.file_path}: {e}")
        
        # Delete database record
        await db.delete(file_record)
        await db.commit()
        
        return {"message": "File deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete file")


#prescription generation
@router.post("/{patient_id}/prescriptions", response_model=PrescriptionResponse)
async def generate_prescription(
    patient_id: int,
    prescription_data: dict,
    db: AsyncSession = Depends(get_db)
) -> PrescriptionResponse:
    query=select(Patient).where(Patient.id == patient_id)
    result = await db.execute(query)
    patient = result.scalars().first()
    #calculate the age of the patient based on the date of birth
    age=datetime.now().year-patient.date_of_birth.year if patient.date_of_birth else 0

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return(PrescriptionResponse(
        patient_name=patient.full_name,
        patient_age=age,
        patient_gender=patient.gender
    ))
