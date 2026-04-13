from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, List
from datetime import datetime
from enum import Enum


class SettingValueType(str, Enum):
    """Supported setting value types"""
    STRING = "string"
    INTEGER = "integer"
    BOOLEAN = "boolean"
    JSON = "json"
    FLOAT = "float"


class SettingCategory(str, Enum):
    """Setting categories"""
    GENERAL = "general"
    APPOINTMENTS = "appointments"
    NOTIFICATIONS = "notifications"
    SYSTEM = "system"
    SECURITY = "security"
    BILLING = "billing"
    PATIENTS = "patients"


# Base schemas
class BaseSetting(BaseModel):
    """Base setting schema"""
    key: str = Field(..., min_length=1, max_length=255, description="Setting key")
    description: Optional[str] = Field(None, description="Setting description")
    category: SettingCategory = Field(SettingCategory.GENERAL, description="Setting category")


# Create schemas
class SettingsCreate(BaseSetting):
    """Schema for creating a new setting"""
    value: Any = Field(..., description="Setting value")
    value_type: SettingValueType = Field(SettingValueType.STRING, description="Value type")


# Update schemas
class SettingsUpdate(BaseModel):
    """Schema for updating an existing setting"""
    value: Optional[Any] = Field(None, description="New setting value")
    description: Optional[str] = Field(None, description="Updated description")
    category: Optional[SettingCategory] = Field(None, description="Updated category")


# Response schemas
class SettingsResponse(BaseSetting):
    """Schema for setting response"""
    value: Any = Field(..., description="Setting value")
    value_type: SettingValueType = Field(..., description="Value type")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    model_config = {"from_attributes": True}


class SettingDetailResponse(BaseModel):
    """Detailed setting response with parsed value"""
    key: str
    value: Any
    value_type: SettingValueType
    description: Optional[str]
    category: SettingCategory
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SettingsListResponse(BaseModel):
    """Response for multiple settings"""
    settings: Dict[str, SettingDetailResponse]
    total_count: int
    categories: List[SettingCategory]


# Bulk operations
class BulkSettingsUpdate(BaseModel):
    """Schema for bulk updating settings"""
    updates: Dict[str, Any] = Field(..., description="Dictionary of setting keys and new values")


class BulkSettingsResponse(BaseModel):
    """Response for bulk operations"""
    updated: List[str] = Field(..., description="List of updated setting keys")
    failed: List[Dict[str, str]] = Field(..., description="List of failed updates with error messages")
    total_updated: int = Field(..., description="Total number of successfully updated settings")


# Configuration schemas
class ClinicInfo(BaseModel):
    """Clinic information settings"""
    name: str = Field("MediClinic", description="Clinic name")
    address: Optional[str] = Field(None, description="Clinic address")
    phone: Optional[str] = Field(None, description="Clinic phone")
    email: Optional[str] = Field(None, description="Clinic email")
    website: Optional[str] = Field(None, description="Clinic website")


class AppointmentSettings(BaseModel):
    """Appointment-related settings"""
    default_duration: int = Field(30, description="Default appointment duration in minutes")
    buffer_time: int = Field(15, description="Buffer time between appointments")
    max_per_day: int = Field(50, description="Maximum appointments per day")
    auto_confirm: bool = Field(True, description="Auto-confirm new appointments")
    allow_cancellation_hours: int = Field(24, description="Hours before appointment when cancellation is allowed")


class WorkingHours(BaseModel):
    """Working hours configuration"""
    start: Optional[str] = Field(None, description="Start time (HH:MM)")
    end: Optional[str] = Field(None, description="End time (HH:MM)")
    closed: bool = Field(False, description="Is this day closed")


class WeeklySchedule(BaseModel):
    """Weekly working hours"""
    monday: WorkingHours = Field(WorkingHours(start="09:00", end="17:00"))
    tuesday: WorkingHours = Field(WorkingHours(start="09:00", end="17:00"))
    wednesday: WorkingHours = Field(WorkingHours(start="09:00", end="17:00"))
    thursday: WorkingHours = Field(WorkingHours(start="09:00", end="17:00"))
    friday: WorkingHours = Field(WorkingHours(start="09:00", end="17:00"))
    saturday: WorkingHours = Field(WorkingHours(start="09:00", end="13:00"))
    sunday: WorkingHours = Field(WorkingHours(closed=True))


class NotificationSettings(BaseModel):
    """Notification configuration"""
    email_enabled: bool = Field(True, description="Enable email notifications")
    sms_enabled: bool = Field(False, description="Enable SMS notifications")
    appointment_reminders: bool = Field(True, description="Send appointment reminders")
    reminder_hours_before: int = Field(24, description="Hours before appointment to send reminder")
    welcome_email: bool = Field(True, description="Send welcome email to new patients")
    birthday_wishes: bool = Field(True, description="Send birthday wishes")


class SecuritySettings(BaseModel):
    """Security configuration"""
    password_min_length: int = Field(8, description="Minimum password length")
    session_timeout_minutes: int = Field(30, description="Session timeout in minutes")
    max_login_attempts: int = Field(5, description="Maximum login attempts before lockout")
    require_2fa: bool = Field(False, description="Require two-factor authentication")
    password_expiry_days: int = Field(90, description="Password expiry in days")


class BackupSettings(BaseModel):
    """Backup configuration"""
    auto_backup: bool = Field(True, description="Enable automatic backups")
    frequency: str = Field("daily", description="Backup frequency (daily, weekly, monthly)")
    retention_days: int = Field(30, description="Days to keep backups")
    backup_location: str = Field("local", description="Backup storage location")
    encryption_enabled: bool = Field(True, description="Encrypt backup files")


# Complete configuration
class SystemConfiguration(BaseModel):
    """Complete system configuration"""
    clinic: ClinicInfo = Field(..., description="Clinic information")
    appointments: AppointmentSettings = Field(..., description="Appointment settings")
    working_hours: WeeklySchedule = Field(..., description="Weekly working hours")
    notifications: NotificationSettings = Field(..., description="Notification settings")
    security: SecuritySettings = Field(..., description="Security settings")
    backup: BackupSettings = Field(..., description="Backup settings")


# Import/Export schemas
class SettingsExport(BaseModel):
    """Schema for exporting settings"""
    settings: Dict[str, Any] = Field(..., description="All settings data")
    exported_at: datetime = Field(default_factory=datetime.utcnow, description="Export timestamp")
    version: str = Field("1.0", description="Export format version")


class SettingsImport(BaseModel):
    """Schema for importing settings"""
    settings: Dict[str, Any] = Field(..., description="Settings data to import")
    overwrite_existing: bool = Field(False, description="Overwrite existing settings")
    create_new: bool = Field(True, description="Create new settings that don't exist")


class ImportResult(BaseModel):
    """Result of settings import operation"""
    imported: List[str] = Field(..., description="Successfully imported settings")
    updated: List[str] = Field(..., description="Updated settings")
    failed: List[Dict[str, str]] = Field(..., description="Failed imports with errors")
    total_processed: int = Field(..., description="Total settings processed")