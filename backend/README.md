# NexGen Backend API

FastAPI backend for the NexGen application with MongoDB integration.

## Features

- User authentication (signup/login)
- JWT token-based authorization
- MongoDB for data storage
- Password hashing with bcrypt
- CORS enabled for frontend integration

## Setup

### 1. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `MONGODB_URL`: Your MongoDB connection string
- `DATABASE_NAME`: Database name (default: nexgen_db)
- `SECRET_KEY`: Strong random secret key for JWT

### 4. Run MongoDB

Make sure MongoDB is running on your system or use MongoDB Atlas.

Local MongoDB:
```bash
# Windows - MongoDB service should be running
# Check if MongoDB is running: mongod --version

# Linux/Mac
sudo systemctl start mongodb
# or
brew services start mongodb-community
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user info (requires authentication)

### Health Check

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Configuration settings
│   │   ├── database.py      # MongoDB connection
│   │   └── security.py      # JWT and password hashing
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py          # User models
│   └── routers/
│       ├── __init__.py
│       └── auth.py          # Authentication routes
├── venv/                    # Virtual environment
├── .env                     # Environment variables
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Usage Examples

### Signup

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "password": "securepassword123"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Get Current User

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Development

To run in development mode with auto-reload:

```bash
uvicorn app.main:app --reload
```

## Security Notes

- Always change the `SECRET_KEY` in production
- Use strong passwords
- Enable HTTPS in production
- Configure proper CORS origins
- Keep dependencies updated
