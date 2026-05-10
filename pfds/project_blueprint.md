# Fertilizer Recommendation System — Research & Engineering Blueprint

This document provides the research results, design specifications, and engineering plan for the agricultural recommendation system.

## 1. Dataset Inventory (Task 1 & 2)

| Dataset Name | Source | Rows | Target | Key Columns | Quality Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Fertilizer Prediction | Kaggle | ~1,000 | Fertilizer Name | N, P, K, Soil Type, Crop Type, Moisture | 8/10 |
| Crop Recommendation | Kaggle | 2,200 | Crop Name | N, P, K, pH, Temperature, Humidity, Rainfall | 9/10 |
| Soil PH & Moisture | Public Ag | ~500 | Crop Suitability | pH, Moisture, Soil Texture | 7/10 |
| Agronomy Dosage Ref | FAO/Extension | Rules | Dosage (kg/ha) | Crop Requirement, Nutrient Gap | 10/10 |

**Shortlist:**
- **Primary (Fertilizer Type):** Kaggle "Fertilizer Prediction" dataset.
- **Secondary (Dosage/Gap):** FAO Agronomy rules combined with "Crop Recommendation" NPK requirements.

## 2. Unified Master Schema (Task 3)

```json
{
  "soil_ph": "number (4.0 - 9.0)",
  "soil_moisture_percent": "number (0 - 100)",
  "nitrogen": "number (mg/kg)",
  "phosphorus": "number (mg/kg)",
  "potassium": "number (mg/kg)",
  "temperature_c": "number",
  "humidity_percent": "number",
  "rainfall_mm": "number",
  "soil_type": "enum (Sandy, Loamy, Black, Red, Clayey)",
  "crop_type": "enum (Rice, Wheat, Maize, etc.)",
  "target": {
    "fertilizer_type": "string",
    "dosage_band": "enum (Low, Medium, High)",
    "dosage_amount": "string (e.g., 50 kg/ha)",
    "timing": "string",
    "confidence": "number (0-100)"
  }
}
```

## 3. ML Pipeline Architecture (Task 4)

### Modules:
1. **Sensor Preprocessing**: Calibration of raw Arduino ADC values to engineering units (pH, %Moisture).
2. **Fertilizer Classification**: Predicts the *best* fertilizer brand/type (e.g., Urea, DAP, NPK 14-35-14).
3. **Dosage Regression/Rule Engine**: Calculates the *quantity* based on the NPK gap.
4. **Timing/Schedule Layer**: Rule-based logic derived from crop growth stages.
5. **Explanation Layer**: Generates human-readable reasons (e.g., "Nitrogen is low, applying Urea").

### Recommended Algorithms:
- **Random Forest / XGBoost**: Excellent for tabular agricultural data. Handles non-linear relationships between soil NPK and fertilizer choice.
- **Ensemble (Voting Classifier)**: Combine RF and CatBoost for higher accuracy on small datasets.

## 4. Calculations & Agronomy Logic (Task 5)

### Nutrient Gap Formula:
`Gap = CropRequirement[Crop] - CurrentSoilLevel[Nutrient]`
`Dosage = (Gap * 100) / FertilizerPercentage`

### Rainfall/Moisture Safety:
- **IF** `moisture > 80%` **OR** `rainfall > 20mm/day`: **DELAY** application (leaching risk).
- **IF** `moisture < 20%`: **WARN** user to irrigate first (burn risk).

## 5. Hardware Integration (Task 6)

### Sensor Calibration:
- **pH**: Linear mapping from voltage (0.5V - 4.5V) to pH (0-14).
- **Moisture**: Inverse mapping (Analog 1023 = Dry, Analog 0 = Wet).

## 6. Project Structure (Task 7)

```text
/root
  /src
    /app            # UI Components (React)
    /utils          # Logic
      serial.ts     # Arduino Connection
      ml.ts         # ML Prediction Interface
      rules.ts      # Agronomy Logic
      mock.ts       # Mock Data for testing
    /types          # TypeScript Definitions
  /data             # Local copy of datasets
  /model            # Serialized ML models (ONNX/JSON)
  /arduino          # Sample sketch
  package.json
  vercel.json
```
