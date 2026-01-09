import pickle
import os
import pandas as pd
import sys

# Add current directory to path
sys.path.append(os.getcwd())

def inspect_models():
    base_path = os.path.join("..", "ml model pkl")
    
    models = {
        "Sales": "Sales_Analysis.pkl",
        "Stock": "stock_replinishment .pkl"
    }
    
    for name, filename in models.items():
        path = os.path.join(base_path, filename)
        print(f"\n--- Inspecting {name} Model ({path}) ---")
        try:
            with open(path, 'rb') as f:
                model = pickle.load(f)
            
            print(f"Type: {type(model)}")
            
            if hasattr(model, 'feature_names_in_'):
                print(f"Feature Names: {model.feature_names_in_}")
            elif hasattr(model, 'n_features_in_'):
                print(f"Number of Features: {model.n_features_in_}")
                
            # If it's a pipeline, looking deeper
            if hasattr(model, 'steps'):
                print("Pipeline Steps:", [s[0] for s in model.steps])
                
        except Exception as e:
            print(f"Error loading {name}: {e}")

if __name__ == "__main__":
    inspect_models()
