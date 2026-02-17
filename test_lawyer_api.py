"""
API Usage Examples for NyayVidhi Lawyer Consultation System
Quick reference for testing and integrating the lawyer consultation APIs.
"""

import requests
import json

BASE_URL = "http://localhost:8001"

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}")
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse:")
    print(json.dumps(response.json(), indent=2))


# ============================================================================
# EXAMPLE 1: Ask Legal Query (Main Flow)
# ============================================================================

def example_ask_query():
    """Example: Detect category and match lawyers"""
    
    payload = {
        "user_query": "My husband is asking for divorce without any reason. What are my rights?",
        "city": "Mumbai"  # Optional
    }
    
    response = requests.post(f"{BASE_URL}/lawyer/ask", json=payload)
    print_response("EXAMPLE 1: ASK LEGAL QUERY", response)
    
    # Extract matched lawyers
    if response.status_code == 200:
        data = response.json()
        print(f"\n🎯 Category Detected: {data['category']}")
        print(f"⚡ Urgency: {data['urgency']}")
        print(f"📊 Confidence: {data['confidence']}")
        print(f"\n💬 AI Summary:\n   {data['ai_summary']}")
        print(f"\n👨‍⚖️ Matched {data['total_lawyers']} Lawyers:")
        
        for i, lawyer in enumerate(data['matched_lawyers'], 1):
            print(f"\n   {i}. {lawyer['name']}")
            print(f"      Score: {lawyer['match_score']} | Rating: {lawyer['rating']}⭐")
            print(f"      Specialization: {', '.join(lawyer['specialization'])}")
            print(f"      City: {lawyer['city']} | Availability: {lawyer['availability']}")
        
        print(f"\n📈 Rate Limit:")
        print(f"   Queries Used: {data['rate_limit']['queries_used']}/5")
        print(f"   Remaining: {data['rate_limit']['queries_remaining']}")
        
        return data['matched_lawyers'][0]['id'] if data['matched_lawyers'] else None


# ============================================================================
# EXAMPLE 2: Connect with Lawyer
# ============================================================================

