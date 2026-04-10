from pydantic import BaseModel
from typing import Optional

class AppointmentCreate(BaseModel):
    patient_name: str
    phone_number: str
    time: str
    type: str
    duration: int
    patient_id: Optional[int] = None


class Appointment(BaseModel):
    id: int
    patient_id: int
    time: str
    duration: int
    type: str

    class Config:
        from_attributes = True