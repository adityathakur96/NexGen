import sys
import os
from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType,
    DoubleType
)

# Schema definition must match the DAG version
SCHEMA = StructType([
    StructField("customer_id", IntegerType()),
    StructField("unit_price", DoubleType()),
    StructField("is_promotion", IntegerType()),
    StructField("holiday_name", StringType()),
    StructField("weather_condition", StringType()),
    StructField("customer_segment", StringType()),
    StructField("product_id", IntegerType()),
    StructField("customer_income", DoubleType()),
    StructField("competitor_price", DoubleType()),
    StructField("marketing_spend", DoubleType()),
    StructField("product_name", StringType()),
    StructField("lead_time", IntegerType()),
    StructField("stock_level", IntegerType()),
    StructField("supplier_delay", IntegerType()),
    StructField("shelf_life", IntegerType()),
    StructField("category", StringType()),
    StructField("date_of_purchase", StringType()),
    StructField("amount", DoubleType()),
    StructField("quantity", IntegerType()),
    StructField("location", StringType()),
])

if __name__ == "__main__":
    print("Script started: extract.py")
    if len(sys.argv) < 2:
        print("Usage: extract.py <comma_separated_file_paths>")
        sys.exit(1)

    file_paths_str = sys.argv[1]
    file_paths = file_paths_str.split(",")

    print(f"Extracting from files: {file_paths}")

    # Get credentials from env (passed by Airflow)
    aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    aws_region = os.environ.get("AWS_DEFAULT_REGION", "ap-south-1")

    spark = (
        SparkSession.builder
        .appName("nexgen-extract")
        # Explicit S3A configuration
        .config("spark.hadoop.fs.s3a.access.key", aws_access_key)
        .config("spark.hadoop.fs.s3a.secret.key", aws_secret_key)
        .config("spark.hadoop.fs.s3a.endpoint", f"s3.{aws_region}.amazonaws.com")
        .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
        .getOrCreate()
    )

    try:
        df = (
            spark.read
            .option("header", "true")
            .schema(SCHEMA)
            .csv(file_paths)
        )

        temp_path = "s3a://nexgen-loading-data/temp/extracted"
        
        df.write.mode("overwrite").parquet(temp_path)
        print(f"Extracted {df.count()} records to {temp_path}")

    except Exception as e:
        print(f"Error during extraction: {e}")
        # Explicitly raise to ensure non-zero exit code
        raise e

    finally:
        spark.stop()
