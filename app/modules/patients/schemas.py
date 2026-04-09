from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

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
class PatientResponse(PatientBase):
    id: int
    full_name: str
    age: int
    gender: str
    phone: str
    email: EmailStr
    last_visit: Optional[datetime.date] = None

    class Config:
        from_attributes = True

    


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
    created_at: datetime.date
    
    class Config:
        from_attributes = True
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
    # Patient update fields
    gender: Optional[str] = None
    email: Optional[EmailStr] = None
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
    weight: Optional[float] = None
    height: Optional[float] = None
    # Consultation specific fields
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

    class Config:
        orm_mode = True



#attched files schemas
class AttachedFileResponse(BaseModel):
    id: int
    patient_id: int
    file_name: str
    file_path: str
    type:str
    created_at: datetime.date

    class Config:
        from_attributes = True


#prescription schemas
class PrescriptionResponse(BaseModel):
    patient_name: str
    patient_age: int
    patient_gender: str

