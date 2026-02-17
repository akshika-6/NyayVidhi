# 🏛️ NyayVidhi Lawyer Consultation System

## Overview
**India's Free Legal Awareness & Guidance Platform**

A development-ready fake lawyer database system that provides:
- ✅ 20 realistic dummy lawyer profiles
- ✅ Intelligent category detection
- ✅ Smart lawyer matching
- ✅ AI-powered legal responses
- ✅ Unlimited FREE consultations
- ✅ Rate limiting (5 queries/day)
- ✅ Production-ready architecture

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     USER QUERY                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ├──► Rate Limiting Check (5/day)
                      │
          ┌───────────▼──────────┐
          │  Category Detector   │
          │  - Keyword matching  │
          │  - LLM fallback      │
          └───────────┬──────────┘
                      │
          ┌───────────▼──────────┐
          │   Lawyer Matcher     │
          │  - Filter by spec    │
          │  - Score & rank      │
          │  - Return top 3      │
          └───────────┬──────────┘
                      │
          ┌───────────▼──────────┐
          │  Response Generator  │
          │  - Professional tone │
          │  - India-specific    │
          │  - Structured format │
          └─────────────────────┘
```

### File Structure

```
backend/
├── services/
│   ├── fake_lawyer_db.py         # 20 dummy lawyer profiles
│   ├── category_detector.py       # Legal category detection
│   ├── lawyer_matcher.py          # Matching & scoring logic
│   └── response_generator.py      # AI response generation
│
├── api/
│   └── lawyer_routes.py           # API endpoints with rate limiting
│
└── main.py                        # FastAPI app with routes

test_lawyer_system.py              # Comprehensive test suite
```

---

## 📊 Lawyer Database

### Database Schema

```python
{
    "id": "UUID",
    "full_name": "Adv. Name",
    "specialization": ["Criminal Law", "NI Act"],
    "city": "Delhi",
    "experience_years": 15,
    "bio": "Description...",
    "rating": 4.8,
    "languages": ["Hindi", "English"],
    "availability_status": "online",
    "is_verified": true,
    "bar_council_id": "D/12345/2009",
    "profile_image": "URL"
}
```

### Legal Categories (10+)

1. **Criminal Law** - Murder, theft, assault, FIR, bail
2. **Family Law** - Divorce, marriage, alimony, maintenance
3. **Child Custody** - Custody battles, visitation rights
4. **Domestic Violence** - PWDVA, 498A, protection orders
5. **Property Law** - Land disputes, registry, inheritance
6. **Cyber Law** - Hacking, online fraud, IT Act
7. **Corporate Law** - Company formation, compliance, GST
8. **Consumer Law** - Defective products, refunds, consumer forum
9. **Labour Law** - Termination, salary disputes, PF/ESI
10. **NI Act** - Cheque bounce, Section 138

### Database Statistics

- **Total Lawyers**: 20
- **Online Availability**: 15/20 (75%)
- **Cities Covered**: Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Jaipur, and more
- **Average Rating**: 4.7/5.0
- **Average Experience**: 12.5 years

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8001
```

### 1. Ask Legal Query (Main Endpoint)

**POST** `/lawyer/ask`

Detects category, matches lawyers, returns AI summary with top 3 lawyers.

**Request:**
```json
{
  "user_query": "My husband is asking for divorce without reason",
  "city": "Mumbai" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "query": "My husband is asking for divorce without reason",
  "ai_summary": "I understand you're facing a divorce situation...",
  "category": "Family Law",
  "urgency": "Medium",
  "confidence": 0.85,
  "matched_lawyers": [
    {
      "id": "uuid",
      "name": "Adv. Priya Sharma",
      "specialization": ["Family Law", "Domestic Violence"],
      "city": "Mumbai",
      "experience": "12 years",
      "rating": 4.9,
      "languages": ["Hindi", "English", "Marathi"],
      "availability": "online",
      "bio": "Compassionate family law expert...",
      "profile_image": "URL",
      "match_score": 95.0
    }
    // ... 2 more lawyers
  ],
  "total_lawyers": 3,
  "rate_limit": {
    "queries_used": 1,
    "queries_remaining": 4
  },
  "is_free": true,
  "message": "Connect with any lawyer for FREE unlimited consultation"
}
```

**Rate Limit:** 5 queries per day per IP
**Error (429):** Daily limit exceeded

---

### 2. Connect with Lawyer

**POST** `/lawyer/connect`

Get professional legal response from a specific lawyer.

