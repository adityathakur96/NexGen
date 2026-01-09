# S3 Service - Automatic CSV File Selection

## Overview

The `S3Service` class automatically discovers and selects the latest CSV file from an AWS S3 bucket without requiring hardcoded file names. This is particularly useful when working with Databricks or other ETL tools that generate multiple CSV files with dynamic names.

## Features

✅ **Automatic File Discovery**: Lists all CSV files under a specified S3 prefix  
✅ **Metadata Filtering**: Automatically ignores metadata files (`_SUCCESS`, `_committed_*`, etc.)  
✅ **Latest File Selection**: Selects the most recent CSV based on `LastModified` timestamp  
✅ **No Hardcoded Names**: Works with any CSV file name pattern  
✅ **Graceful Fallback**: Falls back to local CSV if S3 is unavailable  

## Configuration

### Environment Variables

```bash
AWS_S3_BUCKET_NAME=nexgen-loading-data    # S3 bucket name
AWS_S3_PREFIX=load-csv/                   # S3 prefix/folder path
AWS_ACCESS_KEY_ID=your_access_key         # AWS credentials
AWS_SECRET_ACCESS_KEY=your_secret_key     # AWS credentials
AWS_REGION=ap-south-1                     # AWS region
```

### Default Values

- **Bucket**: `nexgen-loading-data`
- **Prefix**: `load-csv/`
- **Region**: `ap-south-1`

## How It Works

### 1. File Listing

The service uses `list_objects_v2` with pagination to list all objects under the prefix:

```python
paginator = s3_client.get_paginator('list_objects_v2')
pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)
```

### 2. CSV Filtering

Only files that:
- End with `.csv` extension (case-insensitive)
- Are NOT metadata files (don't start with `_SUCCESS`, `_committed_`, etc.)

### 3. Latest File Selection

Files are sorted by `LastModified` timestamp in descending order, and the first (most recent) file is selected:

```python
csv_files.sort(key=lambda x: x['LastModified'], reverse=True)
latest_file = csv_files[0]
```

### 4. Data Loading

The selected CSV file is downloaded and loaded into a Pandas DataFrame.

## Metadata Files Ignored

The following file patterns are automatically ignored:
- `_SUCCESS` - Spark/Databricks success marker
- `_committed_*` - Transactional metadata files
- `_started_*` - Process start markers
- `_temporary*` - Temporary files

## Example S3 Structure

```
s3://nexgen-loading-data/
└── load-csv/
    ├── part-00000-tid-123-abc.csv          ← Selected (latest)
    ├── part-00001-tid-123-abc.csv
    ├── part-00000-tid-122-xyz.csv          ← Older file
    ├── _SUCCESS                             ← Ignored
    └── _committed_123456                    ← Ignored
```

## Usage

### Basic Usage

```python
from services.s3_service import S3Service

s3_service = S3Service()
df = await s3_service.fetch_csv_from_s3()
```

### Manual File Listing

```python
# List all CSV files
csv_files = s3_service._list_csv_files()
for file_info in csv_files:
    print(f"{file_info['Key']} - {file_info['LastModified']}")

# Get latest file key
latest_key = s3_service._get_latest_csv_key()
print(f"Latest: {latest_key}")
```

## Error Handling

The service handles various error scenarios:

1. **No S3 Client**: Falls back to local CSV
2. **Bucket Not Found**: Falls back to local CSV
3. **No CSV Files**: Falls back to local CSV
4. **Access Denied**: Falls back to local CSV
5. **Network Errors**: Falls back to local CSV

All errors are logged with informative messages.

## Testing

Run the test script to verify S3 connectivity and file selection:

```bash
python test_s3_service.py
```

Expected output:
```
Testing S3 Service - Latest CSV File Selection
============================================================

Configuration:
  Bucket: nexgen-loading-data
  Prefix: load-csv/
  Region: ap-south-1

1. Listing CSV files in s3://nexgen-loading-data/load-csv/...
   Found 3 CSV file(s):
   1. load-csv/part-00000-tid-123-abc.csv
      Last Modified: 2024-01-15 10:30:00
   ...

2. Getting latest CSV file...
   Latest CSV: load-csv/part-00000-tid-123-abc.csv

3. Fetching CSV data...
   [SUCCESS] DataFrame loaded!
   Shape: 10000 rows, 22 columns
```

## Integration with FastAPI

The service is automatically used by all API endpoints:

```python
@app.get("/api/dashboard/comprehensive")
async def get_comprehensive_dashboard():
    df = await s3_service.fetch_csv_from_s3()  # Automatically gets latest CSV
    # Process data...
```

No changes needed to existing endpoints - they automatically benefit from the latest file selection!
