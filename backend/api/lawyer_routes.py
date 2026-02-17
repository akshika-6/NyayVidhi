"""
Lawyer Consultation API Routes
Handles lawyer matching and consultation endpoints with rate limiting.
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import hashlib

from backend.services.category_detector import detect_category
from backend.services.lawyer_matcher import match_lawyers, format_matched_lawyers_response
from backend.services.response_generator import generate_lawyer_response, generate_quick_summary
from backend.services.fake_lawyer_db import get_lawyer_by_id, get_all_lawyers

# Create router
router = APIRouter(prefix="/lawyer", tags=["Lawyer Consultation"])

# Rate limiting configuration
MAX_QUERIES_PER_DAY = 5
rate_limit_store = {}  # In production, use Redis or database


# Pydantic models
class AskQueryRequest(BaseModel):
    user_query: str
    city: Optional[str] = None


class ConnectRequest(BaseModel):
    user_query: str
    lawyer_id: str
    category: str
    conversation_history: Optional[List[dict]] = None


class CategoryDetectionResponse(BaseModel):
    category: str
    urgency: str
    confidence: float


# Rate limiting dependency
def check_rate_limit(request: Request):
    """
    Check if user has exceeded daily query limit.
    Uses IP address as identifier (in production, use user_id).
    """
    # Get client IP
    client_ip = request.client.host
    user_id = hashlib.md5(client_ip.encode()).hexdigest()[:16]
    
    today = datetime.now().date()
    key = f"{user_id}_{today}"
    
    # Initialize or get user's query count
    if key not in rate_limit_store:
        rate_limit_store[key] = {"count": 0, "reset_date": today}
    
    user_data = rate_limit_store[key]
    
    # Reset if new day
    if user_data["reset_date"] != today:
        user_data["count"] = 0
        user_data["reset_date"] = today
    
    # Check limit
    if user_data["count"] >= MAX_QUERIES_PER_DAY:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Daily query limit reached",
                "message": f"You have reached the maximum of {MAX_QUERIES_PER_DAY} queries per day. Please try again tomorrow.",
                "queries_used": user_data["count"],
                "queries_remaining": 0,
                "reset_time": str(datetime.combine(today + timedelta(days=1), datetime.min.time()))
            }
        )
    
    # Increment count
    user_data["count"] += 1
    
    return {
        "queries_used": user_data["count"],
        "queries_remaining": MAX_QUERIES_PER_DAY - user_data["count"]
    }


@router.post("/ask")
async def ask_legal_query(
    request: AskQueryRequest,
    req: Request,
    rate_info: dict = Depends(check_rate_limit)
):
    """
    Main endpoint: Detect category and match lawyers.
    
    Flow:
    1. Validate query
    2. Detect legal category
    3. Match top 3 lawyers
    4. Generate quick AI summary
    5. Return results
    """
    try:
        query = request.user_query.strip()
        
        if not query or len(query) < 10:
            raise HTTPException(
                status_code=400,
                detail="Please provide a valid legal question (minimum 10 characters)"
            )
        
        # 1. Detect category
        category_result = detect_category(query)
        
        # 2. Match lawyers
        matched_lawyers = match_lawyers(
            category=category_result["category"],
            urgency=category_result["urgency"],
            city=request.city,
            limit=3
        )
        
        # 3. Generate quick summary
        quick_summary = generate_quick_summary(
            query=query,
            category=category_result["category"],
            urgency=category_result["urgency"]
        )
        
        # 4. Format response
        lawyer_response = format_matched_lawyers_response(matched_lawyers)
        
        return {
            "success": True,
            "query": query,
            "ai_summary": quick_summary,
            "category": category_result["category"],
            "urgency": category_result["urgency"],
            "confidence": category_result["confidence"],
            "matched_lawyers": lawyer_response["matched_lawyers"],
            "total_lawyers": lawyer_response["total_count"],
            "rate_limit": rate_info,
            "is_free": True,
            "message": "Connect with any lawyer for FREE unlimited consultation"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in ask_legal_query: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/connect")
async def connect_with_lawyer(request: ConnectRequest):
    """
    Connect with a specific lawyer and get response.
    Generates professional legal guidance.
    """
    try:
        query = request.user_query.strip()
        
        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Verify lawyer exists
        lawyer = get_lawyer_by_id(request.lawyer_id)
        if not lawyer:
            raise HTTPException(status_code=404, detail="Lawyer not found")
        
        # Generate lawyer response
        result = generate_lawyer_response(
            query=query,
            category=request.category,
            lawyer_id=request.lawyer_id,
            conversation_history=request.conversation_history
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate response"))
        
        return {
            "success": True,
            "response": result["response"],
            "lawyer_info": result["lawyer_info"],
            "category": result["category"],
            "is_free": True,
            "remaining_responses": "Unlimited",
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in connect_with_lawyer: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/lawyers")
async def get_lawyers_list(
    specialization: Optional[str] = None,
    city: Optional[str] = None,
    limit: int = 10
):
    """
    Get list of all lawyers with optional filters.
    """
    try:
        lawyers = get_all_lawyers()
        
        # Apply filters
        if specialization:
            lawyers = [l for l in lawyers if specialization in l["specialization"]]
        
        if city:
            lawyers = [l for l in lawyers if l["city"].lower() == city.lower()]
        
        # Sort by rating and experience
        lawyers.sort(key=lambda x: (x["rating"], x["experience_years"]), reverse=True)
        
        # Limit results
        lawyers = lawyers[:limit]
        
        return {
            "success": True,
            "lawyers": lawyers,
            "total": len(lawyers)
        }
        
    except Exception as e:
        print(f"Error in get_lawyers_list: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/lawyer/{lawyer_id}")
async def get_lawyer_details(lawyer_id: str):
    """
    Get detailed information about a specific lawyer.
    """
    try:
        lawyer = get_lawyer_by_id(lawyer_id)
        
        if not lawyer:
            raise HTTPException(status_code=404, detail="Lawyer not found")
        
        return {
            "success": True,
            "lawyer": lawyer
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_lawyer_details: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/categories")
async def get_legal_categories():
    """
    Get all available legal categories.
    """
    from backend.services.category_detector import LEGAL_CATEGORIES
    
    return {
        "success": True,
        "categories": list(LEGAL_CATEGORIES.keys()),
        "total": len(LEGAL_CATEGORIES)
    }


@router.get("/health")
async def health_check():
    """
    Health check endpoint for lawyer consultation service.
    """
    return {
        "status": "healthy",
        "service": "Lawyer Consultation",
        "is_free": True,
        "max_queries_per_day": MAX_QUERIES_PER_DAY,
        "environment": "development"
    }
