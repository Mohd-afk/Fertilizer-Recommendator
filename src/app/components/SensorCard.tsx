import { Activity, Droplet, Thermometer, Wind } from 'lucide-react';

interface SensorCardProps {
  label: string;
  value: number | undefined;
  unit: string;
  icon: 'ph' | 'moisture' | 'temperature' | 'humidity';
  quality?: 'good' | 'fair' | 'poor';
}

export function SensorCard({ label, value, unit, icon, quality }: SensorCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'ph':
        return <Activity className="w-8 h-8" />;
      case 'moisture':
        return <Droplet className="w-8 h-8" />;
      case 'temperature':
        return <Thermometer className="w-8 h-8" />;
      case 'humidity':
        return <Wind className="w-8 h-8" />;
    }
  };

  const getQualityColor = () => {
    if (!quality) return 'text-gray-400';
    switch (quality) {
      case 'good':
        return 'text-green-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600 text-lg">{label}</span>
        <div className={getQualityColor()}>{getIcon()}</div>
      </div>
      <div className="flex items-baseline">
        {value !== undefined ? (
          <>
            <span className="text-4xl font-bold text-gray-900">{value.toFixed(1)}</span>
            <span className="ml-2 text-xl text-gray-600">{unit}</span>
          </>
        ) : (
          <span className="text-2xl text-gray-400">--</span>
        )}
      </div>
      {quality && (
        <div className="mt-2">
          <span
            className={`text-sm px-2 py-1 rounded ${
              quality === 'good'
                ? 'bg-green-100 text-green-800'
                : quality === 'fair'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {quality.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
