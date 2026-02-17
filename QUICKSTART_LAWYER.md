# 🚀 Quick Start Guide - NyayVidhi Lawyer Consultation

## ⚡ 5-Minute Setup

### 1. Start Backend Server
```bash
cd backend
uvicorn main:app --reload --port 8001
```

Server will start at: `http://localhost:8001`

### 2. Test the System
```bash
# Run comprehensive tests
python test_lawyer_system.py

# Test API endpoints
python test_lawyer_api.py
```

### 3. Check Available Endpoints
Open: `http://localhost:8001/docs` (FastAPI auto-generated docs)

---

## 🔥 Most Important Endpoints

### 1️⃣ Ask Legal Query (Main Endpoint)
```bash
POST http://localhost:8001/lawyer/ask
```

**Use Case:** User asks a legal question, system detects category and matches top 3 lawyers

**Example:**
```json
{
  "user_query": "My husband wants divorce",
  "city": "Mumbai"
}
```

**Returns:**
- AI summary
- Legal category
- Urgency level
- Top 3 matched lawyers with scores
- Rate limit info

---

### 2️⃣ Connect with Lawyer
```bash
POST http://localhost:8001/lawyer/connect
```

**Use Case:** User connects with a specific lawyer to get professional legal response

**Example:**
```json
{
  "user_query": "What documents needed for divorce?",
  "lawyer_id": "uuid-from-step-1",
  "category": "Family Law"
}
```

**Returns:**
- Professional legal guidance (structured)
- Lawyer details
- FREE unlimited responses

---

## 📊 Key Features

| Feature | Status | Details |
|---------|--------|---------|
| Fake Lawyer Database | ✅ | 20 lawyers, 10+ specializations |
| Category Detection | ✅ | Keyword + LLM fallback |
| Lawyer Matching | ✅ | Score-based (0-100) |
| AI Responses | ✅ | Professional, India-specific |
| Rate Limiting | ✅ | 5 queries/day per IP |
| Unlimited Responses | ✅ | FREE consultations |
| Production Ready | ✅ | Modular, scalable architecture |

---

## 🎯 Usage Flow

```
USER QUERY
    ↓
[Rate Limit Check] → 5/day
    ↓
[Category Detection] → "Family Law"
    ↓
[Lawyer Matching] → Top 3 lawyers (scored)
    ↓
[AI Summary] → Quick acknowledgment
    ↓
USER SELECTS LAWYER
    ↓
[Connect Endpoint] → Professional legal response
    ↓
UNLIMITED FREE RESPONSES
```

---

## 📁 File Structure

```
backend/
├── services/
│   ├── fake_lawyer_db.py          ← 20 dummy lawyers
│   ├── category_detector.py        ← Detects legal category
│   ├── lawyer_matcher.py           ← Matches & scores lawyers
│   └── response_generator.py       ← Generates AI responses
│
├── api/
│   └── lawyer_routes.py            ← All API endpoints
│
└── main.py                         ← FastAPI app (updated)

test_lawyer_system.py               ← Comprehensive tests
test_lawyer_api.py                  ← API usage examples
LAWYER_SYSTEM_DOCS.md               ← Full documentation
```

---

## 🧪 Quick Test Examples

### Test 1: Simple Query
```bash
curl -X POST http://localhost:8001/lawyer/ask \
  -H "Content-Type: application/json" \
  -d '{"user_query": "Cheque bounced what to do?"}'
```

### Test 2: With City Filter
```bash
curl -X POST http://localhost:8001/lawyer/ask \
  -H "Content-Type: application/json" \
  -d '{"user_query": "Need divorce lawyer", "city": "Delhi"}'
```

### Test 3: Get Categories
```bash
curl http://localhost:8001/lawyer/categories
```

### Test 4: Health Check
```bash
curl http://localhost:8001/lawyer/health
```

---

## 🔐 Rate Limiting

| Parameter | Value |
|-----------|-------|
| Max queries per day | 5 |
| Per | IP address |
| Resets | Daily at midnight |
| Applies to | `/lawyer/ask` only |
| Responses | Unlimited (FREE) |

**Note:** `/lawyer/connect` has NO rate limit - unlimited responses!

---

## 📊 Lawyer Database Stats

