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
        print("✅ Database tables ensured (create_all)")
    except Exception as e:
        print(f"⚠️  Database connection failed: {e}")
        print("📝 API will start, but endpoints that use the database will fail until PostgreSQL is available.")
    
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
    lifespan=lifespan,
    servers=[{"url": "http://127.0.0.1:8000", "description": "Local development server"}]
)

# Typical Vite port 5173; credentials + wildcard origin is invalid in browsers — list dev origins explicitly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "MediClinic backend is running",
        "api_prefix": "/api",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }

