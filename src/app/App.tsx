import { useState, useEffect, useRef } from 'react';
import { Sprout, BarChart3, TrendingUp, FileText } from 'lucide-react';
import {
  SensorReading,
  ManualInputs,
  FertilizerRecommendation,
  ConnectionStatus,
  ArduinoData
} from '../types';
import { ArduinoSerialConnection, isWebSerialSupported } from '../utils/serialCommunication';
import { MockDataGenerator } from '../utils/mockData';
import { RecommendationEngine } from '../utils/recommendationEngine';
import { SensorCard } from './components/SensorCard';
import { ConnectionPanel } from './components/ConnectionPanel';
import { ManualInputForm } from './components/ManualInputForm';
import { RecommendationCard } from './components/RecommendationCard';
import { HistoryTable } from './components/HistoryTable';
import { SensorTrendChart } from './components/SensorTrendChart';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NutrientGapChart } from './components/NutrientGapChart';
import { FertilizerDistributionChart } from './components/FertilizerDistributionChart';

type TabType = 'dashboard' | 'recommendation' | 'analytics';

export default function App() {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false
  });
  const [currentRecommendation, setCurrentRecommendation] = useState<
    FertilizerRecommendation | undefined
  >();
  const [history, setHistory] = useState<FertilizerRecommendation[]>([]);
  const [isMockMode, setIsMockMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentManualInputs, setCurrentManualInputs] = useState<ManualInputs>({
    cropType: 'rice',
    soilType: 'loamy'
  });

  const serialConnection = useRef<ArduinoSerialConnection | null>(null);
  const mockDataGenerator = useRef<MockDataGenerator | null>(null);
  const recommendationEngine = useRef(new RecommendationEngine());

  useEffect(() => {
    serialConnection.current = new ArduinoSerialConnection();
    mockDataGenerator.current = new MockDataGenerator();

    serialConnection.current.onData(handleArduinoData);
    serialConnection.current.onStatus(setConnectionStatus);
    mockDataGenerator.current.onData(handleArduinoData);

    return () => {
      serialConnection.current?.disconnect();
      mockDataGenerator.current?.stop();
    };
  }, []);

  const handleArduinoData = (data: ArduinoData) => {
    const quality = recommendationEngine.current.assessSensorQuality(data);
    const reading: SensorReading = {
      ph: data.ph,
      moisture: data.moisture,
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: new Date(),
      quality
    };
    setSensorData(reading);

    // Add to history (keep last 50 readings)
    setSensorHistory((prev) => [...prev, reading].slice(-50));
  };

  const handleConnect = async () => {
    if (serialConnection.current) {
      const success = await serialConnection.current.connect();
      if (success && isMockMode) {
        mockDataGenerator.current?.stop();
        setIsMockMode(false);
      }
    }
  };

  const handleDisconnect = async () => {
    if (serialConnection.current) {
      await serialConnection.current.disconnect();
    }
  };

  const handleMockData = () => {
    if (!isMockMode) {
      mockDataGenerator.current?.start(2000);
      setIsMockMode(true);
    } else {
      mockDataGenerator.current?.stop();
      setIsMockMode(false);
      setSensorData(null);
    }
  };

  const handleGetRecommendation = async (manualInputs: ManualInputs) => {
    if (!sensorData) {
      alert('No sensor data available. Please connect Arduino or use mock data.');
      return;
    }

    setCurrentManualInputs(manualInputs);

    const recommendation = await recommendationEngine.current.generateRecommendation(
      sensorData,
      manualInputs
    );

    setCurrentRecommendation(recommendation);
    setHistory((prev) => [recommendation, ...prev].slice(0, 20));

    // Switch to recommendation tab to show results
    setActiveTab('recommendation');
  };

  const handleClearHistory = () => {
    if (confirm('Clear all recommendation history?')) {
      setHistory([]);
    }
  };

  const handleSelectHistory = (rec: FertilizerRecommendation) => {
    setCurrentRecommendation(rec);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sprout className="w-12 h-12 text-green-600" />
            <h1 className="text-5xl font-bold text-gray-900">Smart Fertilizer Advisor</h1>
          </div>
          <p className="text-xl text-gray-700">
            AI-Powered Dashboard for Smart Farming Decisions
          </p>
        </header>

        {/* Connection Panel */}
        <div className="mb-8">
          <ConnectionPanel
            status={connectionStatus}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onMockData={handleMockData}
            isMockMode={isMockMode}
            isWebSerialSupported={isWebSerialSupported()}
          />
        </div>

        {/* Live Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SensorCard
            label="Soil pH"
            value={sensorData?.ph}
            unit=""
            icon="ph"
            quality={sensorData?.quality}
          />
          <SensorCard
            label="Soil Moisture"
            value={sensorData?.moisture}
            unit="%"
            icon="moisture"
            quality={sensorData?.quality}
          />
          <SensorCard
            label="Temperature"
            value={sensorData?.temperature}
            unit="°C"
            icon="temperature"
          />
          <SensorCard label="Humidity" value={sensorData?.humidity} unit="%" icon="humidity" />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 border-2 border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('recommendation')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-semibold transition-all ${
                  activeTab === 'recommendation'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-5 h-5" />
                Get Recommendation
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Analytics Dashboard */}
            <AnalyticsDashboard sensorHistory={sensorHistory} recommendations={history} />

            {/* Sensor Trends */}
            <SensorTrendChart data={sensorHistory} maxPoints={20} />

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('recommendation')}
                  className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Get Fertilizer Recommendation
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendation' && (
          <div className="space-y-8">
            {/* Input Form */}
            <ManualInputForm onSubmit={handleGetRecommendation} />

            {/* Nutrient Gap Analysis */}
            {currentManualInputs && (
              <NutrientGapChart
                manualInputs={currentManualInputs}
                cropType={currentManualInputs.cropType}
              />
            )}

            {/* Current Recommendation */}
            {currentRecommendation && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Recommendation</h2>
                <RecommendationCard recommendation={currentRecommendation} />
              </div>
            )}

            {/* Recommendation History */}
            {history.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommendation History</h2>
                <HistoryTable
                  history={history}
                  onClear={handleClearHistory}
                  onSelect={handleSelectHistory}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Fertilizer Distribution */}
            <FertilizerDistributionChart recommendations={history} />

            {/* Sensor Trends (Detailed) */}
            <SensorTrendChart data={sensorHistory} maxPoints={50} />

            {/* Statistics Dashboard */}
            <AnalyticsDashboard sensorHistory={sensorHistory} recommendations={history} />

            {/* Export Options */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Export</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => alert('CSV export feature coming soon!')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Export Sensor Data (CSV)
                </button>
                <button
                  onClick={() => alert('CSV export feature coming soon!')}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Export Recommendations (CSV)
                </button>
                <button
                  onClick={() => alert('PDF report feature coming soon!')}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Generate PDF Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Smart Fertilizer Advisor Dashboard - Powered by Arduino Sensors & AI Analytics
          </p>
          <p className="mt-2">
            For best results, calibrate sensors regularly and consult with local agricultural
            experts
          </p>
        </footer>
      </div>
    </div>
  );
}