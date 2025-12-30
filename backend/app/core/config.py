from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "nexgen_db"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 3000
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
