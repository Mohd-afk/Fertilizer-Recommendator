import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorReading } from '../../types';

interface SensorTrendChartProps {
  data: SensorReading[];
  maxPoints?: number;
}

export function SensorTrendChart({ data, maxPoints = 20 }: SensorTrendChartProps) {
  // Take last N readings
  const chartData = data.slice(-maxPoints).map((reading, index) => ({
    time: reading.timestamp.toLocaleTimeString(),
    pH: reading.ph,
    moisture: reading.moisture,
    temperature: reading.temperature || 0,
    humidity: reading.humidity || 0,
    index
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 text-center">
        <p className="text-gray-500 text-lg">No sensor data to display</p>
        <p className="text-gray-400 text-sm mt-2">Connect Arduino or use mock data to see trends</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Sensor Trends</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* pH and Moisture Chart */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Soil Conditions</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis yAxisId="left" domain={[0, 14]} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pH"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="pH"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="moisture"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Moisture %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature and Humidity Chart */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Environmental Conditions</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis yAxisId="left" domain={[0, 50]} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Temp °C"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Humidity %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
