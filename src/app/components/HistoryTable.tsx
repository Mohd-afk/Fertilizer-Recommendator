import { FertilizerRecommendation } from '../../types';
import { Clock, Trash2 } from 'lucide-react';

interface HistoryTableProps {
  history: FertilizerRecommendation[];
  onClear: () => void;
  onSelect: (rec: FertilizerRecommendation) => void;
}

export function HistoryTable({ history, onClear, onSelect }: HistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border-2 border-gray-200 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-lg">No recommendations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Recommendation History</h3>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Time</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Fertilizer</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Dosage</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Crop</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">pH</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Moisture</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => onSelect(rec)}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  {rec.timestamp.toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-green-700">
                  {rec.fertilizerType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span
                    className={`px-2 py-1 rounded ${
                      rec.dosageBand === 'low'
                        ? 'bg-green-100 text-green-800'
                        : rec.dosageBand === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {rec.dosageBand}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                  {rec.manualInputs.cropType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{rec.sensorData.ph.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {rec.sensorData.moisture.toFixed(0)}%
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`font-semibold ${
                      rec.confidence >= 80
                        ? 'text-green-600'
                        : rec.confidence >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {rec.confidence}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
