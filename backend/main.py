import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from utils.data_loader import load_data, build_summary

app = FastAPI(title="NurseryPulse AI Backend")

# ── CORS — allow React dev server and production frontend ─────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ── Pre-load data on startup ──────────────────────────────────────────────────
@app.on_event("startup")
def startup():
    load_data()
    build_summary()
    print("\n🌱 NurseryPulse Backend ready  →  http://localhost:5000")
    print("📊 Dataset loaded. POST /api/chat to query.\n")

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(chat_router, prefix="/api/chat")

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "NurseryPulse AI Backend Running"}
