# 🚀 **NEX GEN: Real-Time Sales Forecasting & Inventory Replenishment Platform**

Welcome to **NEX GEN** — a practical, end-to-end sales forecasting and inventory replenishment system built with PySpark on Databricks, orchestrated with Airflow, and delivered through a full‑stack web interface (React + embedded Streamlit). This repository contains the code and notebooks used to ingest, transform, model, and visualize sales & inventory data for actionable replenishment recommendations.

---

## 📊 Project Overview

Sales forecasting is essential for inventory planning, loss reduction, and improved service levels. NexGen provides:

- Ingest transactional and inventory data from SQL Server (via JDBC).  
- Clean, transform, and feature‑engineer data using PySpark in Databricks notebooks.  
- Forecast sales and inventory with an XGBoost pipeline (training + inference).  
- Convert forecasts into replenishment suggestions using inventory logic.  
- Automate runs with Airflow DAGs (automation in stabilization/testing).  
- Deliver a React frontend with CSV upload, API integration, and an embedded Streamlit dashboard.  
- Provide a backend API (FastAPI or Flask) that accepts uploads, triggers prediction runs, and returns results.

---

## 🧱 Tech Stack (actual)

| Layer             | Technologies used                                 |
|-------------------|----------------------------------------------------|
| Data ingestion    | SQL Server (JDBC)                                  |
| Data processing   | PySpark, Databricks notebooks                      |
| Orchestration     | Apache Airflow (DAGs)                              |
| Modeling          | XGBoost (Python)                                   |
| Frontend / UI     | ReactJS + Streamlit (embedded in React)            |
| Backend / API     | FastAPI or Flask                                   |
| Data analysis     | Pandas, NumPy, Matplotlib, Plotly                  |

---

## 📂 Current Progress

- ✅ Built PySpark ETL pipelines as Databricks notebooks.  
- ✅ Ingested data from SQL Server using JDBC.  
- ✅ Cleaned, transformed, and processed sales & inventory datasets.  
- ✅ Implemented primary forecasting pipeline using XGBoost.  
- ✅ Implemented inventory replenishment logic driven by forecast outputs.  
- ✅ Developed React frontend with CSV upload and API integration.  
- ✅ Embedded Streamlit dashboard inside the React frontend for visualization and product‑level forecasts.  
- ✅ Backend API (FastAPI / Flask) handles uploads, triggers model runs, and returns updated results/files.  
- 🛠️ Airflow DAGs are created for automation; orchestration and monitoring are being stabilized and tested.

---

## 📊 Sample Insights (via Streamlit)

The embedded Streamlit dashboard exposes:
- Sales trends over time (interactive line charts)  
- Top‑selling products and SKU‑level summaries (bar charts)  
- Inventory levels and low‑stock alerts (tables + flags)  
- Product‑level forecasts with downloadable CSV/Parquet output  
- Forecast vs. historical trend comparison

---

## 🧠 Machine Learning Models

| Model   | Purpose                          | Status      |
|---------|----------------------------------|-------------|
| XGBoost | Sales & inventory forecasting    | Implemented |

Evaluation metrics (MAE, RMSE) are computed and logged in the training notebooks.

---

## 🗂️ Dataset

- Source: SQL Server tables (sales, inventory, products, promos).  
- Local/test: small synthetic/sample datasets provided for development/testing.  
- Processed features and outputs: stored as parquet files or Databricks tables.

---

## 🔧 Project Structure

```
NexGen/
├── frontend/           # React app (UI + upload components)
├── streamlit_app/      # Streamlit dashboard (embedded in React)
├── spark_jobs/         # Databricks notebooks / spark scripts
├── airflow_dags/       # Airflow DAGs (automation & scheduling)
├── ml/                 # model artifacts, training utilities
├── api/                # FastAPI / Flask backend service
├── data/               # sample datasets / staging
├── notebooks/          # exploratory & reporting notebooks
└── README.md
```

---

## 📅 Roadmap

- Stabilize Airflow ↔ Databricks orchestration and monitoring.  
- Automate model retraining and scheduling with safe triggers and versioning.  
- Add model artifact tracking or a simple model registry.  
- Harden the API (validation, authentication, rate limits) and add CI checks.  
- Containerize services (API, Streamlit) for easier deployment.  
- Expand inventory optimization rules (business constraints, pack sizes, min/max orders).

---

## 📌 Disclaimer

This repository is intended for experimentation and prototyping. Some sample data may be synthetic or anonymized. Do not use this repository as‑is in production without additional security, testing, and validation.
