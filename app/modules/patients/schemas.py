from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

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

# Base schemas
class PatientBase(BaseModel):
    full_name: str
    gender: Optional[str] = None
    email: EmailStr
    phone: str
    address:Optional[str] = None
    date_of_birth: Optional[datetime.date] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    relationship_status: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    last_visit: Optional[datetime.date] = None
    next_appointment: Optional[datetime.date] = None

# Create schemas
class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[datetime.date] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    relationship_status: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    last_visit: Optional[datetime.date] = None
    next_appointment: Optional[datetime.date] = None

# Response schemas
class PatientResponse(BaseModel):
    id: int
    full_name: str
    name: str  # same as full_name — matches common frontend naming
    age: int
    gender: Optional[str] = None
    phone: str
    email: Optional[EmailStr] = None
    last_visit: Optional[datetime.date] = None

    @classmethod
    def model_validate(cls, patient):
        # Calculate age from date_of_birth
        age = 0
        if hasattr(patient, 'date_of_birth') and patient.date_of_birth:
            age = datetime.datetime.now().year - patient.date_of_birth.year

        fn = patient.full_name
        data = {
            'id': patient.id,
            'full_name': fn,
            'name': fn,
            'age': age,
            'gender': patient.gender,
            'phone': patient.phone,
            'email': patient.email,
            'last_visit': getattr(patient, 'last_visit', None),
        }
        return cls(**data)

    


# Search filters schema
class PatientSearchFilters(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

# Attached files schemas
class AttachedFileBase(BaseModel):
    file_name: str
    file_path: str

class AttachedFileCreate(AttachedFileBase):
    patient_id: int

class AttachedFileResponse(AttachedFileBase):
    id: int
    patient_id: int
    file_type: str
    created_at: datetime.date

    class Config:
        orm_mode = True  # Pydantic v1: required for .from_orm(SQLAlchemy model)

class PatientWithAttachedFiles(PatientResponse):
    attached_files: List[AttachedFileResponse] = []



# Patient summary 
class PatientSummary(BaseModel):
    id: int
    full_name: str
    age: int
    date_of_birth: Optional[datetime.date] = None
    email: EmailStr
    phone: str
    gender: str
    blood_type: Optional[str] = None
    
    @property
    def name(self) -> str:
        return self.full_name
    
    class Config:
        from_attributes = True

# Patient consultation schema
class ConsultationCreate(BaseModel):
    doctor_id: Optional[int] = None
    date: Optional[datetime.datetime] = None
    notes: Optional[str] = None
    main_complaint: Optional[str] = None
    problem_history: Optional[str] = None
    current_medications: Optional[str] = None
    symptoms_checklist: Optional[List[str]] = None
    medical_history: Optional[str] = None
    family_medical_history: Optional[str] = None
    diagnosis: Optional[str] = None

class ConsultationResponse(BaseModel):
    id: int
    doctor_id: Optional[int] = None
    patient_id: int
    date: datetime.datetime
    notes: Optional[str] = None
    main_complaint: Optional[str] = None
    problem_history: Optional[str] = None
    current_medications: Optional[str] = None
    symptoms_checklist: Optional[List[str]] = None
    medical_history: Optional[str] = None
    family_medical_history: Optional[str] = None
    diagnosis: Optional[str] = None

    @classmethod
    def from_orm(cls, consultation):
        symptoms = parse_comma_separated_field(consultation.symptoms_checklist) if consultation.symptoms_checklist else None
        data = {
            'id': consultation.id,
            'doctor_id': consultation.doctor_id,
            'patient_id': consultation.patient_id,
            'date': consultation.date,
            'notes': consultation.notes,
            'main_complaint': consultation.main_complaint,
            'problem_history': consultation.problem_history,
            'current_medications': consultation.current_medications,
            'symptoms_checklist': symptoms,
            'medical_history': consultation.medical_history,
            'family_medical_history': consultation.family_medical_history,
            'diagnosis': consultation.diagnosis
        }
        return cls(**data)


#prescription schemas
class PrescriptionResponse(BaseModel):
    patient_name: str
    patient_age: int
    patient_gender: str

