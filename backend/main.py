from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.services.legal_service import ask_legal_question
from backend.api.lawyer_routes import router as lawyer_router
from backend.api.chat_routes import router as chat_router
from backend.services.strategy_service import generate_case_strategy
from backend.api.auth import router as auth_router

print("FastAPI: Initializing app...")
app = FastAPI(
    title="NyayVidhi Legal AI",
    description="India's Free Legal Awareness & Guidance Platform",
    version="2.0.0"
)
print("FastAPI: App initialized.")

app.include_router(auth_router)

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
    preferred_language: str = "English"

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

class StrategyRequest(BaseModel):
    businessType: str
    disputeType: str
    contractExists: str
    amountInvolved: str
    opponentType: str
    urgency: str
    jurisdiction: str
    description: str

@app.post("/strategy/generate")
def get_case_strategy(req: StrategyRequest):
    return generate_case_strategy(req.model_dump())

# Serve static files from the React app
frontend_path = os.path.join(os.getcwd(), "frontend", "dist")
print(f"FastAPI: Looking for frontend at {frontend_path}")

if os.path.exists(frontend_path):
    # Mount the assets directory first
    assets_path = os.path.join(frontend_path, "assets")
    if os.path.exists(assets_path):
        print(f"FastAPI: Mounting assets from {assets_path}")
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        # If the path starts with api routes, let it pass (though FastAPI should handle it first)
        api_prefixes = ["/auth", "/lawyer", "/chat", "/ask", "/strategy"]
        if any(full_path.startswith(p.lstrip("/")) for p in api_prefixes):
             return {"detail": "Not Found"}
             
        # Check if the file exists in the static directory
        file_path = os.path.join(frontend_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Otherwise serve index.html for client-side routing
        return FileResponse(os.path.join(frontend_path, "index.html"))
    print("FastAPI: Frontend routes configured.")
else:
    print(f"Warning: Static files path not found at {frontend_path}")

print("FastAPI: Startup complete.")
