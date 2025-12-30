from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.core.database import get_users_collection
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    verify_token
)
from datetime import timedelta, datetime
from bson import ObjectId

router = APIRouter()
security = HTTPBearer()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    """Register a new user"""
    users_collection = await get_users_collection()
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await users_collection.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    
    result = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_user["id"] = str(created_user.pop("_id"))
    created_user.pop("hashed_password", None)
    
    return UserResponse(**created_user)

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return access token"""
    users_collection = await get_users_collection()
    
    # Find user by email
    user = await users_collection.find_one({"email": user_credentials.email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=timedelta(minutes=30)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user information"""
    token = credentials.credentials
    email = verify_token(token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    users_collection = await get_users_collection()
    user = await users_collection.find_one({"email": email})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ObjectId to string for response
    user["id"] = str(user.pop("_id"))
    user.pop("hashed_password", None)
    
    return UserResponse(**user)