**Request:**
```json
{
  "user_query": "What documents do I need for divorce?",
  "lawyer_id": "uuid-of-lawyer",
  "category": "Family Law",
  "conversation_history": [ // Optional
    {
      "role": "user",
      "content": "Previous message..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "**Acknowledgment**: I understand your concern...\n\n**Legal Context**: Under the Hindu Marriage Act, 1955...\n\n**Preliminary Guidance**:\n- Document A\n- Document B\n\n**Next Steps**:\n1. Gather documents\n2. Consult lawyer\n\n**Documentation**: Marriage certificate, proof of residence...\n\n**Disclaimer**: This is preliminary legal guidance provided through NyayVidhi...",
  "lawyer_info": {
    "id": "uuid",
    "name": "Adv. Priya Sharma",
    "specialization": ["Family Law"],
    "experience": "12 years",
    "city": "Mumbai",
    "rating": 4.9,
    "profile_image": "URL"
  },
  "category": "Family Law",
  "is_free": true,
  "remaining_responses": "Unlimited",
  "timestamp": "2026-02-17T10:30:00"
}
```

**No rate limit on responses** - Unlimited FREE consultations!

---

### 3. Get All Lawyers

**GET** `/lawyer/lawyers?specialization=Family+Law&city=Delhi&limit=10`

**Query Parameters:**
- `specialization` (optional): Filter by legal specialization
- `city` (optional): Filter by city
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "lawyers": [/* Array of lawyer profiles */],
  "total": 5
}
```

---

### 4. Get Lawyer Details

**GET** `/lawyer/lawyer/{lawyer_id}`

Get detailed information about a specific lawyer.

**Response:**
```json
{
  "success": true,
  "lawyer": {/* Full lawyer profile */}
}
```

---

### 5. Get Legal Categories

**GET** `/lawyer/categories`

Get all available legal categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    "Criminal Law",
    "Family Law",
    "Child Custody",
    "Domestic Violence",
    "Property Law",
    "Cyber Law",
    "Corporate Law",
    "Consumer Law",
    "Labour Law",
    "NI Act"
  ],
  "total": 10
}
```

---

### 6. Health Check

**GET** `/lawyer/health`

Check if lawyer consultation service is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "Lawyer Consultation",
  "is_free": true,
  "max_queries_per_day": 5,
  "environment": "development"
}
```

---

## 🎯 Matching Algorithm

### Scoring System (0-100 points)

| Factor | Points | Details |
|--------|--------|---------|
| **Specialization Match** | 40 | Primary specialization: 40pts<br>Secondary match: 30pts |
| **Availability** | 20 | Online: 20pts<br>Offline: 5pts<br>High urgency bonus: +5pts |
| **Rating** | 20 | Converted from 4.0-5.0 scale |
| **Experience** | 20 | Capped at 20 years<br>1 year = 1 point |

### Example Score Calculation

**Adv. Priya Sharma for Family Law (High Urgency)**
- ✅ Primary specialization: Family Law = **40 pts**
- ✅ Online availability + urgency bonus = **25 pts**
- ✅ Rating 4.9/5.0 = **18 pts**
- ✅ 12 years experience = **12 pts**
- **Total: 95/100**

---

## 🔐 Rate Limiting

### Configuration
```python
MAX_QUERIES_PER_DAY = 5
```

### How It Works
1. Uses client IP address as identifier
2. Resets daily at midnight
3. Returns 429 error when limit exceeded
4. Shows remaining queries in each response

### Rate Limit Response Headers
```json
{
  "queries_used": 3,
  "queries_remaining": 2
}
```

### Error Response (429)
```json
{
  "error": "Daily query limit reached",
  "message": "You have reached the maximum of 5 queries per day. Please try again tomorrow.",
  "queries_used": 5,
  "queries_remaining": 0,
  "reset_time": "2026-02-18T00:00:00"
}
```

**Note:** Rate limit applies only to `/lawyer/ask` endpoint, not to `/lawyer/connect`

---

## 🚀 Getting Started

### 1. Start Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8001
```

### 2. Test API

```bash
# Test category detection
curl -X POST http://localhost:8001/lawyer/ask \
  -H "Content-Type: application/json" \
  -d '{"user_query": "My husband wants divorce"}'

# Test lawyer connection
curl -X POST http://localhost:8001/lawyer/connect \
  -H "Content-Type: application/json" \
  -d '{
    "user_query": "What documents needed for divorce?",
    "lawyer_id": "UUID",
    "category": "Family Law"
  }'
```

### 3. Run Test Suite

```bash
python test_lawyer_system.py
```

---

## 🧪 Testing

The comprehensive test suite covers:

1. **Database Validation** - 20 lawyers, specializations, cities
2. **Category Detection** - 8+ test queries across categories
3. **Lawyer Matching** - Scoring algorithm, top 3 selection
4. **Quick Summary** - AI-generated summaries
5. **Response Generation** - Professional legal responses
6. **End-to-End Flow** - Complete user journey

**Run Tests:**
```bash
python test_lawyer_system.py
```

**All tests passed successfully ✅**

---

## 📝 Response Format

### Lawyer Response Structure

