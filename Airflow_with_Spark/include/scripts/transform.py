import sys
import os
from pyspark.sql import SparkSession
from pyspark.sql.types import BooleanType
from pyspark.sql.functions import col, year, month, to_date, when

if __name__ == "__main__":
    print("Script started: transform.py")
    input_path = "s3a://nexgen-loading-data/temp/extracted"
    output_path = "s3a://nexgen-loading-data/temp/transformed"
    
    print(f"Transforming data from {input_path} to {output_path}")

    # Get credentials from env (passed by Airflow)
    aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    aws_region = os.environ.get("AWS_DEFAULT_REGION", "ap-south-1")

    spark = (
        SparkSession.builder
        .appName("nexgen-transform")
        # Explicit S3A configuration
        .config("spark.hadoop.fs.s3a.access.key", aws_access_key)
        .config("spark.hadoop.fs.s3a.secret.key", aws_secret_key)
        .config("spark.hadoop.fs.s3a.endpoint", f"s3.{aws_region}.amazonaws.com")
        .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
        .getOrCreate()
    )

    try:
        df = spark.read.parquet(input_path)

        df = (
            df.withColumn(
                "date_of_purchase",
                to_date(col("date_of_purchase"), "yyyy-MM-dd")
            )
            .withColumn(
                "is_promotion",
                col("is_promotion").cast(BooleanType())
            )
            .withColumn("year", year(col("date_of_purchase")))
            .withColumn("month", month(col("date_of_purchase")))
            .withColumn(
                "holiday_name",
                when(
                    col("holiday_name").isNull()
                    | (col("holiday_name") == ""),
                    "None"
                ).otherwise(col("holiday_name"))
            )
        )

        df = (
            df.dropna(
                subset=[
                    "customer_id",
                    "product_id",
                    "date_of_purchase",
                    "location",
                ]
            )
            .dropDuplicates(
                [
                    "customer_id",
                    "product_id",
                    "date_of_purchase",
                    "location",
                ]
            )
            .filter(
                (col("amount") > 0)
                & (col("quantity") > 0)
            )
        )

        df.write.mode("overwrite").parquet(output_path)
        print(f"Transformed data written to {output_path}")

    except Exception as e:
        print(f"Error during transformation: {e}")
        raise e

    finally:
        spark.stop()
