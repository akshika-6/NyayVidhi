from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from backend.core.auth import get_password_hash, verify_password, create_access_token
import json
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

USERS_FILE = "users.json"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    preferred_language: str = "English"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

@router.post("/signup")
async def signup(user_data: UserCreate):
    users = load_users()
    if user_data.email in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)

    users[user_data.email] = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "preferred_language": user_data.preferred_language
    }
    save_users(users)
    
    access_token = create_access_token(data={"sub": user_data.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "name": user_data.name, 
            "email": user_data.email,
            "preferred_language": user_data.preferred_language
        }
    }

@router.post("/login")
async def login(credentials: UserLogin):
    users = load_users()
    user = users.get(credentials.email)
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": credentials.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "name": user["name"], 
            "email": user["email"],
            "preferred_language": user.get("preferred_language", "English")
        }
    }
