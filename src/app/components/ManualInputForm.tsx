import { useState } from 'react';
import { ManualInputs, CropType, SoilType } from '../../types';

interface ManualInputFormProps {
  onSubmit: (inputs: ManualInputs) => void;
}

const CROP_OPTIONS = [
  { id: 'rice', en: 'Rice', te: 'వరి' },
  { id: 'wheat', en: 'Wheat', te: 'గోధుమ' },
  { id: 'maize', en: 'Maize', te: 'మొక్కజొన్న' },
  { id: 'cotton', en: 'Cotton', te: 'పత్తి' },
  { id: 'sugarcane', en: 'Sugarcane', te: 'చెరకు' },
  { id: 'soybean', en: 'Soybean', te: 'సోయాబీన్' },
  { id: 'groundnut', en: 'Groundnut', te: 'వేరుశెనగ' },
  { id: 'tomato', en: 'Tomato', te: 'టమాట' },
  { id: 'potato', en: 'Potato', te: 'బంగాళాదుంప' },
  { id: 'onion', en: 'Onion', te: 'ఉల్లిపాయ' },
  { id: 'chili', en: 'Chili', te: 'మిర్చి' }
];

const SOIL_OPTIONS = [
  { id: 'sandy', en: 'Sandy', te: 'ఇసుక' },
  { id: 'loamy', en: 'Loamy', te: 'గరుకు' },
  { id: 'clay', en: 'Clay', te: 'బంక' },
  { id: 'silt', en: 'Silt', te: 'సిల్ట్' },
  { id: 'red', en: 'Red', te: 'ఎరుపు' },
  { id: 'black', en: 'Black', te: 'నల్ల' },
  { id: 'alluvial', en: 'Alluvial', te: 'ఒండ్రు' }
];

export function ManualInputForm({ onSubmit }: ManualInputFormProps) {
  const [inputs, setInputs] = useState<ManualInputs>({
    cropType: 'rice',
    soilType: 'loamy'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Field Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Crop Type <span className="text-red-600">*</span>
          </label>
          <select
            value={inputs.cropType}
            onChange={(e) => setInputs({ ...inputs, cropType: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-green-600 focus:outline-none"
            required
          >
            {CROP_OPTIONS.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.en} ({crop.te})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Soil Type <span className="text-red-600">*</span>
          </label>
          <select
            value={inputs.soilType}
            onChange={(e) => setInputs({ ...inputs, soilType: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-green-600 focus:outline-none"
            required
          >
            {SOIL_OPTIONS.map((soil) => (
              <option key={soil.id} value={soil.id}>
                {soil.en} ({soil.te})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Nitrogen (N) <span className="text-gray-500 text-sm">kg/acre</span>
          </label>
          <input
            type="number"
            min="0"
            max="500"
            step="0.1"
            value={inputs.nitrogen || ''}
            onChange={(e) =>
              setInputs({ ...inputs, nitrogen: e.target.value ? parseFloat(e.target.value) : undefined })
            }
            placeholder="Optional"
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-green-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Phosphorus (P) <span className="text-gray-500 text-sm">kg/acre</span>
          </label>
          <input
            type="number"
            min="0"
            max="500"
            step="0.1"
            value={inputs.phosphorus || ''}
            onChange={(e) =>
              setInputs({ ...inputs, phosphorus: e.target.value ? parseFloat(e.target.value) : undefined })
            }
            placeholder="Optional"
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-green-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Potassium (K) <span className="text-gray-500 text-sm">kg/acre</span>
          </label>
          <input
            type="number"
            min="0"
            max="500"
            step="0.1"
            value={inputs.potassium || ''}
            onChange={(e) =>
              setInputs({ ...inputs, potassium: e.target.value ? parseFloat(e.target.value) : undefined })
            }
            placeholder="Optional"
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-green-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Rainfall <span className="text-gray-500 text-sm">mm (last 7 days)</span>
          </label>
          <input
            type="number"
            min="0"
            max="1000"
            step="0.1"
            value={inputs.rainfall || ''}
            onChange={(e) =>
              setInputs({ ...inputs, rainfall: e.target.value ? parseFloat(e.target.value) : undefined })
            }
            placeholder="Optional"
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-green-600 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-xl font-bold transition-colors"
      >
        Get Fertilizer Recommendation
      </button>
    </form>
  );
}
