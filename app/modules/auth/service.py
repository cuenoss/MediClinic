from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .models import Doctor
from .schemas import DoctorCreate, DoctorLogin, DoctorResponse, TokenResponse
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import dotenv

dotenv.load_dotenv(dotenv_path='.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_doctor_by_email(db: AsyncSession, email: str) -> Optional[Doctor]:
    result = await db.execute(select(Doctor).where(Doctor.email == email))
    return result.scalars().first()

async def register_doctor(db: AsyncSession, doctor_data: DoctorCreate) -> DoctorResponse:
    # Check if doctor already exists
    existing_doctor = await get_doctor_by_email(db, doctor_data.email)
    if existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create doctor
    hashed_password = hash_password(doctor_data.password)
    current_time = datetime.utcnow()
    
    doctor = Doctor(
        fullName=doctor_data.fullName,
        email=doctor_data.email,
        hashed_password=hashed_password,
        created_at=current_time,
        updated_at=current_time
    )
    
    db.add(doctor)
    await db.commit()
    await db.refresh(doctor)
    
    return DoctorResponse.from_orm(doctor)

async def login_doctor(db: AsyncSession, doctor_data: DoctorLogin) -> TokenResponse:
    # Find doctor by email
    doctor = await get_doctor_by_email(db, doctor_data.email)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(doctor_data.password, doctor.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": doctor.email, "doctor_id": doctor.id},
        expires_delta=access_token_expires
    )
    
    # Update last login
    doctor.updated_at = datetime.utcnow()
    await db.commit()
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        doctor=DoctorResponse.from_orm(doctor)
    )

async def forgot_password(db: AsyncSession, email: str) -> dict:
    # Find doctor by email
    doctor = await get_doctor_by_email(db, email)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email"
        )
    
    # Create reset token (shorter expiry)
    reset_token_expires = timedelta(minutes=15)
    reset_token = create_access_token(
        data={"sub": doctor.email, "type": "password_reset"},
        expires_delta=reset_token_expires
    )
    
    # TODO: Send email with reset token
    # For now, just return success message
    return {
        "message": "Password reset link has been sent to your email",
        "reset_token": reset_token  # In production, don't return token, send via email
    }

async def reset_password(db: AsyncSession, token: str, new_password: str) -> dict:
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")
        
        if email is None or token_type != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )
    
    # Find doctor
    doctor = await get_doctor_by_email(db, email)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email"
        )
    
    # Update password
    doctor.hashed_password = hash_password(new_password)
    doctor.updated_at = datetime.utcnow()
    await db.commit()
    
    return {"message": "Password reset successful"}

async def get_current_doctor(
    credentials: HTTPAuthorizationCredentials = security,
    db: AsyncSession = None
) -> Doctor:
    if not db:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database session not provided"
        )
    
    try:
        # Decode token
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Get doctor
    doctor = await get_doctor_by_email(db, email)
    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Doctor not found"
        )
    
    return doctor
