from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
# Đọc .env.local từ thư mục gốc (D:\Vitral\.env.local)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

from routers import activities, summary

from backend.routes.stress import router as stress_router

app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include onboarding routes
app.include_router(onboarding_router)
app.include_router(stress_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Vitral API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
