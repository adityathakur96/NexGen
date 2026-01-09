import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pymongo.server_api import ServerApi
import certifi

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
    # Use environment variable or fallback to provided cluster link
    # IMPORTANT: Special characters in password like '#' must be URL encoded to '%23'
    RAW_URL = os.getenv("MONGODB_URL", "mongodb+srv://adityathakurzm_db_user:#Aditya17@cluster0.mc7m5dx.mongodb.net/?appName=Cluster0")
    
    # Auto-fix: Encode # to %23 if present in the hardcoded URL/env
    MONGODB_URL = RAW_URL.replace("#", "%23")
    
    DATABASE_NAME = os.getenv("DATABASE_NAME", "nexgen_dashboard")
    
    try:
        # Using certifi.where() ensures we use the correct root certificates for Atlas SSL
        # Added tls=True and increased timeouts for better connectivity
        db.client = AsyncIOMotorClient(
            MONGODB_URL, 
            server_api=ServerApi('1'),
            tlsCAFile=certifi.where(),
            tls=True,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            serverSelectionTimeoutMS=30000
        )
        db.db = db.client[DATABASE_NAME]
        
        # Send a ping to confirm a successful connection
        # If this fails with SSL error, please check:
        # 1. MongoDB Atlas IP Whitelist (allow current IP)
        # 2. Firewall/VPN status
        await db.client.admin.command('ping')
        print(f"Pinged your deployment. Connected to MongoDB: {DATABASE_NAME}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        print("TIP: If you see SSL/Handshake errors, check if your IP is whitelisted in MongoDB Atlas Network Access.")
        raise e

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

async def get_users_collection():
    """Get users collection"""
    database = await get_database()
    if database is None:
        await connect_to_mongo()
        database = await get_database()
    return database.users
