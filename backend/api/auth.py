from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from backend.core.auth import get_password_hash, verify_password, create_access_token
from backend.db import get_db
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    preferred_language: str = "English"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup(user_data: UserCreate):
    try:
        db = get_db()
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_password = get_password_hash(user_data.password)

        new_user = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password,
            "preferred_language": user_data.preferred_language
        }
        
        await db.users.insert_one(new_user)
        
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
    except ValueError as e:
        # MongoDB not configured - return demo access
        print(f"Auth: MongoDB not available - {e}")
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
    try:
        db = get_db()
        
        user = await db.users.find_one({"email": credentials.email})
        
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
    except ValueError as e:
        # MongoDB not configured - return demo access
        print(f"Auth: MongoDB not available - {e}")
        access_token = create_access_token(data={"sub": credentials.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "name": "Demo User", 
                "email": credentials.email,
                "preferred_language": "English"
            }
        }
