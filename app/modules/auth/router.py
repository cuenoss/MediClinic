from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from .service import (
    register_doctor, login_doctor, forgot_password, reset_password,
    get_current_doctor
)
from .schemas import DoctorCreate, DoctorLogin, DoctorResponse, TokenResponse
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=DoctorResponse)
async def register(
    doctor_data: DoctorCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new doctor"""
    try:
        return await register_doctor(db, doctor_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again."
        )

@router.post("/login", response_model=TokenResponse)
async def login(
    doctor_data: DoctorLogin,
    db: AsyncSession = Depends(get_db)
):
    """Login a doctor and return access token"""
    try:
        return await login_doctor(db, doctor_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )

@router.post("/forgot-password")
async def forgot_password_endpoint(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Send password reset link to email"""
    try:
        return await forgot_password(db, email)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send reset email. Please try again."
        )

@router.post("/reset-password")
async def reset_password_endpoint(
    token: str,
    new_password: str,
    db: AsyncSession = Depends(get_db)
):
    """Reset password using token"""
    try:
        return await reset_password(db, token, new_password)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset failed. Please try again."
        )

@router.get("/me", response_model=DoctorResponse)
async def get_current_user(
    current_doctor: DoctorResponse = Depends(get_current_doctor),
    db: AsyncSession = Depends(get_db)
):
    """Get current authenticated doctor"""
    return current_doctor

@router.post("/logout")
async def logout():
    """Logout current user (client-side token removal)"""
    return {"message": "Successfully logged out"}
