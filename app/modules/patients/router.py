from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from fastapi import HTTPException, Depends, APIRouter, UploadFile, File
from typing import Optional, List
from app.db import get_db
from .models import Patient, attached_files
from .schemas import (
    AttachedFileResponse, PatientCreate, PatientUpdate, PatientResponse, 
    PatientListResponse, AttachedFileBase, ConsultationResponse,
    PatientSearchFilters, AttachedFileCreate
)
from datetime import datetime, timedelta
import os
import uuid

router = APIRouter(prefix="/patients", tags=["patients"])

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

# Statistics endpoint - MUST come before /{patient_id} to avoid route conflicts
@router.get("/stats/overview")
async def get_patient_stats(db: AsyncSession = Depends(get_db)) -> dict:
    try:
        total_patients = await db.execute(select(Patient).count())
        active_patients = await db.execute(
            select(Patient).where(Patient.status == "active").count()
        )
        inactive_patients = await db.execute(
            select(Patient).where(Patient.status == "inactive").count()
        )
        
        # Recent visits (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_visits = await db.execute(
            select(Patient).where(Patient.last_visit >= thirty_days_ago).count()
        )
        
        return {
            "total_patients": total_patients.scalar(),
            "active_patients": active_patients.scalar(),
            "inactive_patients": inactive_patients.scalar(),
            "recent_visits": recent_visits.scalar()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch patient statistics")

# Get all patients with search functionality
@router.get("/", response_model=List[PatientListResponse])
async def list_patients(
    db: AsyncSession = Depends(get_db),
    filters: PatientSearchFilters = Depends(),
    page_size: int = 10,
    page: int = 1
) -> List[PatientListResponse]:
    try:
        query = select(Patient)
        
        if filters.name:
            query = query.where(
                or_(
                    Patient.first_name.ilike(f"%{filters.name}%"), 
                    Patient.last_name.ilike(f"%{filters.name}%")
                )
            )
        if filters.email:
            query = query.where(Patient.email.ilike(f"%{filters.email}%"))
        if filters.phone:
            query = query.where(Patient.phone.ilike(f"%{filters.phone}%"))
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)
        
        result = await db.execute(query)
        patients = result.scalars().all()
        
        return [PatientListResponse.from_orm(patient) for patient in patients]
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
        
        return PatientResponse.from_orm(patient)
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
        patient_dict["created_at"] = patient_dict["updated_at"] = datetime.utcnow()
        
        new_patient = Patient(**patient_dict)
        db.add(new_patient)
        await db.commit()
        await db.refresh(new_patient)

        if not new_patient:
            raise HTTPException(status_code=500, detail="Failed to create patient")
        
        return PatientResponse.from_orm(new_patient)
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
        
        for key, value in patient_data.dict(exclude_unset=True).items():
            setattr(patient, key, value)
        patient.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(patient)
        
        return PatientResponse.from_orm(patient)
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
    consultation_data: dict,
    db: AsyncSession = Depends(get_db)
) -> ConsultationResponse:
    # This would need a proper Consultation model and schema
    # For now, returning a placeholder
    raise HTTPException(status_code=501, detail="Consultation creation not yet implemented")

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
