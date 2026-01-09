# Quick Start Guide

## Setup (One-time)

1. **Activate Virtual Environment**
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   ```

2. **Install Dependencies** (if not already installed)
   ```powershell
   pip install -r requirements.txt
   ```

3. **Configure AWS S3** (Optional)
   - Copy `.env.example` to `.env`
   - Add your AWS credentials:
     ```
     AWS_ACCESS_KEY_ID=your_key
     AWS_SECRET_ACCESS_KEY=your_secret
     AWS_S3_BUCKET_NAME=your-bucket-name
     AWS_S3_CSV_KEY=NexGen_Dataset.csv
     ```
   - **Note:** If S3 is not configured, the API will automatically use the local CSV file (`NexGen_Dataset.csv` in the project root)

## Running the API

**Option 1: Using Python**
```powershell
python main.py
```

**Option 2: Using Uvicorn directly**
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Option 3: Using the batch script**
```powershell
.\run.bat
```

The API will start at: `http://localhost:8000`

## Testing

**Test the setup:**
```powershell
python test_setup.py
```

**Test API endpoints:**
- Health check: http://localhost:8000/api/health
- Sales data: http://localhost:8000/api/dashboard/sales-data
- Dashboard stats: http://localhost:8000/api/dashboard/stats
- All data: http://localhost:8000/api/dashboard/all
- API docs: http://localhost:8000/docs

## API Endpoints

### GET `/api/dashboard/sales-data`
Returns monthly sales data with forecasts:
```json
[
  {"month": "Jan", "sales": 3715987.46, "forecast": 3901786.83},
  ...
]
```

### GET `/api/dashboard/stats`
Returns dashboard statistics:
```json
{
  "total_revenue": "$25,207,055",
  "growth_rate": "-33.4%",
  "active_customers": "6,009",
  "target_progress": "57%",
  "revenue_change": "+12.5%",
  "growth_change": "+4.3%",
  "customers_change": "+8.2%",
  "target_change": "+15%"
}
```

### GET `/api/dashboard/all`
Returns both sales data and stats in one request.

## Frontend Integration

The API is configured with CORS to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)
- `http://127.0.0.1:5173`

To use in your React frontend:
```javascript
const response = await fetch('http://localhost:8000/api/dashboard/all');
const data = await response.json();
// data.sales_data - array of monthly sales
// data.stats - dashboard statistics
```