| Metric | Count |
|--------|-------|
| Total Lawyers | 20 |
| Online Lawyers | 15 (75%) |
| Cities Covered | 15+ |
| Specializations | 12 |
| Avg Rating | 4.7/5.0 |
| Avg Experience | 12.5 years |

---

## 🎨 Legal Categories

1. **Criminal Law** - FIR, bail, assault, murder, theft
2. **Family Law** - Divorce, alimony, maintenance
3. **Child Custody** - Custody battles, visitation
4. **Domestic Violence** - 498A, PWDVA
5. **Property Law** - Land disputes, registry
6. **Cyber Law** - Hacking, online fraud, IT Act
7. **Corporate Law** - Company, GST, compliance
8. **Consumer Law** - Defective products, refunds
9. **Labour Law** - Termination, salary disputes
10. **NI Act** - Cheque bounce, Section 138

---

## 🚨 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | All good! |
| 400 | Bad Request | Check query format |
| 404 | Not Found | Lawyer doesn't exist |
| 429 | Rate Limit | Wait until tomorrow |
| 500 | Server Error | Check logs |

---

## 🔄 Production Migration

To switch from development to production:

### Step 1: Update Environment
```python
# backend/services/fake_lawyer_db.py
ENV_MODE = "production"  # Change from "development"
```

### Step 2: Replace Functions
Replace these functions in `fake_lawyer_db.py`:
- `get_all_lawyers()` → Fetch from real database
- `get_lawyer_by_id()` → Query actual lawyer table
- `get_lawyers_by_specialization()` → Filter real data

### Step 3: Add Features
- User authentication (JWT)
- Redis for rate limiting
- PostgreSQL/MongoDB for lawyers
- Bar Council verification
- Payment integration (if paid tier)

---

## 💡 Tips

### For Testing
- Use `test_lawyer_system.py` for backend logic
- Use `test_lawyer_api.py` for API integration
- Check `/docs` for interactive API testing

### For Frontend Integration
```javascript
// Simple fetch example
const response = await fetch('http://localhost:8001/lawyer/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    user_query: "My legal question" 
  })
});

const data = await response.json();
console.log(data.matched_lawyers);
```

### For Rate Limit Handling
```javascript
if (response.status === 429) {
  const error = await response.json();
  alert(error.detail.message);
  // Show reset time: error.detail.reset_time
}
```

---

## ✅ Verification Checklist

Before deploying:

- [ ] Backend runs without errors (`uvicorn main:app`)
- [ ] All tests pass (`python test_lawyer_system.py`)
- [ ] API endpoints respond correctly
- [ ] Rate limiting works (try 6 requests)
- [ ] Category detection works for sample queries
- [ ] Lawyer matching returns relevant results
- [ ] AI responses are professional and formatted
- [ ] CORS configured for your frontend
- [ ] Environment variables loaded (GROQ_API_KEY)
- [ ] Documentation reviewed

---

## 🆘 Troubleshooting

### Problem: "GROQ_API_KEY not found"
**Solution:** Load environment variables
```python
from dotenv import load_dotenv
load_dotenv()
```

### Problem: "Cannot connect to server"
**Solution:** Start backend server
```bash
cd backend
uvicorn main:app --reload --port 8001
```

### Problem: "No lawyers matched"
**Solution:** Check category name spelling or expand search

### Problem: "Rate limit exceeded"
**Solution:** 
- Wait 24 hours for reset
- OR temporarily increase `MAX_QUERIES_PER_DAY` in `lawyer_routes.py`

---

## 📚 Additional Resources

- **Full Documentation**: `LAWYER_SYSTEM_DOCS.md`
- **API Examples**: `test_lawyer_api.py`
- **System Tests**: `test_lawyer_system.py`
- **Interactive Docs**: `http://localhost:8001/docs`

---

## 🎯 Next Steps

1. ✅ System is fully functional in development mode
2. ⏭️ Test with frontend integration
3. ⏭️ Add user authentication (if needed)
4. ⏭️ Replace with real lawyer database
5. ⏭️ Deploy to production

---

**🎉 You're all set! The lawyer consultation system is ready to use.**

For detailed documentation, see: [LAWYER_SYSTEM_DOCS.md](./LAWYER_SYSTEM_DOCS.md)
