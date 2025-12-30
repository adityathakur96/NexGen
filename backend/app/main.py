from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI(title="NexGen API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"message": "Welcome to NexGen API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
