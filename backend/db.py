import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = "nyayvidhi"

client = None
db = None

def get_db():
    global client, db
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DB_NAME]
    return db
