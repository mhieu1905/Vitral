from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
# Đọc .env.local từ thư mục gốc (D:\Vitral\.env.local)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

from routers import activities, summary

app = FastAPI(title="VitalTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(summary.router, prefix="/api/summary", tags=["Summary"])

@app.get("/")
def root():
    return {"message": "VitalTrack API đang chạy!"}