# NexGen Backend API

FastAPI backend service for fetching and processing dashboard data from AWS S3 CSV files.

## Setup

### 1. Create Virtual Environment

**Windows:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your AWS credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your AWS S3 credentials:
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (default: ap-south-1)
- `AWS_S3_BUCKET_NAME`: Your S3 bucket name (default: nexgen-loading-data)
- `AWS_S3_PREFIX`: S3 prefix/folder path (default: load-csv/)

**Note:** 
- The service automatically lists all CSV files under the specified prefix
- It ignores metadata files like `_SUCCESS`, `_committed_*`, etc.
- It automatically selects the **latest CSV file** based on LastModified timestamp
- If AWS S3 is not configured, the API will automatically fall back to using the local CSV file (`NexGen_Dataset.csv` in the project root)

### 4. Run the API Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Dashboard Data
- `GET /api/dashboard/sales-data` - Get monthly sales data with forecasts
- `GET /api/dashboard/stats` - Get dashboard statistics (revenue, growth, customers, target)
- `GET /api/dashboard/all` - Get all dashboard data in one request

### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Response Formats

### Sales Data Response
```json
[
  {
    "month": "Jan",
    "sales": 45000.0,
    "forecast": 47250.0
  },
  ...
]
```

### Stats Response
```json
{
  "total_revenue": "$324,500",
  "growth_rate": "23.8%",
  "active_customers": "1,429",
  "target_progress": "87%",
  "revenue_change": "+12.5%",
  "growth_change": "+4.3%",
  "customers_change": "+8.2%",
  "target_change": "+15%"
}
```

## S3 CSV File Selection

The S3 service automatically:
- Lists all objects under the configured prefix (`load-csv/` by default)
- Filters out non-CSV files and metadata files (`_SUCCESS`, `_committed_*`, `_started_*`, `_temporary*`)
- Selects the latest CSV file based on `LastModified` timestamp
- Handles multiple CSV files created by Databricks or other ETL processes
- Falls back to local CSV if S3 is unavailable

This means you don't need to hardcode CSV file names - the service will always use the most recent file.

## Development

The API automatically handles:
- CORS for frontend integration
- Automatic latest CSV file selection from S3
- S3 fallback to local CSV files
- Error handling and validation
- Data processing and aggregation

## Testing S3 Service

Test the S3 service functionality:

```bash
python test_s3_service.py
```

This will:
- List all CSV files in the S3 bucket
- Show which file is selected as the latest
- Test fetching the CSV data
