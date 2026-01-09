import boto3
import pandas as pd
import io
import os
import time
from typing import Optional, List, Dict
from datetime import datetime, timedelta
from botocore.exceptions import ClientError, NoCredentialsError
from concurrent.futures import ThreadPoolExecutor, as_completed

class S3Service:
    """Service for interacting with AWS S3 to fetch CSV files with caching and parallel processing"""
    
    def __init__(self):
        self.s3_client = None
        self.bucket_name = os.getenv("AWS_S3_BUCKET_NAME", "nexgen-loading-data")
        self.s3_prefix = os.getenv("AWS_S3_PREFIX", "load-csv/")
        self.aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = os.getenv("AWS_REGION", "ap-south-1")
        
        # Caching
        self._cache = None
        self._cache_expiry = None
        self.cache_duration = timedelta(minutes=10)
        
        # Metadata files to ignore
        self.metadata_files = ["_SUCCESS", "_committed_", "_started_", "_temporary"]
        
        self._initialize_s3_client()
        
    def _initialize_s3_client(self):
        """Initialize S3 client with credentials"""
        try:
            if self.aws_access_key_id and self.aws_secret_access_key:
                self.s3_client = boto3.client(
                    's3',
                    aws_access_key_id=self.aws_access_key_id,
                    aws_secret_access_key=self.aws_secret_access_key,
                    region_name=self.aws_region
                )
            else:
                # Try to use default credentials (IAM role, AWS CLI config, etc.)
                self.s3_client = boto3.client('s3', region_name=self.aws_region)
        except Exception as e:
            print(f"Warning: Could not initialize S3 client: {e}")
            print("Will attempt to use local CSV file as fallback")
            self.s3_client = None
    
    def _is_csv_file(self, key: str) -> bool:
        """Check if the file is a CSV file"""
        return key.lower().endswith('.csv')
    
    def _is_metadata_file(self, key: str) -> bool:
        """Check if the file is a metadata file that should be ignored"""
        filename = os.path.basename(key)
        return any(filename.startswith(prefix) for prefix in self.metadata_files)
        
    def _process_file(self, key: str) -> Optional[pd.DataFrame]:
        """Helper to process a single S3 file"""
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=key)
            csv_content = response['Body'].read().decode('utf-8')
            df_part = pd.read_csv(io.StringIO(csv_content))
            return df_part
        except Exception as e:
            print(f"Error reading file {key}: {e}")
            return None

    async def fetch_csv_from_s3(self) -> pd.DataFrame:
        """
        Fetch CSV data from S3 bucket.
        Now simplified for a consolidated CSV file approach.
        """
        # Check cache
        if self._cache is not None and self._cache_expiry > datetime.now():
            return self._cache

        # Try to fetch from S3
        if self.s3_client and self.bucket_name:
            try:
                print(f"Fetching CSV data from s3://{self.bucket_name}/{self.s3_prefix}...")
                paginator = self.s3_client.get_paginator('list_objects_v2')
                pages = paginator.paginate(Bucket=self.bucket_name, Prefix=self.s3_prefix)
                
                keys_to_fetch = []
                for page in pages:
                    if 'Contents' not in page: continue
                    for obj in page['Contents']:
                        key = obj['Key']
                        if self._is_csv_file(key) and not self._is_metadata_file(key):
                            keys_to_fetch.append(key)
                
                if not keys_to_fetch:
                    print("No CSV files found in S3. Falling back to local file.")
                    return self._fetch_local_csv()
                
                # Fetch and combine all found CSVs (usually just one now)
                dfs = []
                for key in keys_to_fetch:
                    df_part = self._process_file(key)
                    if df_part is not None:
                        dfs.append(df_part)

                if not dfs:
                    return self._fetch_local_csv()
                    
                # Combine all dataframes
                final_df = pd.concat(dfs, ignore_index=True)
                
                print(f"Successfully fetched data. Total shape: {final_df.shape}")
                
                # Update Cache
                self._cache = final_df
                self._cache_expiry = datetime.now() + self.cache_duration
                
                return final_df
                
            except Exception as e:
                print(f"Warning: Error accessing S3: {e}. Falling back.")
        
        # Fallback to local CSV file
        return self._fetch_local_csv()
    
    async def upload_file(self, file_content: bytes, filename: str) -> bool:
        """
        Uploads a file to the nexgen-raw-data S3 bucket.
        """
        target_bucket = "nexgen-raw-data"
        key = f"uploads/{filename}"
        
        try:
            if not self.s3_client:
                print("S3 client not initialized. Cannot upload.")
                return False
                
            self.s3_client.put_object(
                Bucket=target_bucket,
                Key=key,
                Body=file_content,
                ContentType='text/csv'
            )
            print(f"Successfully uploaded {filename} to {target_bucket}/{key}")
            # Invalidate cache so next fetch gets new data if processed
            self._cache = None
            return True
        except Exception as e:
            print(f"Error uploading to S3: {e}")
            return False

    def _fetch_local_csv(self) -> pd.DataFrame:
        """
        Fallback method to load CSV from local file system.
        """
        local_csv_path = os.getenv("LOCAL_CSV_PATH", "../../NexGen_Dataset.csv")
        possible_paths = [
            local_csv_path,
            os.path.join(os.path.dirname(__file__), "..", "..", "NexGen_Dataset.csv"),
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "NexGen_Dataset.csv"),
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                print(f"Loading CSV from local file: {path}")
                df = pd.read_csv(path)
                return df
        
        raise FileNotFoundError(f"Could not find CSV file. Tried: {possible_paths}")
