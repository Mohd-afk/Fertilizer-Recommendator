import { BarChart, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { FertilizerRecommendation, SensorReading } from '../../types';

interface AnalyticsDashboardProps {
  sensorHistory: SensorReading[];
  recommendations: FertilizerRecommendation[];
}

export function AnalyticsDashboard({ sensorHistory, recommendations }: AnalyticsDashboardProps) {
  // Calculate statistics
  const stats = calculateStatistics(sensorHistory, recommendations);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average pH Card */}
      <StatCard
        title="Average pH"
        value={stats.avgPH}
        unit=""
        icon={<Activity className="w-6 h-6" />}
        trend={stats.phTrend}
        color="blue"
      />

      {/* Average Moisture Card */}
      <StatCard
        title="Average Moisture"
        value={stats.avgMoisture}
        unit="%"
        icon={<Activity className="w-6 h-6" />}
        trend={stats.moistureTrend}
        color="green"
      />

      {/* Total Readings Card */}
      <StatCard
        title="Total Readings"
        value={stats.totalReadings}
        unit=""
        icon={<BarChart className="w-6 h-6" />}
        color="purple"
      />

      {/* Recommendations Made Card */}
      <StatCard
        title="Recommendations"
        value={stats.totalRecommendations}
        unit=""
        icon={<BarChart className="w-6 h-6" />}
        trend={stats.recommendationTrend}
        color="orange"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, unit, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg shadow-md p-6 border-2`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold uppercase tracking-wide">{title}</span>
        <div className={iconColorClasses[color]}>{icon}</div>
      </div>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold">{value.toFixed(1)}</span>
        {unit && <span className="ml-2 text-xl">{unit}</span>}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-sm">
          {trend === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Increasing</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-red-600">Decreasing</span>
            </>
          )}
          {trend === 'stable' && (
            <span className="text-gray-600">Stable</span>
          )}
        </div>
      )}
    </div>
  );
}

function calculateStatistics(
  sensorHistory: SensorReading[],
  recommendations: FertilizerRecommendation[]
) {
  if (sensorHistory.length === 0) {
    return {
      avgPH: 0,
      avgMoisture: 0,
      totalReadings: 0,
      totalRecommendations: 0,
      phTrend: 'stable' as const,
      moistureTrend: 'stable' as const,
      recommendationTrend: undefined
    };
  }

  // Calculate averages
  const avgPH = sensorHistory.reduce((sum, r) => sum + r.ph, 0) / sensorHistory.length;
  const avgMoisture = sensorHistory.reduce((sum, r) => sum + r.moisture, 0) / sensorHistory.length;

  // Calculate trends (compare recent half vs older half)
  const midpoint = Math.floor(sensorHistory.length / 2);
  const recentPH = sensorHistory.slice(midpoint).reduce((sum, r) => sum + r.ph, 0) / (sensorHistory.length - midpoint);
  const oldPH = sensorHistory.slice(0, midpoint).reduce((sum, r) => sum + r.ph, 0) / midpoint;

  const recentMoisture = sensorHistory.slice(midpoint).reduce((sum, r) => sum + r.moisture, 0) / (sensorHistory.length - midpoint);
  const oldMoisture = sensorHistory.slice(0, midpoint).reduce((sum, r) => sum + r.moisture, 0) / midpoint;

  const phTrend = recentPH > oldPH + 0.2 ? 'up' : recentPH < oldPH - 0.2 ? 'down' : 'stable';
  const moistureTrend = recentMoisture > oldMoisture + 5 ? 'up' : recentMoisture < oldMoisture - 5 ? 'down' : 'stable';

  return {
    avgPH,
    avgMoisture,
    totalReadings: sensorHistory.length,
    totalRecommendations: recommendations.length,
    phTrend,
    moistureTrend,
    recommendationTrend: undefined
  };
}
