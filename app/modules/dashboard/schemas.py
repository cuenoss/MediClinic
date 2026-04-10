from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True


# Dashboard Stats (calculated in real-time)
class DashboardStatsResponse(BaseSchema):
    total_patients: int
    today_appointments: int
    pending_payments: float
    consultations: int
    total_revenue: float
    monthly_revenue: float
    active_patients: int
    new_patients_this_month: int


class DashboardAppointmentItem(BaseModel):
    """Today's appointments from the real Appointment model (time is a string, often ISO date prefix)."""

    id: int
    patient_id: int
    time: str
    duration: int
    appointment_type: str
    type: str  
    patient_name: Optional[str] = None


class DashboardRecentPatient(BaseModel):
    id: int
    full_name: str
    name: str  
    phone: str
    email: Optional[str] = None
    gender: Optional[str] = None
    age: int = 0


class DashboardOverviewResponse(BaseModel):
    doctor_id: Optional[int] = None
    stats: DashboardStatsResponse
    today_appointments: List[DashboardAppointmentItem]
    recent_patients: List[DashboardRecentPatient]


# Recent Activity (calculated from existing data)
class RecentActivityResponse(BaseSchema):
    id: int
    activity_type: str
    title: str
    description: Optional[str]
    patient_id: Optional[int]
    doctor_id: Optional[int]
    status: str
    created_at: datetime


# Doctor Profile (for dashboard)
class DoctorProfile(BaseSchema):
    id: int
    full_name: str
    email: str
    specialization: Optional[str]
    license_number: Optional[str]
    next_appointment: Optional[str]
    total_patients: int
    total_appointments: int
    created_at: datetime


# Dashboard Settings
class DashboardSettings(BaseSchema):
    refresh_interval: int = 30  # minutes
    show_notifications: bool = True
    show_recent_activities: bool = True
    show_quick_actions: bool = True
    default_date_range: int = 30  # days
    theme: str = "light"


class DashboardSettingsUpdate(BaseSchema):
    refresh_interval: Optional[int] = None
    show_notifications: Optional[bool] = None
    show_recent_activities: Optional[bool] = None
    show_quick_actions: Optional[bool] = None
    default_date_range: Optional[int] = None
    theme: Optional[str] = None
