"""Test script to verify backend setup"""
import sys
import asyncio
from services.s3_service import S3Service
from services.data_processor import DataProcessor

async def test():
    print("Testing backend setup...")
    print("-" * 50)
    
    # Test S3 service
    print("\n1. Testing S3 Service...")
    try:
        s3 = S3Service()
        df = await s3.fetch_csv_from_s3()
        print(f"   [OK] CSV loaded successfully!")
        print(f"   [OK] Rows: {len(df)}, Columns: {len(df.columns)}")
        print(f"   [OK] Sample columns: {list(df.columns)[:5]}")
    except Exception as e:
        print(f"   [ERROR] Error: {e}")
        return
    
    # Test data processor
    print("\n2. Testing Data Processor...")
    try:
        processor = DataProcessor()
        
        # Test sales data
        sales = processor.process_sales_data(df)
        print(f"   [OK] Sales data processed: {len(sales)} months")
        if sales:
            print(f"   [OK] Sample: {sales[0]}")
        
        # Test stats
        stats = processor.process_dashboard_stats(df)
        print(f"   [OK] Stats processed successfully!")
        print(f"   [OK] Revenue: {stats.total_revenue}")
        print(f"   [OK] Customers: {stats.active_customers}")
        print(f"   [OK] Growth Rate: {stats.growth_rate}")
        print(f"   [OK] Target Progress: {stats.target_progress}")
    except Exception as e:
        print(f"   [ERROR] Error: {e}")
        import traceback
        traceback.print_exc()
        return
    
    print("\n" + "-" * 50)
    print("[SUCCESS] All tests passed! Backend is ready to use.")
    print("\nTo start the API server, run:")
    print("  python main.py")
    print("or")
    print("  uvicorn main:app --reload")

if __name__ == "__main__":
    asyncio.run(test())
