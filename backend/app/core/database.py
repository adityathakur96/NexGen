import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None

db = Database()

async def get_database():
    return db.db

async def connect_to_mongo():
    """Connect to MongoDB"""
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "nexgen_db")
    
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.db = db.client[DATABASE_NAME]
    print(f"Connected to MongoDB: {DATABASE_NAME}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

async def get_users_collection():
    """Get users collection"""
    database = await get_database()
    return database.users
