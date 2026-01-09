import sys
import os
from pyspark.sql import SparkSession

if __name__ == "__main__":
    print("Script started: load.py")
    input_path = "s3a://nexgen-loading-data/temp/transformed"
    
    dest_bucket = os.environ.get("NEXGEN_DEST_BUCKET", "nexgen-loading-data")
    dest_prefix = os.environ.get("NEXGEN_DEST_PREFIX", "load-csv")
    output_path = f"s3a://{dest_bucket}/{dest_prefix}"

    print(f"Loading data from {input_path} to {output_path}")

    # Get credentials from env (passed by Airflow)
    aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    aws_region = os.environ.get("AWS_DEFAULT_REGION", "ap-south-1")

    spark = (
        SparkSession.builder
        .appName("nexgen-load")
        # Explicit S3A configuration
        .config("spark.hadoop.fs.s3a.access.key", aws_access_key)
        .config("spark.hadoop.fs.s3a.secret.key", aws_secret_key)
        .config("spark.hadoop.fs.s3a.endpoint", f"s3.{aws_region}.amazonaws.com")
        .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
        .getOrCreate()
    )

    try:
        df = spark.read.parquet(input_path)

        (
        df
        .coalesce(1)          # 👈 force single partition
        .write
        .mode("overwrite")
        .option("header", "true")
        .csv(output_path)
        )

        # (
        #     df.write
        #     .mode("overwrite")
        #     .option("header", "true")
        #     .partitionBy("location", "year", "month")
        #     .csv(output_path)
        # )

        print(f"Data loaded to {output_path}")

    except Exception as e:
        print(f"Error during loading: {e}")
        raise e

    finally:
        spark.stop()
