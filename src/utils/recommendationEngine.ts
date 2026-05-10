import { ArduinoData, FertilizerRecommendation, ManualInputs, SensorReading } from '../types';
import { MLModel } from './mlPrediction';

export class RecommendationEngine {
  private mlModel = new MLModel();

  assessSensorQuality(data: ArduinoData): 'good' | 'fair' | 'poor' {
    if (data.ph < 4.0 || data.ph > 9.0 || data.moisture < 0 || data.moisture > 100) {
      return 'poor';
    }
    if (data.ph < 5.0 || data.ph > 8.0) {
      return 'fair';
    }
    return 'good';
  }

  async generateRecommendation(
    sensorData: SensorReading,
    manualInputs: ManualInputs
  ): Promise<FertilizerRecommendation> {
    const { ph, moisture } = sensorData;
    const { cropType } = manualInputs;

    // Use ML Model for prediction
    const prediction = await this.mlModel.predictFertilizer(sensorData, manualInputs);

    let applicationTiming = 'Apply in two split doses: 50% at sowing, 50% after 30 days.';
    let warnings: string[] = [];

    // pH specific adjustments & warnings
    if (ph < 6.0) {
      warnings.push('Soil is acidic. Consider adding lime to neutralize pH.');
    } else if (ph > 8.0) {
      warnings.push('Soil is alkaline. Consider adding gypsum.');
    }

    // Moisture warnings
    if (moisture < 20) {
      warnings.push('Soil is too dry. Irrigate before applying fertilizers.');
    } else if (moisture > 80) {
      warnings.push('Soil is saturated. Avoid application to prevent leaching.');
    }

    // Rainfall warnings (if available)
    if (manualInputs.rainfall && manualInputs.rainfall > 50) {
      warnings.push('Heavy rainfall predicted. Delay application to avoid runoff.');
    }

    // Crop specific timing logic
    if (cropType === 'rice') {
      applicationTiming = 'Basal dose at puddling followed by top dressing at tillering and panicle initiation.';
    } else if (cropType === 'wheat') {
      applicationTiming = 'Apply 1/3 Nitrogen and full P & K at sowing, remaining Nitrogen after first irrigation.';
    } else if (cropType === 'maize') {
      applicationTiming = 'Apply 25% N at sowing, 50% at knee-high stage, and 25% at tasseling.';
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      fertilizerType: prediction.fertilizerType,
      dosageBand: prediction.dosageBand,
      dosageAmount: prediction.dosageAmount,
      applicationTiming,
      reason: prediction.reason,
      confidence: prediction.confidence,
      warnings: warnings.length > 0 ? warnings : undefined,
      timestamp: new Date(),
      sensorData,
      manualInputs
    };
  }
}
