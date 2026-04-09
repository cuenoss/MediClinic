from pydantic import BaseModel, EmailStr, constr, validator
from typing import Optional

class DoctorCreate(BaseModel):
    fullName: str
    email: EmailStr
    password: constr(min_length=8)
    confirmPassword: str
    
    @validator('confirmPassword')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    



class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

class DoctorResponse(BaseModel):
    id: int
    fullName: str
    email: EmailStr
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    doctor: DoctorResponse


