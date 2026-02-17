
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
import datetime

from backend.services.fake_lawyer_db import get_lawyer_by_id
from backend.services.response_generator import generate_lawyer_response

router = APIRouter()

# --- Pydantic Models ---

class ConnectRequest(BaseModel):
    lawyer_id: str

class ConnectResponse(BaseModel):
    lawyer_details: Dict[str, Any]
    initial_message: str

class ChatRequest(BaseModel):
    lawyer_id: str
    user_message: str
    chat_history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    lawyer_reply: str

class BookSlotRequest(BaseModel):
    lawyer_id: str
    date: str
    slot: str

class BookSlotResponse(BaseModel):
    confirmation_message: str
    booked_slot: Dict[str, str]

# In-memory storage for booked slots (for development)
# In production, this would be a database.
booked_slots_db: Dict[str, List] = {}


# --- API Endpoints ---

@router.post("/chat/connect", response_model=ConnectResponse)
async def connect_to_lawyer(req: ConnectRequest):
    """
    Initiates a chat session with a lawyer.
    Returns the lawyer's details and a welcome message.
    """
    lawyer = get_lawyer_by_id(req.lawyer_id)
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found")

    initial_message = f"Hello, I am Adv. {lawyer['full_name']}. Please describe your issue in detail."
    
    return ConnectResponse(
        lawyer_details=lawyer,
        initial_message=initial_message
    )

@router.post("/chat/send_message", response_model=ChatResponse)
async def send_chat_message(req: ChatRequest):
    """
    Receives a user's message and returns a simulated lawyer response.
    """
    lawyer = get_lawyer_by_id(req.lawyer_id)
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found")

    # Handle offline case
    if not lawyer.get("is_online", False):
        return ChatResponse(
            lawyer_reply="I am currently unavailable for live consultation. However, you may leave your detailed query here, and I will review it at the earliest."
        )

    lawyer_reply = await generate_lawyer_response(
        query=req.user_message,
        lawyer=lawyer,
        conversation_history=req.chat_history
    )
    
    return ChatResponse(lawyer_reply=lawyer_reply)


@router.post("/chat/book_slot", response_model=BookSlotResponse)
async def book_consultation_slot(req: BookSlotRequest):
    """
    Books a free consultation slot with a lawyer.
    This is a dummy implementation for development.
    """
    lawyer = get_lawyer_by_id(req.lawyer_id)
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found")

    # --- Dummy Slot Booking Logic ---
    date_obj = datetime.datetime.strptime(req.date, "%Y-%m-%d").date()
    
    # Find the date in lawyer's available slots
    slot_date_found = None
    for slot_group in lawyer.get("available_slots", []):
        if slot_group.get("date") == req.date:
            slot_date_found = slot_group
            break
    
    if not slot_date_found or req.slot not in slot_date_found.get("slots", []):
        raise HTTPException(status_code=400, detail="Selected slot is not available")

    # Check if already booked in our dummy DB
    if booked_slots_db.get(req.lawyer_id, {}).get(req.date) and req.slot in booked_slots_db[req.lawyer_id][req.date]:
         raise HTTPException(status_code=409, detail="This slot has already been booked.")

    # "Book" the slot
    if req.lawyer_id not in booked_slots_db:
        booked_slots_db[req.lawyer_id] = {}
    if req.date not in booked_slots_db[req.lawyer_id]:
        booked_slots_db[req.lawyer_id][req.date] = []
    
    booked_slots_db[req.lawyer_id][req.date].append(req.slot)

    # Remove from lawyer's available slots for this session
    slot_date_found["slots"].remove(req.slot)

    confirmation_message = f"Your free consultation with Adv. {lawyer['full_name']} is booked for {req.slot} on {req.date}."
    
    return BookSlotResponse(
        confirmation_message=confirmation_message,
        booked_slot={"date": req.date, "slot": req.slot}
    )
