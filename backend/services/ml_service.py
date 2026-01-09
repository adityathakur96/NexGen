import os
import joblib
import pandas as pd
import pickle
from typing import Dict, List, Any, Union

class MLService:
    """Service for handling ML model predictions"""
    
    def __init__(self):
        self.models = {}
        self.base_path = os.path.join(os.path.dirname(__file__), "..", "..", "ml model pkl")
        print(f"ML Service: Searching for models in {os.path.abspath(self.base_path)}")
        self._load_models()
        
    def _load_models(self):
        """Load available ML models from the external directory"""
        try:
            # Load Sales Analysis Model
            sales_model_path = os.path.join(self.base_path, "Sales_Analysis.pkl")
            if os.path.exists(sales_model_path):
                print(f"Loading Sales Model from {sales_model_path}")
                try:
                    with open(sales_model_path, 'rb') as f:
                        self.models['sales'] = pickle.load(f)
                    print("Sales Model loaded successfully")
                except Exception as e:
                    print(f"Error loading Sales Model: {e}")
            else:
                print(f"Warning: Sales Model not found at {sales_model_path}")

            # Load Stock Replenishment Model
            stock_model_path = os.path.join(self.base_path, "stock_replinishment .pkl")
            if os.path.exists(stock_model_path):
                print(f"Loading Stock Model from {stock_model_path}")
                try:
                    with open(stock_model_path, 'rb') as f:
                        self.models['stock'] = pickle.load(f)
                    print("Stock Model loaded successfully")
                except Exception as e:
                    print(f"Error loading Stock Model: {e}")
            else:
                print(f"Warning: Stock Model not found at {stock_model_path}")
                
        except Exception as e:
            print(f"Critical Error in ML Service: {e}")

    def _prepare_input(self, data: Dict[str, Any], model_name: str) -> pd.DataFrame:
        """Prepare input DataFrame matching model features"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not loaded")
            
        model = self.models[model_name]
        if not hasattr(model, 'feature_names_in_'):
            # Fallback if features are not stored in model
            return pd.DataFrame([data])
            
        required_features = model.feature_names_in_
        
        # Create dictionary with defaults
        input_data = {}
        
        # 1. Map provided inputs
        for key, value in data.items():
            if key in required_features:
                input_data[key] = value
                
        # 2. Fill missing numeric features with defaults (e.g., mean values or 0)
        # In a real app, these should be fetched from historical data context
        defaults = {
            'prev_quantity': 100,
            'lag_2_quantity': 100,
            'lag_3_quantity': 100,
            'rolling_mean_quantity': 100,
            'stock_pressure': 0.5,
            'promo_effect': 0,
            'day_of_week': 2, # Wednesday
            'month': 7,       # July
            'is_weekend': 0,
            'days_since_start': 1000,
        }
        
        for feature in required_features:
            if feature not in input_data:
                if feature in defaults:
                    input_data[feature] = defaults[feature]
                elif feature.startswith('holiday_name_'):
                    input_data[feature] = 0
                elif feature.startswith('weather_condition_'):
                    # Default to Sunny if not specified
                    input_data[feature] = 1 if feature == 'weather_condition_Sunny' else 0
                else:
                    input_data[feature] = 0 # Default fallback
                    
        # Create DataFrame with exact column order
        df = pd.DataFrame([input_data])
        df = df[required_features] # Reorder columns
        return df

    def predict_sales(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make prediction using Sales Analysis model
        """
        try:
            df = self._prepare_input(data, 'sales')
            prediction = self.models['sales'].predict(df)
            
            result = prediction[0]
            if hasattr(result, 'item'):
                result = result.item()
                
            return {"prediction": result}
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise ValueError(f"Sales prediction failed: {str(e)}")

    def predict_stock(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make prediction using Stock Replenishment model
        """
        try:
            df = self._prepare_input(data, 'stock')
            prediction = self.models['stock'].predict(df)
            
            result = prediction[0]
            if hasattr(result, 'item'):
                result = result.item()
                
            return {"prediction": result}
        except Exception as e:
            raise ValueError(f"Stock prediction failed: {str(e)}")

    def get_model_status(self) -> Dict[str, bool]:
        """Return which models are currently loaded"""
        return {
            "sales_model_loaded": 'sales' in self.models,
            "stock_model_loaded": 'stock' in self.models
        }
