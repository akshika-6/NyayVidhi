from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.services.legal_service import ask_legal_question
from backend.api.lawyer_routes import router as lawyer_router
from backend.api.chat_routes import router as chat_router

app = FastAPI(
    title="NyayVidhi Legal AI",
    description="India's Free Legal Awareness & Guidance Platform",
    version="2.0.0"
)

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include lawyer consultation routes
app.include_router(lawyer_router)
app.include_router(chat_router)

class QueryRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {
        "message": "NyayVidhi API is running",
        "version": "2.0.0",
        "features": [
            "Legal AI Assistant",
            "Free Lawyer Consultation",
            "Category Detection",
            "Lawyer Matching"
        ],
        "is_free": True
    }

@app.post("/ask")
def ask_question(req: QueryRequest):
    """Legacy endpoint for legal AI assistant"""
    return ask_legal_question(req.question)
