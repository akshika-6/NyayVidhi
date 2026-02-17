from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.services.legal_service import ask_legal_question

app = FastAPI(title="NyayVidhi Legal AI")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message": "NyayVidhi API is running"}

@app.post("/ask")
def ask_question(req: QueryRequest):
    return ask_legal_question(req.question)
