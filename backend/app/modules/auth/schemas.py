from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional

class DoctorCreate(BaseModel):
    model_config = {"from_attributes": True}
    fullName: str
    email: EmailStr
    password: str
    confirmPassword: str
    
    @model_validator(mode='after')
    def passwords_match(self):
        if self.password != self.confirmPassword:
            raise ValueError('Passwords do not match')
        return self
    


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str
    

class DoctorResponse(BaseModel):
    id: int
    fullName: str
    email: EmailStr
    
    model_config = {"from_attributes": True}

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    doctor: DoctorResponse


