# 🚀 **NEX GEN: Sales Forecasting & Inventory Replenishment Platform**

Welcome to **NEX GEN** — a practical, end-to-end sales forecasting and inventory replenishment system. This platform leverages **PySpark** for data engineering, **Apache Airflow** for orchestration, and a modern full-stack interface featuring **React** and **FastAPI**.

---

## 📊 Project Overview

NexGen transforms raw transactional data into actionable replenishment recommendations through a multi-stage pipeline:

- **Data Ingestion**: Automated ingestion from Amazon S3 buckets.
- **Processing & ETL**: Heavy-duty data cleaning and feature engineering using **PySpark** on a local Spark environment.
- **Forecasting**: Advanced sales and inventory forecasting using an **XGBoost** pipeline.
- **Orchestration**: End-to-end automation managed via **Apache Airflow** (running on Docker with Astro CLI).
- **Web Interface**: A production-grade **React** frontend for visualizing insights, tracking sales trends, and handling CSV uploads via a **FastAPI** backend.

> [!NOTE]  
> The current implementation processes static datasets from S3, providing a solid foundation for batch analytics and forecasting.

---

## 🧱 Tech Stack

| Layer             | Technologies used                                 |
|-------------------|----------------------------------------------------|
| **Data Storage**  | Amazon S3                                          |
| **Transformation**| PySpark (Local Setup)                             |
| **Orchestration** | Apache Airflow (Astro CLI + Docker)               |
| **Modeling**      | XGBoost (Python)                                   |
| **Frontend**      | ReactJS + Tailwind CSS                             |
| **Backend / API** | FastAPI                                            |

---

## 📂 Current Progress

- ✅ **PySpark ETL**: Built robust pipelines for cleaning and preparing raw S3 data for modeling.
- ✅ **Secure Orchestration**: Stabilized Airflow DAGs using Astro CLI, successfully bridging Dockerized Airflow with local Spark workers.
- ✅ **ML Pipeline**: Implemented forecasting and inventory replenishment logic using XGBoost.
- ✅ **Modern UI**: Developed a comprehensive React frontend for data visualization and direct S3 interaction through the API.

---

## 🔧 Project Structure

The repository is organized into distinct modules for clear separation of concerns:

```
NexGen/
├── Airflow_with_Spark/ # Airflow DAGs, Astro CLI config, and Spark scripts
├── backend/            # FastAPI backend (API endpoints & S3 services)
├── frontend/           # React frontend (Sales Dashboard & UI components)
├── ml model pkl/       # Serialized ML models and artifacts
├── NexGen_Dataset.csv  # Sample dataset for testing
└── README.md           # Project documentation
```

---

## 📅 Future Roadmap & Evolution

The vision for NexGen is to evolve from a batch-processing system into a real-time, AI-driven assistant:

- **Real-Time Data Streaming**: Integrate **Apache Kafka** or **Apache Flink** to move from static batch processing to real-time sales updates.
- **AI-Powered Chat Integration**: Use **n8n automation** to bridge the dashboard with AI chat, allowing users to query their data and predictions in natural language.
- **Enterprise Scaling**: Transition to **Databricks** for distributed compute at scale as data volume grows.
- **Automated AI Workflows**: Leverage n8n to connect ML predictions with downstream alerts and business notifications.
- **Model Registry**: Implement tracking for XGBoost experiment versions and performance metrics.

---

## 📌 Disclaimer

This repository is intended for experimentation and prototyping. Do not use this as-is in production without additional security hardening and validation.