```markdown
**Acknowledgment**: 
Brief empathetic acknowledgment of the issue.

**Legal Context**: 
Applicable Indian law, acts, sections (IPC, BNS, Family Law Acts, IT Act, etc.)

**Preliminary Guidance**:
• Point 1: Clear legal guidance
• Point 2: Practical advice
• Point 3: User's rights

**Next Steps**:
1. Immediate action 1
2. Immediate action 2
3. What to do next

**Documentation**:
Gather these documents:
- Document 1
- Document 2
- Document 3

**Disclaimer**:
"This is preliminary legal guidance provided through NyayVidhi. For personalized advice specific to your case, please consult in detail or visit a lawyer's chamber with all relevant documents."
```

---

## 🔄 Production Migration Path

### Environment Toggle

```python
# backend/services/fake_lawyer_db.py
ENV_MODE = "development"  # Change to "production"
```

### Production Checklist

1. **Database Integration**
   - Replace `FAKE_LAWYERS` with SQLAlchemy/MongoDB queries
   - Implement lawyer verification system
   - Add real Bar Council ID validation

2. **Authentication**
   - Add user registration/login
   - Replace IP-based rate limiting with user_id
   - Implement JWT tokens

3. **Rate Limiting Enhancement**
   - Use Redis for distributed rate limiting
   - Add tier-based limits (free vs premium)
   - Implement queue system for high load

4. **Payment Integration** (if adding paid tier)
   - Razorpay/Stripe integration
   - Subscription management
   - Usage tracking

5. **Lawyer Verification**
   - Bar Council API integration
   - Document verification
   - Background checks

6. **Real-time Features**
   - WebSocket for live chat
   - Notification system
   - Appointment scheduling

---

## 🎨 Frontend Integration Example

### React Component

```jsx
// Fetch matched lawyers
const askLegalQuery = async (query) => {
  const response = await fetch('http://localhost:8001/lawyer/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_query: query })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Display AI summary
    setAiSummary(data.ai_summary);
    
    // Display matched lawyers
    setLawyers(data.matched_lawyers);
    
    // Show rate limit info
    setQueriesRemaining(data.rate_limit.queries_remaining);
  }
};

// Connect with lawyer
const connectWithLawyer = async (lawyerId, query) => {
  const response = await fetch('http://localhost:8001/lawyer/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_query: query,
      lawyer_id: lawyerId,
      category: selectedCategory
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Display lawyer response (supports markdown)
    setLawyerResponse(data.response);
    setLawyerInfo(data.lawyer_info);
  }
};
```

---

## 🌟 Key Features

### ✅ Implemented

- [x] 20 realistic dummy lawyers with diverse specializations
- [x] 10+ legal categories with intelligent detection
- [x] Keyword-based + LLM fallback category detection
- [x] Smart lawyer matching with scoring algorithm
- [x] Professional AI-generated legal responses
- [x] Unlimited FREE lawyer consultations
- [x] Rate limiting (5 queries/day)
- [x] City-based filtering
- [x] Availability status (online/offline)
- [x] Response quality validation
- [x] Comprehensive test suite
- [x] Production-ready architecture
- [x] API documentation

### 🚧 Future Enhancements

- [ ] Real lawyer database integration
- [ ] User authentication system
- [ ] Live chat with WebSocket
- [ ] Appointment scheduling
- [ ] Document upload system
- [ ] Video consultation
- [ ] Payment gateway (for premium)
- [ ] Lawyer dashboard
- [ ] Review and rating system
- [ ] Case tracking

---

## 📚 Tech Stack

- **Backend**: FastAPI (Python)
- **LLM**: Groq (Llama 3.3 70B + Llama 3.1 8B)
- **Database**: In-memory (dev) → PostgreSQL/MongoDB (prod)
- **Rate Limiting**: In-memory dict (dev) → Redis (prod)
- **Testing**: Python unittest framework

---

## 🛡️ Important Notes

### ⚠️ Development Mode

- This system uses **FAKE lawyer profiles** for development
- Lawyers are simulated using AI (LLM)
- Bar Council IDs are placeholder values
- **DO NOT** indicate to users that lawyers are fake in the API response

### ⚠️ Legal Disclaimer

All responses include the mandatory disclaimer:

> "This is preliminary legal guidance provided through NyayVidhi. For personalized advice specific to your case, please consult in detail or visit a lawyer's chamber with all relevant documents."

### ⚠️ Rate Limiting Necessity

Even though the platform is FREE, rate limiting is essential to:
- Prevent spam and abuse
- Control API costs (Groq LLM calls)
- Ensure fair usage
- Maintain service quality

---

## 🤝 Contributing

This is a development-only system. For production deployment:
1. Replace fake database with real verified lawyers
2. Implement proper authentication
3. Add payment integration (if needed)
4. Use Redis for rate limiting
5. Add real Bar Council verification

---

## 📞 Support

For issues or questions:
- Check API documentation above
- Run test suite to verify functionality
- Review error responses in API

---

## 📄 License

Part of NyayVidhi Legal AI Platform - India's Free Legal Awareness & Guidance Platform

---

**Built with ❤️ for making legal help accessible to all Indians**
