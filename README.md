# 🚀 **NEX GEN: Real-Time Sales Forecasting & Analytics Platform**

Welcome to **NEX GEN** — an advanced, end-to-end, real-time sales and stock prediction system built with the latest in big data, orchestration, and machine learning technologies. This project is designed to tackle real-world retail forecasting challenges and deliver actionable insights through a future-ready **Power BI dashboard** and an interactive **web UI**.

---

## 📊 **Project Overview**

**Sales forecasting** is critical for inventory management, revenue planning, and marketing strategies. This project simulates a real-world analytics pipeline capable of:

- **Ingesting data** from SQL Server and both synthetic & real-world (Amazon) sources
- **Cleaning & transforming data** using Spark & Databricks
- **Predicting sales/stock trends** with XGBoost, LSTM, and Random Forest models
- **Orchestrating workflows** using Apache Airflow
- **Visualizing predictions & KPIs** (Power BI dashboard in progress)
- **Providing user interaction** via a web UI (planned with FastAPI/Streamlit)

---

## 🧱 **Tech Stack**

| **Layer**         | **Technologies**                                      |
|-------------------|------------------------------------------------------|
| Data Ingestion    | SQL Server, Synthetic Dataset                        |
| Data Processing   | Apache Spark, Databricks                             |
| Orchestration     | Apache Airflow                                       |
| Modeling          | LSTM (TensorFlow), XGBoost, Random Forest (scikit-learn) |
| Visualization     | Power BI (planned), AI dashboard tool (temporary)    |
| Deployment (UI)   | FastAPI / Streamlit (planned)                        |

---

## 📂 **Current Progress**

- ✅ **Scalable ETL pipeline implemented** (Apache Spark & Databricks)
- ✅ **Processed & enriched 10,000+ sales records**
- ✅ **Trained & validated XGBoost, LSTM, Random Forest models**
- ✅ **Performance metrics:** MAE ~1.06, RMSE ~1.44
- ✅ **SQL Server integration** for data storage & retrieval
- 🛠️ **Ongoing:** Airflow DAGs for workflow automation
- 🛠️ **Ongoing:** UI design for web dashboard
- 🟦 **Upcoming:** Power BI dashboard for interactive business insights

---

## 📊 **Sample Insights (Planned)**

The Power BI dashboard will provide:

- 📅 **Sales Trend Over Time** (line charts)
- 🥇 **Top-Selling Products** (bar chart)
- 📦 **Stock Quantity Monitoring**
- 💰 **Total Revenue & Quantity Sold** (KPI cards)
- 📈 **Forecast vs. Actual** performance graphs

---

## 🧠 **Machine Learning Models**

| **Model**      | **Purpose**                                    | **Framework**   |
|----------------|------------------------------------------------|-----------------|
| XGBoost        | Fast, scalable gradient boosting                | xgboost         |
| LSTM           | Time-series pattern recognition                 | TensorFlow      |
| Random Forest  | Robust predictions via feature bagging          | scikit-learn    |

All models are evaluated using:
- **MAE** (Mean Absolute Error)
- **RMSE** (Root Mean Squared Error)

---

## 🗂️ **Dataset**

- **Synthetic Data:** Simulated records for experimentation
- **Real-World Samples:** Sales data scraped/collected from Amazon listings
- **Source:** Mixed internal dataset (not publicly shareable)

---

## 🔧 **Project Structure**

```
sales-forecasting-pipeline/
├── data/             # Input datasets
├── notebooks/        # Databricks notebooks
├── models/           # ML models & training scripts
├── airflow_dags/     # DAGs for ETL & prediction workflows
├── spark_jobs/       # Spark-based transformation scripts
├── dashboards/       # Power BI/AI dashboard files (in progress)
├── README.md         # Project overview
```

---

## 📅 **Roadmap**

- Data collection & preprocessing
- Model training & evaluation
- SQL Server integration
- Spark transformation pipelines
- Start Airflow integration
- Complete Airflow DAG orchestration
- Power BI dashboard integration
- Web UI development (FastAPI/Streamlit)

---

---

## 📌 **Disclaimer**

This project uses a mix of synthetic and public sales data and is intended for **educational and prototyping purposes only**. Not intended for commercial deployment at this stage.

---
