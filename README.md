# NyayVidhi – AI Legal Assistant

NyayVidhi is a full-stack AI powered legal assistant that analyzes legal queries and provides structured legal insights using RAG (Retrieval Augmented Generation).

## Tech Stack
Frontend: React + Vite + TailwindCSS
Backend: FastAPI (Python)
AI: RAG Pipeline (FAISS Vector DB)
Embedding: Legal Document Retrieval
Database: Vector Store

## Features
- Chat based legal assistant
- Context aware legal reasoning
- Legal analysis cards
- Document retrieval system
- Fast real-time responses

## Run Locally

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev
