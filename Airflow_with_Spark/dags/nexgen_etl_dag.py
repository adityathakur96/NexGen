"""
NexGen ETL Pipeline DAG

Extract CSV data from S3, transform with PySpark,
and load cleaned data back to S3.

Source: s3://nexgen-raw-data/
Destination: s3://nexgen-loading-data/load-csv/
"""

from airflow.decorators import dag, task
from airflow.operators.bash import BashOperator
from airflow.models import Variable, Connection
from airflow.exceptions import AirflowSkipException
from airflow.hooks.base import BaseHook

from datetime import datetime, timedelta
from typing import List
import logging
import boto3
import os
import json

# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------
logger = logging.getLogger(__name__)

# -------------------------------------------------------------------
# DAG defaults
# -------------------------------------------------------------------
default_args = {
    "owner": "data-engineering",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "email_on_failure": False,
    "email_on_retry": False,
}

# -------------------------------------------------------------------
# Helper to get Env Vars
# -------------------------------------------------------------------
def get_aws_env_vars():
    conn = BaseHook.get_connection("aws_default")
    return {
        "AWS_ACCESS_KEY_ID": conn.login,
        "AWS_SECRET_ACCESS_KEY": conn.password,
        "AWS_DEFAULT_REGION": conn.extra_dejson.get("region_name", "ap-south-1")
    }

# -------------------------------------------------------------------
# DAG
# -------------------------------------------------------------------
@dag(
    dag_id="nexgen_etl_pipeline",
    default_args=default_args,
    schedule="@daily",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["etl", "spark", "s3", "nexgen"],
)
def nexgen_etl_dag():

    # -------------------------
    # Discover new files
    # -------------------------
    @task
    def discover_files() -> str:
        """
        Discover ALL CSV files in nexgen-raw-data bucket.
        Returns comma-separated list of S3 paths.
        """
        source_bucket = "nexgen-raw-data"

        aws_conn = BaseHook.get_connection("aws_default")
        s3 = boto3.client(
            "s3",
            aws_access_key_id=aws_conn.login,
            aws_secret_access_key=aws_conn.password,
            region_name=aws_conn.extra_dejson.get("region_name", "ap-south-1"),
        )

        paginator = s3.get_paginator("list_objects_v2")
        csv_files = []

        for page in paginator.paginate(Bucket=source_bucket):
            for obj in page.get("Contents", []):
                if obj["Key"].endswith(".csv"):
                    csv_files.append(
                        f"s3a://{source_bucket}/{obj['Key']}"
                    )

        if not csv_files:
            raise AirflowSkipException("No CSV files found in bucket")

        logger.info(f"Discovered {len(csv_files)} CSV files")
        # Return as comma-separated string for passing to shell script
        return ",".join(csv_files)
    
    files_list_str = discover_files()

    # -------------------------
    # Extract
    # -------------------------
    extract_task = BashOperator(
        task_id="extract_from_s3",
        bash_command="""
        export AWS_ACCESS_KEY_ID={{ conn.aws_default.login }}
        export AWS_SECRET_ACCESS_KEY={{ conn.aws_default.password }}
        export AWS_DEFAULT_REGION={{ conn.aws_default.extra_dejson.get('region_name', 'ap-south-1') }}
        
        $SPARK_HOME/bin/spark-submit \
        --master local[*] \
        --name nexgen-extract \
        --packages org.apache.hadoop:hadoop-aws:3.3.4,com.amazonaws:aws-java-sdk-bundle:1.12.262 \
        $AIRFLOW_HOME/include/scripts/extract.py "{{ ti.xcom_pull(task_ids='discover_files') }}"
        """,
    )

    # -------------------------
    # Transform
    # -------------------------
    transform_task = BashOperator(
        task_id="transform_data",
        bash_command="""
        export AWS_ACCESS_KEY_ID={{ conn.aws_default.login }}
        export AWS_SECRET_ACCESS_KEY={{ conn.aws_default.password }}
        export AWS_DEFAULT_REGION={{ conn.aws_default.extra_dejson.get('region_name', 'ap-south-1') }}

        $SPARK_HOME/bin/spark-submit \
        --master local[*] \
        --name nexgen-transform \
        --packages org.apache.hadoop:hadoop-aws:3.3.4,com.amazonaws:aws-java-sdk-bundle:1.12.262 \
        $AIRFLOW_HOME/include/scripts/transform.py
        """,
    )

    # -------------------------
    # Load
    # -------------------------
    load_task = BashOperator(
        task_id="load_to_s3",
        bash_command="""
        export AWS_ACCESS_KEY_ID={{ conn.aws_default.login }}
        export AWS_SECRET_ACCESS_KEY={{ conn.aws_default.password }}
        export AWS_DEFAULT_REGION={{ conn.aws_default.extra_dejson.get('region_name', 'ap-south-1') }}
        export NEXGEN_DEST_BUCKET={{ var.value.get('nexgen_dest_bucket', 'nexgen-loading-data') }}
        export NEXGEN_DEST_PREFIX={{ var.value.get('nexgen_dest_prefix', 'load-csv') }}

        $SPARK_HOME/bin/spark-submit \
        --master local[*] \
        --name nexgen-load \
        --packages org.apache.hadoop:hadoop-aws:3.3.4,com.amazonaws:aws-java-sdk-bundle:1.12.262 \
        $AIRFLOW_HOME/include/scripts/load.py
        """,
    )

    # -------------------------
    # Update watermark
    # -------------------------
    @task
    def update_processed_files():
        Variable.set(
            "nexgen_last_processed_timestamp",
            datetime.utcnow().isoformat()
        )

    # -------------------------
    # Dependencies
    # -------------------------
    update_task = update_processed_files()

    files_list_str >> extract_task >> transform_task >> load_task >> update_task


dag_instance = nexgen_etl_dag()
