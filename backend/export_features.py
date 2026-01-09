import pickle
import os
import json
import sys

def export_model_features():
    base_path = os.path.join("..", "ml model pkl")
    output = {}
    
    models = {
        "Sales": "Sales_Analysis.pkl",
        "Stock": "stock_replinishment .pkl"
    }
    
    for name, filename in models.items():
        path = os.path.join(base_path, filename)
        if os.path.exists(path):
            try:
                with open(path, 'rb') as f:
                    model = pickle.load(f)
                
                if hasattr(model, 'feature_names_in_'):
                    output[name] = list(model.feature_names_in_)
                else:
                    output[name] = f"No feature_names_in_ found. Type: {type(model)}"
            except Exception as e:
                output[name] = str(e)
        else:
            output[name] = "File not found"
            
    with open("model_features.json", "w") as f:
        json.dump(output, f, indent=2)

if __name__ == "__main__":
    export_model_features()
