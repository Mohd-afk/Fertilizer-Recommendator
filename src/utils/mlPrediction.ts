import { ArduinoData, ManualInputs } from '../types';

/**
 * ML Prediction Interface (Simulated)
 * This module acts as a placeholder for a real ML model (e.g., ONNX or TensorFlow.js).
 * It uses a weighted scoring system based on Kaggle dataset patterns.
 */

export interface MLPrediction {
  fertilizerType: string;
  confidence: number;
  dosageBand: 'low' | 'medium' | 'high';
  dosageAmount: string;
  reason: string;
}

export class MLModel {
  // Mock weights for fertilizer classification
  private fertilizerWeights = {
    Urea: { N: 1.5, P: -0.5, K: -0.5, pH: 0.2 },
    DAP: { N: 0.5, P: 1.5, K: -0.5, pH: -0.1 },
    MOP: { N: -0.5, P: -0.5, K: 1.5, pH: 0.0 },
    'NPK 14-35-14': { N: 1.0, P: 1.0, K: 1.0, pH: 0.1 },
    'NPK 10-26-26': { N: 0.8, P: 1.2, K: 1.2, pH: 0.0 },
    'Organic Manure': { N: 0.2, P: 0.2, K: 0.2, pH: 0.5 }
  };

  /**
   * Simulates a prediction from a trained classifier.
   */
  async predictFertilizer(
    sensorData: ArduinoData,
    manualInputs: ManualInputs
  ): Promise<MLPrediction> {
    try {
      // Try to get prediction from the Python Backend (Proxied via /_/backend)
      const response = await fetch('/_/backend/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ph: sensorData.ph,
          moisture: sensorData.moisture,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          nitrogen: manualInputs.nitrogen || 50,
          phosphorus: manualInputs.phosphorus || 50,
          potassium: manualInputs.potassium || 50,
          crop_type: manualInputs.cropType,
          soil_type: manualInputs.soilType
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          fertilizerType: result.fertilizer_type,
          confidence: Math.round(result.confidence * 100),
          dosageBand: result.dosage_band as any,
          dosageAmount: result.dosage_amount,
          reason: result.reason
        };
      }
    } catch (error) {
      console.warn('Backend unavailable, falling back to local simulation:', error);
    }

    // FALLBACK: Local simulation logic (same as before)
    const { nitrogen = 50, phosphorus = 50, potassium = 50, ph } = {
      ...manualInputs,
      ...sensorData
    };

    let bestFertilizer = 'NPK Complex';
    let maxScore = -Infinity;

    for (const [fert, weights] of Object.entries(this.fertilizerWeights)) {
      const score = 
        (100 - nitrogen) * (weights as any).N +
        (100 - phosphorus) * (weights as any).P +
        (100 - potassium) * (weights as any).K +
        (ph > 7 ? -(weights as any).pH : (weights as any).pH);

      if (score > maxScore) {
        maxScore = score;
        bestFertilizer = fert;
      }
    }

    const gap = (100 - (nitrogen || 50)) + (100 - (phosphorus || 50)) + (100 - (potassium || 50));
    let dosageBand: 'low' | 'medium' | 'high' = 'medium';
    let dosageAmount = '150 kg/acre';

    if (gap > 200) {
      dosageBand = 'high';
      dosageAmount = '250 kg/acre';
    } else if (gap < 100) {
      dosageBand = 'low';
      dosageAmount = '75 kg/acre';
    }

    return {
      fertilizerType: bestFertilizer,
      confidence: Math.round(70 + Math.random() * 25),
      dosageBand,
      dosageAmount,
      reason: `(Local Simulation) Predicted ${bestFertilizer} based on deficiency score. Start backend for higher accuracy.`
    };
  }
}
