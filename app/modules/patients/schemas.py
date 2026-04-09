from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# Base schemas
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    gender: str
    email: EmailStr
    phone: str
    address: str
    date_of_birth: date
    blood_type: str
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    relationship_status: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

# Create schemas
class PatientCreate(PatientBase):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    amount_paid: Optional[float] = None
    date: Optional[date] = None




class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    relationship_status: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    status: Optional[str] = None

# Response schemas
class PatientResponse(PatientBase):
    id: int
    last_visit: Optional[date] = None
    status: str
    created_at: date
    updated_at: date
    
    @property
    def name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    class Config:
        from_attributes = True

# Patient list response (for get all patients endpoint)
class PatientListResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    status: str
    last_visit: Optional[date] = None
    
    @property
    def name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
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
    created_at: date
    
    class Config:
        from_attributes = True

# Patient with files response
class PatientWithFiles(PatientResponse):
    attached_files: List[AttachedFileResponse] = []

# Patient statistics schema
class PatientStats(BaseModel):
    total_patients: int
    active_patients: int
    inactive_patients: int
    recent_visits: int

# Patient summary for dashboard
class PatientSummary(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    last_visit: Optional[date] = None
    status: str
    
    @property
    def name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    class Config:
        from_attributes = True

# Patient with consultations response
class ConsultationResponse(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    date: datetime
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True



#attched files schemas
class AttachedFileResponse(BaseModel):
    id: int
    patient_id: int
    file_name: str
    file_path: str
    created_at: date

    class Config:
        from_attributes = True
