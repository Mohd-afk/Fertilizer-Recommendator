import pandas as pd
import numpy as np

def calibrate_sensor_data(raw_data: dict):
    """
    Calibrates raw sensor values.
    Transforms raw ADC or unscaled values into engineering units.
    """
    calibrated = {}
    calibrated['ph'] = np.clip(raw_data.get('ph', 7.0), 0, 14)
    calibrated['moisture'] = np.clip(raw_data.get('moisture', 50), 0, 100)
    calibrated['temperature'] = raw_data.get('temperature', 25.0)
    calibrated['humidity'] = raw_data.get('humidity', 60.0)
    return calibrated

def calculate_nutrient_gap(crop_type: str, soil_levels: dict):
    """
    Calculates the gap between current soil nutrients and crop requirements.
    References standard agronomy N-P-K ratios for common crops.
    """
    # Standard requirements (N, P, K) in kg/acre
    CROP_REQUIREMENTS = {
        'rice': {'n': 100, 'p': 40, 'k': 40},
        'wheat': {'n': 120, 'p': 60, 'k': 40},
        'maize': {'n': 120, 'p': 60, 'k': 40},
        'cotton': {'n': 100, 'p': 50, 'k': 50},
        'sugarcane': {'n': 250, 'p': 100, 'k': 100},
        'tomato': {'n': 150, 'p': 100, 'k': 100}
    }
    
    req = CROP_REQUIREMENTS.get(crop_type.lower(), {'n': 100, 'p': 50, 'k': 50})
    
    gaps = {
        'n_gap': max(0, req['n'] - soil_levels.get('nitrogen', 50)),
        'p_gap': max(0, req['p'] - soil_levels.get('phosphorus', 50)),
        'k_gap': max(0, req['k'] - soil_levels.get('potassium', 50))
    }
    
    return gaps
