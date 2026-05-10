from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.models.fertilizer_model import FertilizerModel
from backend.utils.agronomy import calibrate_sensor_data, calculate_nutrient_gap

app = FastAPI(title="FarmAssist Backend API", description="AI Fertilizer Recommendation Service")

# Initialize models
model = FertilizerModel()

class PredictionRequest(BaseModel):
    ph: float
    moisture: float
    temperature: Optional[float] = 25.0
    humidity: Optional[float] = 60.0
    nitrogen: Optional[float] = 50.0
    phosphorus: Optional[float] = 50.0
    potassium: Optional[float] = 50.0
    crop_type: str
    soil_type: str

class PredictionResponse(BaseModel):
    fertilizer_type: str
    dosage_band: str
    dosage_amount: str
    reason: str
    confidence: float
    timing: str
    warnings: list[str]

@app.get("/")
async def root():
    return {"message": "FarmAssist API is running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(req: PredictionRequest):
    try:
        # 1. Preprocess & Calibrate
        sensor_data = calibrate_sensor_data({
            "ph": req.ph,
            "moisture": req.moisture,
            "temperature": req.temperature,
            "humidity": req.humidity
        })
        
        features = {
            **sensor_data,
            "nitrogen": req.nitrogen,
            "phosphorus": req.phosphorus,
            "potassium": req.potassium
        }
        
        # 2. ML Prediction (Fertilizer Type)
        fert_type, confidence = model.predict(features)
        
        # 3. Agronomy Logic (Dosage & Timing)
        gaps = calculate_nutrient_gap(req.crop_type, features)
        total_gap = gaps['n_gap'] + gaps['p_gap'] + gaps['k_gap']
        
        dosage_band = "medium"
        dosage_amount = "150 kg/acre"
        if total_gap > 150:
            dosage_band = "high"
            dosage_amount = "250 kg/acre"
        elif total_gap < 50:
            dosage_band = "low"
            dosage_amount = "75 kg/acre"
            
        timing = "Apply in split doses: 50% at sowing, 50% after 30 days."
        if req.crop_type.lower() == "rice":
            timing = "Basal dose at puddling followed by top dressing at tillering."
            
        # 4. Warnings
        warnings = []
        if sensor_data['ph'] < 6.0:
            warnings.append("Soil is acidic. Add lime.")
        if sensor_data['moisture'] > 80:
            warnings.append("Soil saturated. Delay application.")
            
        return {
            "fertilizer_type": fert_type,
            "dosage_band": dosage_band,
            "dosage_amount": dosage_amount,
            "reason": f"ML Model predicted {fert_type} with {confidence*100:.1f}% confidence based on nutrient gaps.",
            "confidence": confidence,
            "timing": timing,
            "warnings": warnings
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
