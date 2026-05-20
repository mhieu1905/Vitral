import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 1. ĐƯA THƯ MỤC BACKEND VÀO PATH HỆ THỐNG TRƯỚC (BẮT BUỘC ĐỂ ĐẦU TIÊN)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 2. ĐỌC FILE CẤU HÌNH .ENV.LOCAL
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# 3. IMPORT CÁC ROUTER CHUẨN ĐƯỜNG DẪN PACKAGE
from routes.onboarding import router as onboarding_router
from routers import activities, summary
from routes.stress import router as stress_router  # Đã bỏ 'backend.' ở đầu vì dùng sys.path ở trên
from routes.nutrition import router as nutrition_router
from backend.routes.recommend import router as recommend_router

app = FastAPI()

# Cấu hình CORS để Frontend kết nối thoải mái
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các Router vào hệ thống FastAPI
app.include_router(onboarding_router)
app.include_router(stress_router)
app.include_router(recommend_router)
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"]) # Thêm router activities để test log calo lúc nãy
app.include_router(summary.router, prefix="/api/summary", tags=["Summary"])
app.include_router(nutrition_router, prefix="/api/nutrition")

@app.get("/")
def read_root():
    return {"message": "Welcome to Vitral API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}