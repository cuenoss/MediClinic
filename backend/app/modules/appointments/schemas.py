from pydantic import BaseModel
from typing import Optional

class AppointmentCreate(BaseModel):
    patient_name: str
    phone_number: str
    time: str
    type: str
    duration: int
    payment_amount: Optional[int] = 0
    patient_id: Optional[int] = None


class Appointment(BaseModel):
    id: int
    patient_id: int
    time: str
    duration: int
    type: str
    payment_amount: Optional[int] = 0

    model_config = {"from_attributes": True}