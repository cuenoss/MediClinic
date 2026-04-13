from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from typing import Optional, Dict, Any
import json
from datetime import datetime

from .models import SystemSettings
from .schemas import SettingsCreate, SettingsUpdate, SettingsResponse


class SettingsService:
    """Service for managing system settings"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_settings(self) -> Dict[str, Any]:
        """Get all system settings"""
        try:
            result = await self.db.execute(select(SystemSettings))
            settings = result.scalars().all()
            
            settings_dict = {}
            for setting in settings:
                # Parse JSON value if it's a JSON string
                try:
                    value = json.loads(setting.value) if setting.value_type == "json" else setting.value
                except json.JSONDecodeError:
                    value = setting.value
                
                settings_dict[setting.key] = {
                    "value": value,
                    "value_type": setting.value_type,
                    "description": setting.description,
                    "category": setting.category,
                    "updated_at": setting.updated_at
                }
            
            return settings_dict
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get settings: {str(e)}")
    
    async def get_setting(self, key: str) -> Optional[Dict[str, Any]]:
        """Get a specific setting by key"""
        try:
            result = await self.db.execute(
                select(SystemSettings).where(SystemSettings.key == key)
            )
            setting = result.scalars().first()
            
            if not setting:
                return None
            
            # Parse JSON value if needed
            try:
                value = json.loads(setting.value) if setting.value_type == "json" else setting.value
            except json.JSONDecodeError:
                value = setting.value
            
            return {
                "key": setting.key,
                "value": value,
                "value_type": setting.value_type,
                "description": setting.description,
                "category": setting.category,
                "updated_at": setting.updated_at
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get setting: {str(e)}")
    
    async def create_setting(self, setting_data: SettingsCreate) -> SettingsResponse:
        """Create a new setting"""
        try:
            # Check if setting already exists
            existing = await self.db.execute(
                select(SystemSettings).where(SystemSettings.key == setting_data.key)
            )
            if existing.scalars().first():
                raise HTTPException(status_code=400, detail=f"Setting '{setting_data.key}' already exists")
            
            # Convert value to string based on type
            if setting_data.value_type == "json":
                value = json.dumps(setting_data.value) if isinstance(setting_data.value, (dict, list)) else setting_data.value
            else:
                value = str(setting_data.value)
            
            new_setting = SystemSettings(
                key=setting_data.key,
                value=value,
                value_type=setting_data.value_type,
                description=setting_data.description,
                category=setting_data.category
            )
            
            self.db.add(new_setting)
            await self.db.commit()
            await self.db.refresh(new_setting)
            
            return SettingsResponse(
                key=new_setting.key,
                value=new_setting.value,
                value_type=new_setting.value_type,
                description=new_setting.description,
                category=new_setting.category,
                created_at=new_setting.created_at,
                updated_at=new_setting.updated_at
            )
            
        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create setting: {str(e)}")
    
    async def update_setting(self, key: str, setting_data: SettingsUpdate) -> SettingsResponse:
        """Update an existing setting"""
        try:
            result = await self.db.execute(
                select(SystemSettings).where(SystemSettings.key == key)
            )
            setting = result.scalars().first()
            
            if not setting:
                raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
            
            # Update fields
            if setting_data.value is not None:
                if setting.value_type == "json":
                    setting.value = json.dumps(setting_data.value) if isinstance(setting_data.value, (dict, list)) else setting_data.value
                else:
                    setting.value = str(setting_data.value)
            
            if setting_data.description is not None:
                setting.description = setting_data.description
            
            if setting_data.category is not None:
                setting.category = setting_data.category
            
            setting.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(setting)
            
            return SettingsResponse(
                key=setting.key,
                value=setting.value,
                value_type=setting.value_type,
                description=setting.description,
                category=setting.category,
                created_at=setting.created_at,
                updated_at=setting.updated_at
            )
            
        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to update setting: {str(e)}")
    
    async def delete_setting(self, key: str) -> bool:
        """Delete a setting"""
        try:
            result = await self.db.execute(
                select(SystemSettings).where(SystemSettings.key == key)
            )
            setting = result.scalars().first()
            
            if not setting:
                return False
            
            await self.db.delete(setting)
            await self.db.commit()
            
            return True
            
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to delete setting: {str(e)}")
    
    async def get_default_settings(self) -> Dict[str, Any]:
        """Get default system settings for initialization"""
        return {
            "clinic_name": {
                "value": "MediClinic",
                "value_type": "string",
                "description": "Name of the medical clinic",
                "category": "general"
            },
            "clinic_address": {
                "value": "",
                "value_type": "string",
                "description": "Clinic physical address",
                "category": "general"
            },
            "clinic_phone": {
                "value": "",
                "value_type": "string",
                "description": "Clinic phone number",
                "category": "general"
            },
            "clinic_email": {
                "value": "",
                "value_type": "string",
                "description": "Clinic email address",
                "category": "general"
            },
            "appointment_duration": {
                "value": 30,
                "value_type": "integer",
                "description": "Default appointment duration in minutes",
                "category": "appointments"
            },
            "appointment_buffer": {
                "value": 15,
                "value_type": "integer",
                "description": "Buffer time between appointments in minutes",
                "category": "appointments"
            },
            "max_appointments_per_day": {
                "value": 50,
                "value_type": "integer",
                "description": "Maximum number of appointments per day",
                "category": "appointments"
            },
            "working_hours": {
                "value": {
                    "monday": {"start": "09:00", "end": "17:00"},
                    "tuesday": {"start": "09:00", "end": "17:00"},
                    "wednesday": {"start": "09:00", "end": "17:00"},
                    "thursday": {"start": "09:00", "end": "17:00"},
                    "friday": {"start": "09:00", "end": "17:00"},
                    "saturday": {"start": "09:00", "end": "13:00"},
                    "sunday": {"start": None, "end": None}
                },
                "value_type": "json",
                "description": "Clinic working hours by day",
                "category": "appointments"
            },
            "notification_settings": {
                "value": {
                    "email_notifications": True,
                    "sms_notifications": False,
                    "appointment_reminders": True,
                    "reminder_hours_before": 24
                },
                "value_type": "json",
                "description": "Notification preferences",
                "category": "notifications"
            },
            "backup_settings": {
                "value": {
                    "auto_backup": True,
                    "backup_frequency": "daily",
                    "backup_retention_days": 30
                },
                "value_type": "json",
                "description": "Database backup configuration",
                "category": "system"
            },
            "security_settings": {
                "value": {
                    "password_min_length": 8,
                    "session_timeout_minutes": 30,
                    "max_login_attempts": 5
                },
                "value_type": "json",
                "description": "Security configuration",
                "category": "security"
            }
        }
    
    async def initialize_default_settings(self) -> Dict[str, Any]:
        """Initialize default settings if they don't exist"""
        try:
            defaults = await self.get_default_settings()
            created_settings = []
            
            for key, config in defaults.items():
                # Check if setting already exists
                existing = await self.db.execute(
                    select(SystemSettings).where(SystemSettings.key == key)
                )
                if not existing.scalars().first():
                    # Create new setting
                    new_setting = SystemSettings(
                        key=key,
                        value=json.dumps(config["value"]) if config["value_type"] == "json" else str(config["value"]),
                        value_type=config["value_type"],
                        description=config["description"],
                        category=config["category"]
                    )
                    self.db.add(new_setting)
                    created_settings.append(key)
            
            if created_settings:
                await self.db.commit()
            
            return {"created": created_settings, "total": len(created_settings)}
            
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to initialize settings: {str(e)}")