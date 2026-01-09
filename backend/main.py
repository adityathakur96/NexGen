import os
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
from dotenv import load_dotenv
from core.database import connect_to_mongo, close_mongo_connection
from routers import auth
from services.s3_service import S3Service
from services.data_processor import DataProcessor
from services.ml_service import MLService
from models.schemas import (
    SalesData, DashboardStats, ProductPerformance,
    CategoryPerformance, LocationPerformance,
    CustomerSegmentPerformance, InventoryMetrics
)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NexGen Dashboard API",
    description="API for fetching dashboard data from AWS S3 CSV files",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"], # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Lifecycle Events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])


# Initialize services
s3_service = S3Service()
data_processor = DataProcessor()
ml_service = MLService()


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "NexGen Dashboard API is running"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/dashboard/sales-data", response_model=List[SalesData])
async def get_sales_data():
    """
    Fetch and process sales data from S3 CSV file.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        return data_processor.process_sales_data(df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """
    Fetch and calculate dashboard statistics.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        return data_processor.process_dashboard_stats(df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dashboard/comprehensive")
async def get_comprehensive_dashboard():
    """
    Get comprehensive dashboard data including all metrics.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        
        return {
            "sales_data": data_processor.process_sales_data(df),
            "stats": data_processor.process_dashboard_stats(df),
            "top_products": data_processor.process_product_performance(df, limit=20),
            "categories": data_processor.process_category_performance(df),
            "locations": data_processor.process_location_performance(df),
            "customer_segments": data_processor.process_customer_segment_performance(df),
            "inventory_metrics": data_processor.process_inventory_metrics(df)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comprehensive dashboard data: {str(e)}")


@app.post("/api/upload/csv")
async def upload_csv(file: UploadFile = File(...)):
    """
    Endpoint to upload CSV to S3.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        content = await file.read()
        success = await s3_service.upload_file(content, file.filename)
        if success:
            return {"message": f"Successfully uploaded {file.filename} to S3 bucket: nexgen-raw-data"}
        else:
            raise HTTPException(status_code=500, detail="Failed to upload to S3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")



@app.get("/api/products/top", response_model=List[ProductPerformance])
async def get_top_products(limit: int = 10):
    """
    Get top performing products by revenue.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        products = data_processor.process_product_performance(df, limit=limit)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching product data: {str(e)}")


@app.get("/api/categories", response_model=List[CategoryPerformance])
async def get_category_performance():
    """
    Get performance metrics by product category.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        categories = data_processor.process_category_performance(df)
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching category data: {str(e)}")


@app.get("/api/locations", response_model=List[LocationPerformance])
async def get_location_performance():
    """
    Get performance metrics by location.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        locations = data_processor.process_location_performance(df)
        return locations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching location data: {str(e)}")


@app.get("/api/customer-segments", response_model=List[CustomerSegmentPerformance])
async def get_customer_segment_performance():
    """
    Get performance metrics by customer segment.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        segments = data_processor.process_customer_segment_performance(df)
        return segments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching customer segment data: {str(e)}")


@app.get("/api/inventory/metrics", response_model=InventoryMetrics)
async def get_inventory_metrics():
    """
    Get inventory-related metrics.
    """
    try:
        df = await s3_service.fetch_csv_from_s3()
        metrics = data_processor.process_inventory_metrics(df)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inventory data: {str(e)}")





@app.post("/api/predict/sales")
async def predict_sales(data: Dict[str, float]):
    """
    Make sales prediction using ML model
    """
    try:
        return ml_service.predict_sales(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/api/predict/stock")
async def predict_stock(data: Dict[str, float]):
    """
    Make stock replenishment prediction using ML model
    """
    try:
        return ml_service.predict_stock(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
