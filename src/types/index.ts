export type CropType =
  | 'rice'
  | 'wheat'
  | 'maize'
  | 'cotton'
  | 'sugarcane'
  | 'soybean'
  | 'groundnut'
  | 'tomato'
  | 'potato'
  | 'onion'
  | 'chili';

export type SoilType =
  | 'sandy'
  | 'loamy'
  | 'clay'
  | 'silt'
  | 'peaty'
  | 'chalky'
  | 'red'
  | 'black'
  | 'alluvial';

export interface ArduinoData {
  ph: number;
  moisture: number;
  temperature: number;
  humidity: number;
}

export interface SensorReading extends ArduinoData {
  timestamp: Date;
  quality: 'good' | 'fair' | 'poor';
}

export interface ManualInputs {
  cropType: string;
  soilType: string;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  rainfall?: number;
}

export interface FertilizerRecommendation {
  id: string;
  fertilizerType: string;
  dosageBand: 'low' | 'medium' | 'high';
  dosageAmount: string;
  applicationTiming: string;
  reason: string;
  confidence: number;
  warnings?: string[];
  timestamp: Date;
  sensorData: SensorReading;
  manualInputs: ManualInputs;
}

export interface ConnectionStatus {
  connected: boolean;
  portName?: string;
  error?: string;
}
