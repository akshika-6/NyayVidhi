"""
Comprehensive Test Suite for Lawyer Consultation System
Tests all components: Category Detection, Lawyer Matching, Response Generation
"""

import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from backend.services.category_detector import detect_category
from backend.services.lawyer_matcher import match_lawyers, format_matched_lawyers_response
from backend.services.response_generator import generate_lawyer_response, generate_quick_summary
from backend.services.fake_lawyer_db import get_all_lawyers

def print_section(title):
    """Print formatted section header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)

def test_category_detection():
    """Test category detection with various queries"""
    print_section("TEST 1: CATEGORY DETECTION")
    
    test_queries = [
        "My husband is asking for divorce without reason",
        "Someone hacked my Instagram account and posting fake content",
        "Builder not giving possession of flat after 3 years",
        "Boss terminated me without notice period, what to do?",
        "Cheque bounced, what is the legal process?",
        "My landlord is not returning my security deposit",
        "Can I get custody of my children after divorce?",
        "Online shopping fraud - ordered iPhone got a brick"
    ]
    
    for query in test_queries:
        print(f"\n📝 Query: {query}")
        result = detect_category(query)
        print(f"✅ Category: {result['category']}")
        print(f"⚡ Urgency: {result['urgency']}")
        print(f"🎯 Confidence: {result['confidence']}")

def test_lawyer_matching():
    """Test lawyer matching logic"""
    print_section("TEST 2: LAWYER MATCHING")
    
    test_cases = [
        {"category": "Family Law", "urgency": "High", "description": "Divorce case"},
        {"category": "Cyber Law", "urgency": "Medium", "description": "Instagram hack"},
        {"category": "Property Law", "urgency": "Low", "description": "Builder dispute"},
        {"category": "Labour Law", "urgency": "High", "description": "Wrongful termination"}
    ]
    
    for test in test_cases:
        print(f"\n📂 Category: {test['category']} | Urgency: {test['urgency']}")
        print(f"Description: {test['description']}")
        
        lawyers = match_lawyers(
            category=test['category'],
            urgency=test['urgency'],
            limit=3
        )
        
        print(f"\n🎯 Matched {len(lawyers)} lawyers:")
        for i, lawyer in enumerate(lawyers, 1):
            print(f"\n  {i}. {lawyer['full_name']}")
            print(f"     Score: {lawyer['match_score']:.1f}/100")
            print(f"     Specialization: {', '.join(lawyer['specialization'][:2])}")
            print(f"     Experience: {lawyer['experience_years']} years | Rating: {lawyer['rating']}⭐")
            print(f"     Availability: {lawyer['availability_status'].upper()}")
            print(f"     City: {lawyer['city']}")

def test_response_generation():
    """Test lawyer response generation"""
    print_section("TEST 3: RESPONSE GENERATION")
    
    test_cases = [
        {
            "query": "My husband is asking for divorce without any valid reason. What are my rights as a wife?",
            "category": "Family Law",
            "lawyer_id": None  # Will be selected from Family Law specialists
        },
        {
            "query": "Someone created fake Instagram profile with my photos. How to take legal action?",
            "category": "Cyber Law",
            "lawyer_id": None
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'─'*80}")
        print(f"Test Case {i}")
        print(f"{'─'*80}")
        print(f"Query: {test['query']}")
        print(f"Category: {test['category']}")
        
        # Find a suitable lawyer
        lawyers = match_lawyers(category=test['category'], limit=1)
        if lawyers:
            lawyer = lawyers[0]
            print(f"\nSelected Lawyer: {lawyer['full_name']}")
            print(f"Specialization: {', '.join(lawyer['specialization'])}")
            print(f"\n{'─'*80}")
            print("GENERATED LAWYER RESPONSE:")
            print(f"{'─'*80}")
            
            result = generate_lawyer_response(
                query=test['query'],
                category=test['category'],
                lawyer_id=lawyer['id']
            )
            
            if result['success']:
                print(f"\n{result['response']}")
                print(f"\n{'─'*80}")
                print(f"✅ Response generated successfully")
                print(f"📊 Is Free: {result['is_free']}")
                print(f"♾️  Remaining: {result['response_limit']}")
            else:
                print(f"❌ Error: {result.get('error')}")

def test_quick_summary():
    """Test quick AI summary generation"""
    print_section("TEST 4: QUICK SUMMARY GENERATION")
    
    test_queries = [
        ("My landlord is not returning security deposit", "Property Law", "Medium"),
        ("Need urgent bail for my brother arrested in assault case", "Criminal Law", "High"),
        ("Company not paying my pending salary", "Labour Law", "High")
    ]
    
    for query, category, urgency in test_queries:
        print(f"\n📝 Query: {query}")
        print(f"📂 Category: {category} | ⚡ Urgency: {urgency}")
        
        summary = generate_quick_summary(query, category, urgency)
        print(f"\n💬 AI Summary:")
        print(f"   {summary}")

def test_database():
    """Test fake lawyer database"""
    print_section("TEST 5: LAWYER DATABASE")
    
    lawyers = get_all_lawyers()
    print(f"\n📊 Total Lawyers: {len(lawyers)}")
    
    # Count by specialization
    specializations = {}
    cities = {}
    online_count = 0
    
    for lawyer in lawyers:
        for spec in lawyer['specialization']:
            specializations[spec] = specializations.get(spec, 0) + 1
        
        cities[lawyer['city']] = cities.get(lawyer['city'], 0) + 1
        
        if lawyer['availability_status'] == 'online':
            online_count += 1
    
    print(f"\n📍 Lawyers by City:")
    for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"   {city}: {count}")
    
    print(f"\n⚖️  Lawyers by Specialization:")
    for spec, count in sorted(specializations.items(), key=lambda x: x[1], reverse=True):
        print(f"   {spec}: {count}")
    
    print(f"\n🟢 Online Lawyers: {online_count}/{len(lawyers)}")
    
    # Show top rated lawyers
    print(f"\n⭐ Top 5 Rated Lawyers:")
    top_lawyers = sorted(lawyers, key=lambda x: x['rating'], reverse=True)[:5]
    for i, lawyer in enumerate(top_lawyers, 1):
        print(f"   {i}. {lawyer['full_name']} - {lawyer['rating']}⭐ ({lawyer['experience_years']} years)")

def test_complete_flow():
    """Test complete end-to-end flow"""
    print_section("TEST 6: COMPLETE END-TO-END FLOW")
    
    user_query = "My employer terminated me without proper notice period. I have been working for 5 years. What can I do?"
    
    print(f"🔵 USER QUERY:")
    print(f"   {user_query}\n")
    
    # Step 1: Detect category
    print("➡️  STEP 1: Detecting category...")
    category_result = detect_category(user_query)
    print(f"   ✅ Category: {category_result['category']}")
    print(f"   ⚡ Urgency: {category_result['urgency']}")
    print(f"   🎯 Confidence: {category_result['confidence']}\n")
    
    # Step 2: Generate quick summary
    print("➡️  STEP 2: Generating AI summary...")
    summary = generate_quick_summary(
        user_query,
        category_result['category'],
        category_result['urgency']
    )
    print(f"   💬 {summary}\n")
    
    # Step 3: Match lawyers
    print("➡️  STEP 3: Matching lawyers...")
    matched_lawyers = match_lawyers(
        category=category_result['category'],
        urgency=category_result['urgency'],
        limit=3
    )
    print(f"   ✅ Found {len(matched_lawyers)} matching lawyers\n")
    
    for i, lawyer in enumerate(matched_lawyers, 1):
        print(f"   {i}. {lawyer['full_name']}")
        print(f"      Score: {lawyer['match_score']:.1f} | Rating: {lawyer['rating']}⭐")
        print(f"      {lawyer['experience_years']} years | {lawyer['city']}")
        print()
    
    # Step 4: Generate response from top lawyer
    if matched_lawyers:
        print("➡️  STEP 4: Connecting with top lawyer...")
        top_lawyer = matched_lawyers[0]
        print(f"   🎯 Selected: {top_lawyer['full_name']}\n")
        
        result = generate_lawyer_response(
            query=user_query,
            category=category_result['category'],
            lawyer_id=top_lawyer['id']
        )
        
        if result['success']:
            print("   " + "─"*76)
            print("   LAWYER RESPONSE:")
            print("   " + "─"*76)
            # Indent the response
            response_lines = result['response'].split('\n')
            for line in response_lines:
                print(f"   {line}")
            print("   " + "─"*76)
            print(f"\n   ✅ Consultation complete!")
            print(f"   💚 Is Free: {result['is_free']}")
            print(f"   ♾️  Remaining Responses: {result['response_limit']}")


if __name__ == "__main__":
    print("\n" + "█"*80)
    print("█" + " "*78 + "█")
    print("█" + "  NYAYVIDHI LAWYER CONSULTATION SYSTEM - COMPREHENSIVE TEST SUITE".center(78) + "█")
    print("█" + " "*78 + "█")
    print("█"*80)
    
    try:
        test_database()
        test_category_detection()
        test_lawyer_matching()
        test_quick_summary()
        test_response_generation()
        test_complete_flow()
        
        print("\n" + "█"*80)
        print("█" + " "*78 + "█")
        print("█" + "  ✅ ALL TESTS COMPLETED SUCCESSFULLY!".center(78) + "█")
        print("█" + " "*78 + "█")
        print("█"*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
