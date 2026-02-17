"""
Fake Lawyer Database for Development Environment
Stores 20 realistic dummy lawyer profiles for testing and development.
In production, this will be replaced with real verified lawyers from a database.
"""

import uuid
from datetime import datetime

# Environment configuration
ENV_MODE = "development"  # Change to "production" when ready

# Dummy lawyer profiles (20 lawyers)
FAKE_LAWYERS = [
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Rajesh Kumar",
        "specialization": ["Criminal Law", "NI Act", "Property Law"],
        "city": "Delhi",
        "experience_years": 15,
        "bio": "Senior advocate specializing in criminal defense and property disputes. Successfully handled 500+ cases in Delhi High Court.",
        "rating": 4.8,
        "languages": ["Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "D/12345/2009",
        "profile_image": "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1e40af&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["10:00 AM - 10:30 AM", "12:00 PM - 12:30 PM", "4:00 PM - 4:30 PM"]
            },
            {
                "date": "2026-02-19",
                "slots": ["11:00 AM - 11:30 AM", "2:00 PM - 2:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Priya Sharma",
        "specialization": ["Family Law", "Domestic Violence", "Child Custody"],
        "city": "Mumbai",
        "experience_years": 12,
        "bio": "Compassionate family law expert with focus on women's rights and child welfare. Over 400 successful cases.",
        "rating": 4.9,
        "languages": ["Hindi", "English", "Marathi"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "M/23456/2012",
        "profile_image": "https://ui-avatars.com/api/?name=Priya+Sharma&background=7c3aed&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["9:00 AM - 9:30 AM", "11:00 AM - 11:30 AM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Vikram Singh",
        "specialization": ["Cyber Law", "Corporate Law", "Consumer Law"],
        "city": "Bangalore",
        "experience_years": 8,
        "bio": "Tech-savvy lawyer specializing in cyber crimes and corporate litigation. Regular speaker at legal tech conferences.",
        "rating": 4.7,
        "languages": ["English", "Hindi", "Kannada"],
        "is_online": False,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "B/34567/2016",
        "profile_image": "https://ui-avatars.com/api/?name=Vikram+Singh&background=059669&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["3:00 PM - 3:30 PM", "5:00 PM - 5:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Meera Iyer",
        "specialization": ["Labour Law", "Consumer Law", "Corporate Law"],
        "city": "Chennai",
        "experience_years": 10,
        "bio": "Expert in employment disputes and labour rights. Successfully represented employees in 200+ workplace cases.",
        "rating": 4.6,
        "languages": ["Tamil", "English", "Hindi"],
        "is_online": True,
        "availability_status": "offline",
        "is_verified": True,
        "bar_council_id": "C/45678/2014",
        "profile_image": "https://ui-avatars.com/api/?name=Meera+Iyer&background=dc2626&color=fff",
        "available_slots": []
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Arjun Mehta",
        "specialization": ["Property Law", "Corporate Law", "NI Act"],
        "city": "Ahmedabad",
        "experience_years": 18,
        "bio": "Veteran property lawyer with expertise in real estate transactions and title disputes. 25+ years at the bar.",
        "rating": 4.9,
        "languages": ["Gujarati", "Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "A/56789/2006",
        "profile_image": "https://ui-avatars.com/api/?name=Arjun+Mehta&background=ea580c&color=fff",
        "available_slots": [
            {
                "date": "2026-02-19",
                "slots": ["10:00 AM - 10:30 AM", "1:00 PM - 1:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Sneha Desai",
        "specialization": ["Family Law", "Child Custody", "Domestic Violence"],
        "city": "Pune",
        "experience_years": 7,
        "bio": "Dedicated family law practitioner focusing on amicable dispute resolution and mediation services.",
        "rating": 4.5,
        "languages": ["Marathi", "Hindi", "English"],
        "is_online": False,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "P/67890/2017",
        "profile_image": "https://ui-avatars.com/api/?name=Sneha+Desai&background=8b5cf6&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["2:30 PM - 3:00 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Karan Malhotra",
        "specialization": ["Criminal Law", "Cyber Law", "Consumer Law"],
        "city": "Hyderabad",
        "experience_years": 14,
        "bio": "Criminal defense specialist with strong track record in white-collar crimes and cyber offences.",
        "rating": 4.8,
        "languages": ["Telugu", "Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "H/78901/2010",
        "profile_image": "https://ui-avatars.com/api/?name=Karan+Malhotra&background=0891b2&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["10:00 AM - 10:30 AM", "12:00 PM - 12:30 PM", "4:00 PM - 4:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Anjali Reddy",
        "specialization": ["Consumer Law", "Property Law", "Civil Law"],
        "city": "Vizag",
        "experience_years": 9,
        "bio": "Consumer rights advocate with expertise in RERA complaints and consumer forum cases.",
        "rating": 4.6,
        "languages": ["Telugu", "English"],
        "is_online": False,
        "availability_status": "offline",
        "is_verified": True,
        "bar_council_id": "V/89012/2015",
        "profile_image": "https://ui-avatars.com/api/?name=Anjali+Reddy&background=be123c&color=fff",
        "available_slots": []
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Ramesh Pillai",
        "specialization": ["Labour Law", "Corporate Law", "Contract Law"],
        "city": "Kochi",
        "experience_years": 20,
        "bio": "Senior counsel with vast experience in labor disputes and corporate advisory. Former legal advisor to major PSUs.",
        "rating": 4.9,
        "languages": ["Malayalam", "English", "Hindi"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "K/90123/2004",
        "profile_image": "https://ui-avatars.com/api/?name=Ramesh+Pillai&background=16a34a&color=fff",
        "available_slots": [
            {
                "date": "2026-02-19",
                "slots": ["9:30 AM - 10:00 AM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Kavita Nair",
        "specialization": ["Family Law", "Criminal Law", "Domestic Violence"],
        "city": "Kolkata",
        "experience_years": 11,
        "bio": "Passionate advocate for women's rights and domestic violence cases. Regular legal aid volunteer.",
        "rating": 4.7,
        "languages": ["Bengali", "Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "KL/01234/2013",
        "profile_image": "https://ui-avatars.com/api/?name=Kavita+Nair&background=9333ea&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["1:00 PM - 1:30 PM", "3:00 PM - 3:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Sanjay Gupta",
        "specialization": ["NI Act", "Criminal Law", "Property Law"],
        "city": "Jaipur",
        "experience_years": 16,
        "bio": "Expert in Negotiable Instruments Act cases with 90% success rate in cheque bounce matters.",
        "rating": 4.8,
        "languages": ["Hindi", "English"],
        "is_online": False,
        "availability_status": "offline",
        "is_verified": True,
        "bar_council_id": "J/12340/2008",
        "profile_image": "https://ui-avatars.com/api/?name=Sanjay+Gupta&background=ca8a04&color=fff",
        "available_slots": []
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Deepika Rao",
        "specialization": ["Cyber Law", "Corporate Law", "IPR"],
        "city": "Bangalore",
        "experience_years": 6,
        "bio": "Young and dynamic lawyer specializing in intellectual property and digital law. Tech startup advisor.",
        "rating": 4.5,
        "languages": ["English", "Kannada", "Hindi"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "B/23451/2018",
        "profile_image": "https://ui-avatars.com/api/?name=Deepika+Rao&background=db2777&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["6:00 PM - 6:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Rahul Joshi",
        "specialization": ["Property Law", "Family Law", "Civil Law"],
        "city": "Nagpur",
        "experience_years": 13,
        "bio": "Experienced in property partition cases and family settlements. Mediator certified by Supreme Court.",
        "rating": 4.7,
        "languages": ["Marathi", "Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "N/34562/2011",
        "profile_image": "https://ui-avatars.com/api/?name=Rahul+Joshi&background=0284c7&color=fff",
        "available_slots": [
            {
                "date": "2026-02-19",
                "slots": ["11:00 AM - 11:30 AM", "1:00 PM - 1:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Nisha Verma",
        "specialization": ["Consumer Law", "Civil Law", "RERA"],
        "city": "Lucknow",
        "experience_years": 8,
        "bio": "Consumer forum specialist with focus on real estate disputes and banking complaints.",
        "rating": 4.6,
        "languages": ["Hindi", "English"],
        "is_online": False,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "L/45673/2016",
        "profile_image": "https://ui-avatars.com/api/?name=Nisha+Verma&background=15803d&color=fff",
        "available_slots": []
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Anil Kapoor",
        "specialization": ["Criminal Law", "NI Act", "Civil Law"],
        "city": "Chandigarh",
        "experience_years": 19,
        "bio": "Senior criminal lawyer with extensive High Court experience. Known for strategic case management.",
        "rating": 4.9,
        "languages": ["Punjabi", "Hindi", "English"],
        "is_online": True,
        "availability_status": "offline",
        "is_verified": True,
        "bar_council_id": "CH/56784/2005",
        "profile_image": "https://ui-avatars.com/api/?name=Anil+Kapoor&background=b91c1c&color=fff",
        "available_slots": [
            {
                "date": "2026-02-20",
                "slots": ["10:00 AM - 10:30 AM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Pooja Saxena",
        "specialization": ["Child Custody", "Family Law", "Domestic Violence"],
        "city": "Delhi",
        "experience_years": 10,
        "bio": "Compassionate family court lawyer specializing in child welfare and custody battles.",
        "rating": 4.8,
        "languages": ["Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "D/67895/2014",
        "profile_image": "https://ui-avatars.com/api/?name=Pooja+Saxena&background=a21caf&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["11:30 AM - 12:00 PM", "4:30 PM - 5:00 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Suresh Naidu",
        "specialization": ["Labour Law", "Corporate Law", "Contract Law"],
        "city": "Bangalore",
        "experience_years": 17,
        "bio": "Corporate and labor law expert. Regular consultant for startups and SMEs on compliance matters.",
        "rating": 4.7,
        "languages": ["Kannada", "English", "Tamil"],
        "is_online": False,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "B/78906/2007",
        "profile_image": "https://ui-avatars.com/api/?name=Suresh+Naidu&color=fff&background=0d9488",
        "available_slots": []
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Ritu Agarwal",
        "specialization": ["Property Law", "NI Act", "Consumer Law"],
        "city": "Indore",
        "experience_years": 12,
        "bio": "Property documentation expert with strong litigation skills. Handles registry and title disputes.",
        "rating": 4.6,
        "languages": ["Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "I/89017/2012",
        "profile_image": "https://ui-avatars.com/api/?name=Ritu+Agarwal&background=f59e0b&color=fff",
        "available_slots": [
            {
                "date": "2026-02-19",
                "slots": ["12:00 PM - 12:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Harish Bhatia",
        "specialization": ["Cyber Law", "Criminal Law", "IPR"],
        "city": "Noida",
        "experience_years": 9,
        "bio": "Cyber crime investigator and legal consultant. Works closely with law enforcement on digital forensics.",
        "rating": 4.7,
        "languages": ["Hindi", "English"],
        "is_online": True,
        "availability_status": "online",
        "is_verified": True,
        "bar_council_id": "N/90128/2015",
        "profile_image": "https://ui-avatars.com/api/?name=Harish+Bhatia&background=4f46e5&color=fff",
        "available_slots": [
            {
                "date": "2026-02-18",
                "slots": ["5:00 PM - 5:30 PM", "6:00 PM - 6:30 PM"]
            }
        ]
    },
    {
        "id": str(uuid.uuid4()),
        "full_name": "Adv. Manisha Choudhary",
        "specialization": ["Family Law", "Consumer Law", "Civil Law"],
        "city": "Surat",
        "experience_years": 11,
        "bio": "General practice lawyer with focus on family matters and consumer disputes. Known for client-centric approach.",
        "rating": 4.5,
        "languages": ["Gujarati", "Hindi", "English"],
        "is_online": False,
        "availability_status": "offline",
        "is_verified": True,
        "bar_council_id": "S/01239/2013",
        "profile_image": "https://ui-avatars.com/api/?name=Manisha+Choudhary&background=ec4899&color=fff",
        "available_slots": []
    }
]


def get_all_lawyers():
    """Returns all fake lawyer profiles."""
    if ENV_MODE == "development":
        return FAKE_LAWYERS
    else:
        # In production, fetch from real database
        raise NotImplementedError("Production database not configured yet")


def get_lawyer_by_id(lawyer_id: str):
    """Returns a specific lawyer by ID."""
    if ENV_MODE == "development":
        for lawyer in FAKE_LAWYERS:
            if lawyer["id"] == lawyer_id:
                return lawyer
        return None
    else:
        raise NotImplementedError("Production database not configured yet")


def get_lawyers_by_specialization(specialization: str):
    """Returns lawyers who specialize in a given area."""
    if ENV_MODE == "development":
        matched = []
        for lawyer in FAKE_LAWYERS:
            if specialization in lawyer["specialization"]:
                matched.append(lawyer)
        return matched
    else:
        raise NotImplementedError("Production database not configured yet")


def get_lawyers_by_city(city: str):
    """Returns lawyers in a specific city."""
    if ENV_MODE == "development":
        return [lawyer for lawyer in FAKE_LAWYERS if lawyer["city"].lower() == city.lower()]
    else:
        raise NotImplementedError("Production database not configured yet")


def get_available_categories():
    """Returns all unique legal specializations."""
    categories = set()
    for lawyer in FAKE_LAWYERS:
        categories.update(lawyer["specialization"])
    return sorted(list(categories))
