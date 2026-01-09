"""Test script to verify S3 service can list and select latest CSV files"""
import sys
import asyncio
from services.s3_service import S3Service

async def test_s3_service():
    print("Testing S3 Service - Latest CSV File Selection")
    print("=" * 60)
    
    s3_service = S3Service()
    
    print(f"\nConfiguration:")
    print(f"  Bucket: {s3_service.bucket_name}")
    print(f"  Prefix: {s3_service.s3_prefix}")
    print(f"  Region: {s3_service.aws_region}")
    
    # Test listing CSV files
    print(f"\n1. Listing CSV files in s3://{s3_service.bucket_name}/{s3_service.s3_prefix}...")
    csv_files = s3_service._list_csv_files()
    
    if csv_files:
        print(f"   Found {len(csv_files)} CSV file(s):")
        for i, file_info in enumerate(csv_files[:5], 1):  # Show first 5
            print(f"   {i}. {file_info['Key']}")
            print(f"      Last Modified: {file_info['LastModified']}")
        if len(csv_files) > 5:
            print(f"   ... and {len(csv_files) - 5} more")
        
        # Test getting latest
        print(f"\n2. Getting latest CSV file...")
        latest_key = s3_service._get_latest_csv_key()
        if latest_key:
            print(f"   Latest CSV: {latest_key}")
        else:
            print("   No CSV files found")
    else:
        print("   No CSV files found in S3")
        print("   (This is expected if S3 is not configured or bucket is empty)")
    
    # Test fetching data
    print(f"\n3. Fetching CSV data...")
    try:
        df = await s3_service.fetch_csv_from_s3()
        print(f"   [SUCCESS] DataFrame loaded!")
        print(f"   Shape: {df.shape[0]} rows, {df.shape[1]} columns")
        print(f"   Columns: {list(df.columns)[:5]}...")
    except Exception as e:
        print(f"   [ERROR] {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 60)
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(test_s3_service())
