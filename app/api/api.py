from fastapi import APIRouter

# Import all module routers
from app.modules.auth.router import router as auth_router
from app.modules.patients.router import router as patients_router
from app.modules.appointments.router import router as appointments_router
from app.modules.dashboard.router import router as dashboard_router
from app.modules.finance.router import router as finance_router

api_router = APIRouter()

# Add module routers
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(patients_router, prefix="/patients", tags=["patients"])
api_router.include_router(appointments_router, prefix="/appointments", tags=["appointments"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(finance_router, prefix="/finance", tags=["finance"])

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working"}