def example_connect_lawyer(lawyer_id):
    """Example: Get response from a specific lawyer"""
    
    if not lawyer_id:
        print("\n⚠️  No lawyer_id provided. Run example_ask_query() first.")
        return
    
    payload = {
        "user_query": "What documents do I need to file for divorce?",
        "lawyer_id": lawyer_id,
        "category": "Family Law"
    }
    
    response = requests.post(f"{BASE_URL}/lawyer/connect", json=payload)
    print_response("EXAMPLE 2: CONNECT WITH LAWYER", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📋 LAWYER RESPONSE:")
        print(f"{'─'*80}")
        print(data['response'])
        print(f"{'─'*80}")
        print(f"\n👨‍⚖️ Lawyer: {data['lawyer_info']['name']}")
        print(f"📍 City: {data['lawyer_info']['city']}")
        print(f"⭐ Rating: {data['lawyer_info']['rating']}")
        print(f"💚 Is Free: {data['is_free']}")
        print(f"♾️  Remaining Responses: {data['remaining_responses']}")


# ============================================================================
# EXAMPLE 3: Get All Lawyers (with filters)
# ============================================================================

def example_get_lawyers():
    """Example: Get lawyers list with filters"""
    
    # No filters
    response1 = requests.get(f"{BASE_URL}/lawyer/lawyers?limit=5")
    print_response("EXAMPLE 3A: GET ALL LAWYERS (No Filter)", response1)
    
    # Filter by specialization
    response2 = requests.get(f"{BASE_URL}/lawyer/lawyers?specialization=Cyber+Law&limit=3")
    print_response("EXAMPLE 3B: GET CYBER LAW LAWYERS", response2)
    
    # Filter by city
    response3 = requests.get(f"{BASE_URL}/lawyer/lawyers?city=Delhi")
    print_response("EXAMPLE 3C: GET LAWYERS IN DELHI", response3)


# ============================================================================
# EXAMPLE 4: Get Specific Lawyer Details
# ============================================================================

def example_get_lawyer_details(lawyer_id):
    """Example: Get details of a specific lawyer"""
    
    if not lawyer_id:
        # Use a dummy ID for demonstration
        lawyer_id = "12345-dummy"
    
    response = requests.get(f"{BASE_URL}/lawyer/lawyer/{lawyer_id}")
    print_response("EXAMPLE 4: GET LAWYER DETAILS", response)


# ============================================================================
# EXAMPLE 5: Get Legal Categories
# ============================================================================

def example_get_categories():
    """Example: Get all available legal categories"""
    
    response = requests.get(f"{BASE_URL}/lawyer/categories")
    print_response("EXAMPLE 5: GET LEGAL CATEGORIES", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📂 Available Categories ({data['total']}):")
        for i, category in enumerate(data['categories'], 1):
            print(f"   {i}. {category}")


# ============================================================================
# EXAMPLE 6: Health Check
# ============================================================================

def example_health_check():
    """Example: Check service health"""
    
    response = requests.get(f"{BASE_URL}/lawyer/health")
    print_response("EXAMPLE 6: SERVICE HEALTH CHECK", response)


# ============================================================================
# EXAMPLE 7: Test Rate Limiting
# ============================================================================

def example_rate_limiting():
    """Example: Test rate limiting by making 6 requests"""
    
    print(f"\n{'='*80}")
    print("  EXAMPLE 7: TESTING RATE LIMITING (5 queries/day)")
    print(f"{'='*80}")
    
    payload = {"user_query": "Test query for rate limiting"}
    
    for i in range(6):
        print(f"\n📤 Request {i+1}/6...")
        response = requests.post(f"{BASE_URL}/lawyer/ask", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success - Remaining: {data['rate_limit']['queries_remaining']}")
        elif response.status_code == 429:
            data = response.json()
            print(f"   ❌ Rate Limit Exceeded!")
            print(f"   Message: {data['detail']['message']}")
            print(f"   Queries Used: {data['detail']['queries_used']}")
            print(f"   Reset Time: {data['detail']['reset_time']}")
            break
        else:
            print(f"   ❌ Error: {response.status_code}")


# ============================================================================
# EXAMPLE 8: Multiple Category Detection Tests
# ============================================================================

def example_category_detection():
    """Example: Test category detection with various queries"""
    
    test_queries = [
        "Someone hacked my Instagram account",
        "Cheque bounced what to do?",
        "Builder not giving flat possession",
        "Boss terminated me without notice",
        "Need custody of my children after divorce"
    ]
    
    print(f"\n{'='*80}")
    print("  EXAMPLE 8: CATEGORY DETECTION TESTS")
    print(f"{'='*80}")
    
    for query in test_queries:
        payload = {"user_query": query}
        response = requests.post(f"{BASE_URL}/lawyer/ask", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n📝 Query: {query}")
            print(f"   ✅ Category: {data['category']}")
            print(f"   ⚡ Urgency: {data['urgency']}")
            print(f"   🎯 Confidence: {data['confidence']}")
        else:
            print(f"\n📝 Query: {query}")
            print(f"   ❌ Error: {response.status_code}")


# ============================================================================
# EXAMPLE 9: Complete User Journey
# ============================================================================

def example_complete_journey():
    """Example: Complete end-to-end user journey"""
    
    print(f"\n{'█'*80}")
    print("█  EXAMPLE 9: COMPLETE USER JOURNEY")
    print(f"{'█'*80}")
    
    # Step 1: User asks a question
    print("\n▶️  STEP 1: User asks a legal question")
    user_query = "My employer fired me without proper notice. I worked for 5 years."
    print(f"   Query: {user_query}")
    
    payload = {"user_query": user_query}
    response = requests.post(f"{BASE_URL}/lawyer/ask", json=payload)
    
    if response.status_code != 200:
        print(f"   ❌ Error: {response.status_code}")
        return
    
    data = response.json()
    
    # Step 2: System detects category
    print("\n▶️  STEP 2: System detects category")
    print(f"   Category: {data['category']}")
    print(f"   Urgency: {data['urgency']}")
    
    # Step 3: AI Summary
    print("\n▶️  STEP 3: AI generates quick summary")
    print(f"   {data['ai_summary']}")
    
    # Step 4: Matched lawyers
    print("\n▶️  STEP 4: System matches lawyers")
    print(f"   Found {data['total_lawyers']} lawyers:")
    for i, lawyer in enumerate(data['matched_lawyers'], 1):
        print(f"   {i}. {lawyer['name']} - Score: {lawyer['match_score']}")
    
    # Step 5: User selects a lawyer
    if data['matched_lawyers']:
        selected_lawyer = data['matched_lawyers'][0]
        print(f"\n▶️  STEP 5: User selects lawyer")
        print(f"   Selected: {selected_lawyer['name']}")
        
        # Step 6: Get response from lawyer
        print(f"\n▶️  STEP 6: Get response from lawyer")
        connect_payload = {
            "user_query": user_query,
            "lawyer_id": selected_lawyer['id'],
            "category": data['category']
        }
        
        connect_response = requests.post(f"{BASE_URL}/lawyer/connect", json=connect_payload)
        
        if connect_response.status_code == 200:
            connect_data = connect_response.json()
            print(f"   ✅ Response received:")
            print(f"\n   {connect_data['response'][:300]}...")
            print(f"\n   💚 Consultation Status: FREE")
            print(f"   ♾️  Remaining: {connect_data['remaining_responses']}")
    
    print(f"\n{'█'*80}")
    print("█  ✅ JOURNEY COMPLETE!")
    print(f"{'█'*80}")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    print("\n" + "█"*80)
    print("█" + " "*78 + "█")
    print("█" + "  NYAYVIDHI LAWYER CONSULTATION API - USAGE EXAMPLES".center(78) + "█")
    print("█" + " "*78 + "█")
    print("█"*80)
    
    try:
        # Check if server is running
        example_health_check()
        
        # Get available categories
        example_get_categories()
        
        # Main flow: Ask query and get matched lawyers
        lawyer_id = example_ask_query()
        
        # Connect with the matched lawyer
        if lawyer_id:
            example_connect_lawyer(lawyer_id)
        
        # Get lawyers list
        example_get_lawyers()
        
        # Test category detection
        example_category_detection()
        
        # Complete user journey
        example_complete_journey()
        
        # Test rate limiting (comment out if you don't want to hit the limit)
        # example_rate_limiting()
        
        print("\n" + "█"*80)
        print("█" + " "*78 + "█")
        print("█" + "  ✅ ALL API EXAMPLES EXECUTED SUCCESSFULLY!".center(78) + "█")
        print("█" + " "*78 + "█")
        print("█"*80 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API server")
        print("   Please ensure the backend server is running:")
        print("   $ cd backend")
        print("   $ uvicorn main:app --reload --port 8001")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
