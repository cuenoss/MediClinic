from fastapi import APIRouter

# Import all module routers here
# from app.modules.auth.router import router as auth_router
# from app.modules.patients.router import router as patients_router
# from app.modules.consultations.router import router as consultations_router
# from app.modules.appointments.router import router as appointments_router
# from app.modules.billing.router import router as billing_router
# from app.modules.files.router import router as files_router
# from app.modules.settings.router import router as settings_router
# from app.modules.dashboard.router import router as dashboard_router

api_router = APIRouter()

# Add module routers here
# api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
# api_router.include_router(patients_router, prefix="/patients", tags=["patients"])
# api_router.include_router(consultations_router, prefix="/consultations", tags=["consultations"])
# api_router.include_router(appointments_router, prefix="/appointments", tags=["appointments"])
# api_router.include_router(billing_router, prefix="/billing", tags=["billing"])
# api_router.include_router(files_router, prefix="/files", tags=["files"])
# api_router.include_router(settings_router, prefix="/settings", tags=["settings"])
# api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working"}