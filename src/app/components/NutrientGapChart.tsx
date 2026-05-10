import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ManualInputs } from '../../types';

interface NutrientGapChartProps {
  manualInputs: ManualInputs;
  cropType: string;
}

// Crop nutrient requirements (same as recommendation engine)
const CROP_REQUIREMENTS: Record<string, { n: number; p: number; k: number }> = {
  rice: { n: 80, p: 40, k: 40 },
  wheat: { n: 120, p: 60, k: 40 },
  maize: { n: 150, p: 75, k: 75 },
  cotton: { n: 100, p: 50, k: 50 },
  sugarcane: { n: 200, p: 80, k: 100 },
  soybean: { n: 40, p: 60, k: 40 },
  groundnut: { n: 25, p: 50, k: 75 },
  tomato: { n: 100, p: 80, k: 100 },
  potato: { n: 120, p: 60, k: 120 },
  onion: { n: 100, p: 50, k: 100 },
  chili: { n: 100, p: 50, k: 50 }
};

const COLORS = {
  nitrogen: '#3b82f6',
  phosphorus: '#10b981',
  potassium: '#f59e0b'
};

export function NutrientGapChart({ manualInputs, cropType }: NutrientGapChartProps) {
  const cropReq = CROP_REQUIREMENTS[cropType.toLowerCase()] || { n: 80, p: 40, k: 40 };

  const currentN = manualInputs.nitrogen || 0;
  const currentP = manualInputs.phosphorus || 0;
  const currentK = manualInputs.potassium || 0;

  const data = [
    {
      nutrient: 'Nitrogen',
      required: cropReq.n,
      current: currentN,
      gap: Math.max(0, cropReq.n - currentN),
      color: COLORS.nitrogen
    },
    {
      nutrient: 'Phosphorus',
      required: cropReq.p,
      current: currentP,
      gap: Math.max(0, cropReq.p - currentP),
      color: COLORS.phosphorus
    },
    {
      nutrient: 'Potassium',
      required: cropReq.k,
      current: currentK,
      gap: Math.max(0, cropReq.k - currentK),
      color: COLORS.potassium
    }
  ];

  const hasNPKValues = currentN > 0 || currentP > 0 || currentK > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Nutrient Analysis for {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
      </h3>

      {!hasNPKValues && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            💡 Tip: Enter N, P, K values in the form below to see your nutrient gaps and get more accurate recommendations.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Nutrient Requirements vs Current Levels</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nutrient" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'kg/acre', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="required" name="Required" fill="#94a3b8" />
              <Bar dataKey="current" name="Current" fill="#10b981" />
              <Bar dataKey="gap" name="Gap" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nutrient Cards */}
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.nutrient} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-lg font-bold" style={{ color: item.color }}>
                  {item.nutrient}
                </h5>
                {item.gap > 0 ? (
                  <span className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                    DEFICIT
                  </span>
                ) : (
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    SUFFICIENT
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Required</p>
                  <p className="font-bold text-gray-900">{item.required} kg</p>
                </div>
                <div>
                  <p className="text-gray-600">Current</p>
                  <p className="font-bold text-gray-900">{item.current} kg</p>
                </div>
                <div>
                  <p className="text-gray-600">Gap</p>
                  <p className="font-bold text-red-600">{item.gap} kg</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (item.current / item.required) * 100)}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
