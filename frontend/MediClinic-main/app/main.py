from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db import engine, Base
from app.api.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️  Database connection failed: {e}")
        print("📝 Using in-memory mode - some features may not work")
    
    yield
    
    try:
        await engine.dispose()
        print("✅ Database connection closed")
    except Exception as e:
        print(f"⚠️  Error closing database: {e}")


app = FastAPI(
    title="MediClinic API",
    description="A comprehensive clinic management system",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "MediClinic backend is running"}

