# NexGen ETL: Airflow + PySpark + S3

This project implements a robust ETL pipeline for the NexGen Forecaster, bridging local data processing with cloud storage. It demonstrates the integration of **Apache Airflow** (via Astronomer) and **Apache Spark** to handle large-scale data transformations.

## Technical Architecture

The pipeline follows a modern data engineering pattern:
1. **Extraction**: Discovers new CSV files in the `nexgen-raw-data` S3 bucket.
2. **Transformation**: Uses **PySpark** on a local Spark setup to perform heavy-duty cleaning and feature engineering.
3. **Loading**: Writes the processed, high-quality data back to the `nexgen-loading-data` S3 bucket for model training.

### The Stack
- **Astro CLI**: Used for containerized Airflow orchestration.
- **Docker**: Runs the Airflow Webserver, Scheduler, and Database.
- **Local Spark**: Integrated with the Airflow Docker container to leverage performance without the cost of heavy EMR clusters.
- **Boto3 & S3A**: For seamless interaction between the local processing layer and AWS S3.

## Challenges

Building this was about overcoming several architectural hurdles:

### 1. The Docker-to-Local Bridge
One of the biggest struggles was getting the containerized Airflow (running inside Docker via Astro) to "talk" to the local Spark installation. 
- **The Solve**: We had to carefully map the `SPARK_HOME` environment variables and ensure the Docker container had the necessary Java and Hadoop cloud jars (`hadoop-aws`, `aws-java-sdk-bundle`) to handle `s3a://` paths.

### 2. S3 Connectivity & Permissions
Managing AWS credentials securely while enabling Spark to access S3 from a local machine was tricky.
- **The Solve**: Implemented dynamic credential injection via Airflow Connections, ensuring that `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are passed to `spark-submit` only at runtime, keeping the repository clean and secure.

### 3. Data Consistency (The Watermark Problem)
Ensuring the same file doesn't get processed twice required a watermark system.
- **The Solve**: Leveraged **Airflow Variables** to store timestamps of the last successful run, allowing the `discover_files` task to skip already-processed data automatically.

## Project Contents

- `dags/`: Contains `nexgen_etl_dag.py`, the heart of the orchestration.
- `include/scripts/`: The heavy lifting scripts for `extract.py`, `transform.py`, and `load.py`.
- `Dockerfile`: Custom image instructions to include Java and Spark-compatible environments.
- `requirements.txt`: Python dependencies including `boto3` and AWS-specific libraries.

## How to Run

1. **Prerequisites**:
   - Install Astro CLI.
   - Install Spark 3.5.0 locally.
   - Configure your `aws_default` connection in the Airflow UI.

2. **Start the Pipeline**:
   ```bash
   astro dev start
   ```

3. **Monitor**:
   Access the Airflow UI at `http://localhost:8080/` to trigger and monitor the `nexgen_etl_pipeline` DAG.

