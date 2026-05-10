import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FertilizerRecommendation } from '../../types';

interface FertilizerDistributionChartProps {
  recommendations: FertilizerRecommendation[];
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // orange
  '#8b5cf6', // purple
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316'  // orange-600
];

export function FertilizerDistributionChart({ recommendations }: FertilizerDistributionChartProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 text-center">
        <p className="text-gray-500 text-lg">No recommendations yet</p>
        <p className="text-gray-400 text-sm mt-2">Get recommendations to see fertilizer distribution</p>
      </div>
    );
  }

  // Count fertilizer types
  const fertilizerCounts: Record<string, number> = {};
  recommendations.forEach((rec) => {
    fertilizerCounts[rec.fertilizerType] = (fertilizerCounts[rec.fertilizerType] || 0) + 1;
  });

  // Prepare data for pie chart
  const chartData = Object.entries(fertilizerCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Count dosage bands
  const dosageCounts = {
    low: 0,
    medium: 0,
    high: 0
  };
  recommendations.forEach((rec) => {
    dosageCounts[rec.dosageBand]++;
  });

  const dosageData = [
    { name: 'Low', value: dosageCounts.low, color: '#10b981' },
    { name: 'Medium', value: dosageCounts.medium, color: '#f59e0b' },
    { name: 'High', value: dosageCounts.high, color: '#ef4444' }
  ];

  // Calculate average confidence
  const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Recommendation Analytics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fertilizer Distribution */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Fertilizer Types Recommended
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total: {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Dosage Distribution */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Dosage Band Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dosageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dosageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Average Confidence</span>
                <span className={`text-2xl font-bold ${
                  avgConfidence >= 80 ? 'text-green-600' :
                  avgConfidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {avgConfidence.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-900 font-bold text-2xl">{dosageCounts.low}</p>
          <p className="text-green-700 text-sm">Low Dosage</p>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-900 font-bold text-2xl">{dosageCounts.medium}</p>
          <p className="text-yellow-700 text-sm">Medium Dosage</p>
        </div>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
          <p className="text-orange-900 font-bold text-2xl">{dosageCounts.high}</p>
          <p className="text-orange-700 text-sm">High Dosage</p>
        </div>
      </div>
    </div>
  );
}
