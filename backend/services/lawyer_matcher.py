"""
Lawyer Matching Service
Matches lawyers to user's legal category using intelligent filtering and ranking.
"""

from backend.services.fake_lawyer_db import get_all_lawyers, get_lawyers_by_specialization


def calculate_lawyer_score(lawyer: dict, category: str, urgency: str) -> float:
    """
    Calculate a score for lawyer based on multiple factors.
    
    Factors:
    - Specialization match
    - Availability (online > offline)
    - Rating
    - Experience
    - Urgency bonus
    
    Args:
        lawyer: Lawyer profile dict
        category: Legal category
        urgency: Urgency level (High/Medium/Low)
        
    Returns:
        float: Score (0-100)
    """
    score = 0.0
    
    # 1. Specialization match (40 points)
    if category in lawyer["specialization"]:
        # Primary specialization (first in list) gets bonus
        if lawyer["specialization"][0] == category:
            score += 40
        else:
            score += 30
    
    # 2. Availability (20 points)
    if lawyer["availability_status"] == "online":
        score += 20
        # Extra bonus for high urgency cases
        if urgency == "High":
            score += 5
    else:
        score += 5  # Offline lawyers get minimal points
    
    # 3. Rating (20 points)
    # Convert rating (4.0-5.0) to score (0-20)
    score += (lawyer["rating"] - 4.0) * 20
    
    # 4. Experience (20 points)
    # Cap at 20 years for scoring purposes
    experience_score = min(lawyer["experience_years"] / 20 * 20, 20)
    score += experience_score
    
    return round(score, 2)


def match_lawyers(category: str, urgency: str = "Medium", city: str = None, limit: int = 3) -> list:
    """
    Match and return top lawyers for a given legal category.
    
    Args:
        category: Legal category (e.g., "Family Law")
        urgency: Urgency level (High/Medium/Low)
        city: Optional city filter
        limit: Number of lawyers to return (default: 3)
        
    Returns:
        list: Top matched lawyer profiles with scores
    """
    all_lawyers = get_all_lawyers()
    
    # Filter by category
    matched_lawyers = []
    for lawyer in all_lawyers:
        if category in lawyer["specialization"]:
            matched_lawyers.append(lawyer)
    
    # If no exact matches, return general lawyers with high ratings
    if not matched_lawyers:
        print(f"No exact match for {category}, returning top-rated lawyers")
        matched_lawyers = sorted(all_lawyers, key=lambda x: x["rating"], reverse=True)[:limit]
        return [{**lawyer, "match_score": 50.0} for lawyer in matched_lawyers]
    
    # Apply city filter if provided
    if city:
        matched_lawyers = [l for l in matched_lawyers if l["city"].lower() == city.lower()]
    
    # Calculate scores for each lawyer
    scored_lawyers = []
    for lawyer in matched_lawyers:
        score = calculate_lawyer_score(lawyer, category, urgency)
        lawyer_with_score = {**lawyer, "match_score": score}
        scored_lawyers.append(lawyer_with_score)
    
    # Sort by score (descending) and then by rating
    scored_lawyers.sort(key=lambda x: (x["match_score"], x["rating"]), reverse=True)
    
    # Return top N lawyers
    return scored_lawyers[:limit]


def get_lawyer_summary_card(lawyer: dict) -> dict:
    """
    Create a compact lawyer summary for display.
    
    Args:
        lawyer: Full lawyer profile
        
    Returns:
        dict: Compact summary
    """
    return {
        "id": lawyer["id"],
        "name": lawyer["full_name"],
        "specialization": lawyer["specialization"],
        "city": lawyer["city"],
        "experience": f"{lawyer['experience_years']} years",
        "rating": lawyer["rating"],
        "languages": lawyer["languages"],
        "availability": lawyer["availability_status"],
        "bio": lawyer["bio"][:150] + "..." if len(lawyer["bio"]) > 150 else lawyer["bio"],
        "profile_image": lawyer["profile_image"],
        "match_score": lawyer.get("match_score", 0)
    }


def format_matched_lawyers_response(lawyers: list) -> dict:
    """
    Format matched lawyers into API response structure.
    
    Args:
        lawyers: List of matched lawyer profiles
        
    Returns:
        dict: Formatted response
    """
    if not lawyers:
        return {
            "success": False,
            "message": "No lawyers found matching your criteria",
            "matched_lawyers": []
        }
    
    lawyer_cards = [get_lawyer_summary_card(lawyer) for lawyer in lawyers]
    
    return {
        "success": True,
        "message": f"Found {len(lawyers)} lawyer(s) matching your requirements",
        "matched_lawyers": lawyer_cards,
        "total_count": len(lawyers)
    }


# Test function
if __name__ == "__main__":
    # Test matching
    test_cases = [
        {"category": "Family Law", "urgency": "High"},
        {"category": "Cyber Law", "urgency": "Medium"},
        {"category": "Property Law", "urgency": "Low", "city": "Delhi"}
    ]
    
    for test in test_cases:
        print(f"\n{'='*60}")
        print(f"Test Case: {test}")
        print(f"{'='*60}")
        
        lawyers = match_lawyers(**test)
        response = format_matched_lawyers_response(lawyers)
        
        print(f"\nMatched {len(lawyers)} lawyers:")
        for lawyer in response["matched_lawyers"]:
            print(f"\n  - {lawyer['name']}")
            print(f"    Score: {lawyer['match_score']}")
            print(f"    Specialization: {', '.join(lawyer['specialization'])}")
            print(f"    Rating: {lawyer['rating']} | Experience: {lawyer['experience']}")
            print(f"    Availability: {lawyer['availability']}")
