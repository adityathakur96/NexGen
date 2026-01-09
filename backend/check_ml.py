from services.ml_service import MLService
import json

def test_ml_service():
    print("Initializing ML Service...")
    ml_service = MLService()
    
    status = ml_service.get_model_status()
    print("\nModel Status:")
    print(json.dumps(status, indent=2))
    
    if status['sales_model_loaded']:
        print("\n✅ Sales model loaded")
    else:
        print("\n❌ Sales model NOT loaded")
        
    if status['stock_model_loaded']:
        print("\n✅ Stock model loaded")
    else:
        print("\n❌ Stock model NOT loaded")

if __name__ == "__main__":
    try:
        test_ml_service()
    except Exception as e:
        print(f"\n❌ Classification failed with error: {e}")
