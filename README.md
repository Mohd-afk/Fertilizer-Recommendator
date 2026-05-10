# Smart Fertilizer Advisor - Complete Dashboard System

AI-powered fertilizer recommendation dashboard for farmers using live Arduino sensor data, real-time analytics, and intelligent visualization.

## 🌾 Overview

Smart Fertilizer Advisor is a comprehensive web application dashboard that helps farmers make informed fertilizer decisions based on real-time soil conditions. The system combines:

- **Live Arduino Sensor Integration**: Real-time soil pH, moisture, temperature, and humidity readings
- **Interactive Dashboard**: Real-time charts, trends, and analytics
- **Intelligent Recommendation Engine**: Rule-based system with ML-ready architecture
- **Nutrient Gap Analysis**: Visual N-P-K deficit calculations
- **Farmer-Friendly Interface**: Simple, large-text UI optimized for mobile and desktop
- **Comprehensive Tracking**: History of recommendations and sensor readings with visualization

## ✨ Features

### Dashboard Features
- ✅ **Real-Time Monitoring Dashboard** with live sensor cards
- ✅ **Interactive Data Visualization** using Recharts library
- ✅ **Trend Analysis Charts** for pH, moisture, temperature, humidity
- ✅ **Nutrient Gap Visualization** with N-P-K bar charts and progress bars
- ✅ **Analytics Dashboard** with statistics and trend indicators
- ✅ **Fertilizer Distribution Charts** (pie charts showing recommendation patterns)
- ✅ **Dosage Band Distribution** visualization
- ✅ **Tab-Based Navigation** (Dashboard, Recommendation, Analytics)

### Core Features
- ✅ Live Arduino sensor data via Web Serial API
- ✅ Mock data mode for testing without hardware (generates realistic data every 2s)
- ✅ Multi-crop support (11 crop types: rice, wheat, maize, cotton, sugarcane, soybean, groundnut, tomato, potato, onion, chili)
- ✅ Multi-soil type support (9 soil types: sandy, loamy, clay, silt, peaty, chalky, red, black, alluvial)
- ✅ Fertilizer type recommendation (9 types: Urea, DAP, MOP, 10-26-26, 20-20-0, 28-28-0, Organic Compost, Vermicompost, NPK Complex)
- ✅ Dosage calculation with bands (low, medium, high)
- ✅ Specific dosage amounts (kg/acre)
- ✅ Application timing recommendations
- ✅ Confidence scoring (0-100%)
- ✅ Sensor quality assessment (good/fair/poor)
- ✅ Warning system for poor conditions
- ✅ Recommendation history tracking (last 20)
- ✅ Sensor history tracking (last 50 readings)
- ✅ Responsive mobile-first design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Modern browser with Web Serial API support (Chrome, Edge, Opera)
- Arduino with sensors (optional - mock mode available)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available in your Figma Make preview.

### Using with Arduino

1. Upload the Arduino sketch from `arduino/fertilizer_sensor.ino`
2. Connect sensors to Arduino (see `arduino/HARDWARE_SETUP.md`)
3. Connect Arduino to computer via USB
4. In the web app, click "Connect Arduino"
5. Select the Arduino port when prompted
6. Watch live data flow into the dashboard!

### Using Mock Data (Testing)

1. Click "Use Mock Data" button
2. Application generates realistic sensor readings every 2 seconds
3. Explore all dashboard features without Arduino hardware

## 📊 Dashboard Sections

### 1. Dashboard Tab
**Real-time monitoring and quick overview**

- **Analytics Cards**: Average pH, moisture, total readings, recommendations
- **Trend Indicators**: Up/down/stable arrows showing data trends
- **Live Charts**: Dual charts showing soil and environmental conditions
- **Quick Actions**: Jump to recommendations or detailed analytics

### 2. Recommendation Tab
**Get fertilizer recommendations for your field**

- **Input Form**: Crop type, soil type, N-P-K values, rainfall
- **Nutrient Gap Analysis**: Visual bar charts and cards showing nutrient deficits
- **Recommendation Card**: Fertilizer type, dosage, timing, reasoning, confidence, warnings
- **History Table**: Searchable past recommendations with full details

### 3. Analytics Tab
**Deep insights and data visualization**

- **Fertilizer Distribution Pie Chart**: Most recommended fertilizers
- **Dosage Band Distribution**: Low/medium/high dosage patterns
- **Extended Trend Charts**: Last 50 sensor readings
- **Summary Statistics**: Dosage band counts
- **Export Options**: CSV and PDF export (coming soon)

See `DASHBOARD_GUIDE.md` for detailed dashboard usage instructions.

## 🏗️ Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── components/               # React UI components
│   │   │   ├── SensorCard.tsx        # Live sensor display cards
│   │   │   ├── ConnectionPanel.tsx   # Arduino connection control
│   │   │   ├── ManualInputForm.tsx   # Crop/soil input form
│   │   │   ├── RecommendationCard.tsx    # Recommendation display
│   │   │   ├── HistoryTable.tsx      # Recommendation history
│   │   │   ├── SensorTrendChart.tsx  # Live sensor trends (NEW)
│   │   │   ├── AnalyticsDashboard.tsx    # Statistics cards (NEW)
│   │   │   ├── NutrientGapChart.tsx  # N-P-K visualization (NEW)
│   │   │   └── FertilizerDistributionChart.tsx  # Analytics (NEW)
│   │   └── App.tsx                   # Main application with tabs
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── utils/
│   │   ├── serialCommunication.ts    # Arduino Web Serial integration
│   │   ├── mockData.ts               # Mock data generator
│   │   └── recommendationEngine.ts   # Fertilizer recommendation logic
│   └── styles/
│       ├── theme.css                 # Tailwind theme configuration
│       └── fonts.css                 # Font imports
├── arduino/
│   ├── fertilizer_sensor.ino         # Arduino sensor sketch
│   └── HARDWARE_SETUP.md             # Complete hardware guide
├── data/
│   ├── sample_dataset.csv            # Sample training dataset (20 records)
│   └── DATASET_NOTES.md              # ML integration guide
├── DASHBOARD_GUIDE.md                # Detailed dashboard usage (NEW)
└── README.md                         # This file
```

## 🧪 How It Works

### 1. Sensor Data Collection (Hardware Layer)

Arduino continuously reads:
- Soil pH (0-14 scale) via analog sensor
- Soil Moisture (0-100%) via capacitive/resistive sensor
- Temperature (°C) via DHT22
- Humidity (%) via DHT22

Data transmitted as JSON over serial:
```json
{"ph": 6.8, "moisture": 42, "temperature": 29.4, "humidity": 71}
```

### 2. Serial Communication (Integration Layer)

- **Web Serial API**: Browser connects directly to Arduino COM port
- **Real-time streaming**: Data flows continuously to web app
- **Quality assessment**: Each reading validated and scored
- **History tracking**: Last 50 readings stored for trend analysis

### 3. Recommendation Engine (Intelligence Layer)

Analyzes:
- Crop-specific nutrient requirements (N-P-K ratios)
- Current soil nutrient levels vs target
- Soil pH compatibility with crop
- Moisture conditions for safe application
- Soil type characteristics

Generates:
- **Fertilizer Type**: Best match for nutrient gaps (9 types)
- **Dosage Band**: Low/Medium/High classification
- **Dosage Amount**: Specific kg/acre recommendation
- **Application Timing**: When and how to apply (split/basal)
- **Confidence Score**: 0-100% based on data quality
- **Warnings**: pH, moisture, or quality issues

### 4. Dashboard Visualization (UI Layer)

- **Real-time charts**: Recharts library for interactive visualization
- **Trend detection**: Automatic up/down/stable indicators
- **Nutrient gaps**: Visual N-P-K deficit bars and progress tracking
- **Analytics**: Pie charts for fertilizer distribution patterns
- **Mobile responsive**: Tailwind CSS for adaptive layouts

### 5. ML-Ready Architecture (Future Layer)

Current: Rule-based recommendation engine
Future: Drop-in ML model replacement

```typescript
// Current: Rule-based
class RecommendationEngine {
  generateRecommendation(sensorData, manualInputs) {
    // Rule-based logic using crop requirements
  }
}

// Future: ML model
class MLRecommendationEngine extends RecommendationEngine {
  async generateRecommendation(sensorData, manualInputs) {
    const features = this.preprocessFeatures(sensorData, manualInputs);
    const prediction = await this.model.predict(features);
    return this.postprocessPrediction(prediction);
  }
}
```

## 📊 Dataset Information

### Sample Dataset (`data/sample_dataset.csv`)

20 sample records with:
- Soil sensor data (pH 4.0-9.0, moisture 0-100%)
- Nutrient levels (N, P, K in kg/acre)
- Environmental data (temperature, humidity, rainfall)
- Crop and soil type
- Ground truth fertilizer recommendations
- Dosage amounts and application timing
- Confidence scores

### Data Schema

| Column | Type | Range | Description |
|--------|------|-------|-------------|
| soil_ph | float | 4.0-9.0 | Soil acidity/alkalinity |
| soil_moisture_percent | float | 0-100 | Soil water content |
| nitrogen | float | 0-500 | N level (kg/acre) |
| phosphorus | float | 0-500 | P level (kg/acre) |
| potassium | float | 0-500 | K level (kg/acre) |
| temperature_c | float | -10 to 60 | Air temperature |
| humidity_percent | float | 0-100 | Relative humidity |
| rainfall_mm | float | 0-1000 | Recent rainfall |
| soil_type | string | 9 types | Soil classification |
| crop_type | string | 11 types | Crop being grown |
| fertilizer_type | string | 9 types | Recommended fertilizer |
| dosage_kg_per_acre | float | 50-500 | Application amount |
| application_timing | string | - | When to apply |
| confidence | float | 0-100 | Recommendation confidence |

See `data/DATASET_NOTES.md` for ML training guidance and Kaggle dataset integration.

## 🌐 Browser Compatibility

### Web Serial API Support

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome | ✅ Yes | Recommended for Arduino |
| Edge | ✅ Yes | Chromium-based, full support |
| Opera | ✅ Yes | Chromium-based, full support |
| Firefox | ❌ No | Use mock data mode |
| Safari | ❌ No | Use mock data mode |

Mobile: Android Chrome with USB OTG cable

## 📱 Mobile Support

Fully responsive design works on:
- Mobile phones (portrait/landscape)
- Tablets (7" to 12"+)
- Desktop computers

Dashboard adapts:
- Cards stack vertically on mobile
- Charts resize responsively
- Tab navigation touch-friendly
- Large buttons for easy tapping

## 🎯 Use Cases

### Daily Monitoring
1. Start mock data or connect Arduino
2. Check Dashboard tab for live readings
3. Monitor trend charts for changes
4. Review statistics cards

### Getting Recommendations
1. Go to Recommendation tab
2. Enter crop type and soil type
3. Optionally add N-P-K soil test results
4. Click "Get Fertilizer Recommendation"
5. Review nutrient gap visualization
6. Read recommendation card details
7. Note dosage and application timing

### Data Analysis
1. Go to Analytics tab
2. Review fertilizer distribution patterns
3. Check dosage band trends
4. Analyze extended sensor trends (50 readings)
5. Export data for record-keeping (coming soon)

## 🔧 Customization

### Adding New Crops

Edit `src/utils/recommendationEngine.ts`:

```typescript
const CROP_REQUIREMENTS = {
  your_crop: {
    npkRatio: { n: 100, p: 50, k: 50 },
    phRange: { min: 6.0, max: 7.0, optimal: 6.5 },
    moistureRange: { min: 40, max: 70 }
  }
};
```

Then add to `src/types/index.ts`:
```typescript
export type CropType =
  | 'rice'
  | 'wheat'
  // ... existing crops
  | 'your_crop';  // Add here
```

### Adjusting Chart Settings

Edit chart component files:
- `SensorTrendChart.tsx` - Change `maxPoints` prop (default 20)
- Colors: Modify stroke colors in chart components
- Chart types: Swap LineChart for BarChart/AreaChart

## 🆘 Troubleshooting

### Dashboard Shows No Data
- **Check**: Arduino connected or mock data active
- **Fix**: Click "Connect Arduino" or "Use Mock Data"

### Charts Are Empty
- **Cause**: Not enough sensor readings yet
- **Fix**: Wait for 5-10 readings to accumulate

### Recommendation Confidence Low
- **Cause**: Poor sensor quality or missing N-P-K values
- **Fix**: 
  1. Calibrate sensors (see `arduino/HARDWARE_SETUP.md`)
  2. Enter N, P, K values in input form
  3. Check sensor connections

### Arduino Not Connecting
- **Check**: Browser is Chrome/Edge/Opera
- **Check**: Arduino IDE Serial Monitor is closed
- **Check**: USB cable is data-capable (not charge-only)
- **Fix**: Restart browser, try different USB port

### Nutrient Gap Shows All Zeros
- **Cause**: No N-P-K values entered in form
- **Fix**: Add nitrogen, phosphorus, potassium values

## 🎯 Roadmap

- [x] Core recommendation engine
- [x] Arduino integration via Web Serial
- [x] Mock data mode for testing
- [x] Recommendation history tracking
- [x] **Interactive dashboard with charts**
- [x] **Real-time trend analysis**
- [x] **Nutrient gap visualization**
- [x] **Analytics and statistics**
- [x] **Tab-based navigation**
- [ ] ML model integration (TensorFlow.js/ONNX)
- [ ] Data export (CSV/PDF)
- [ ] Multi-language support (Telugu, Hindi, Kannada, Tamil)
- [ ] Offline Progressive Web App (PWA)
- [ ] Weather API integration
- [ ] Field boundary mapping (GIS)
- [ ] Application cost calculator
- [ ] Fertilizer supplier database
- [ ] Community data sharing
- [ ] Crop yield prediction
- [ ] SMS/email alerts
- [ ] Multi-field management

## 📄 License

This project is provided as-is for educational and agricultural purposes.

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Test with both Arduino and mock data
4. Ensure mobile responsiveness
5. Update documentation
6. Submit a pull request

## 📚 Documentation Files

- **README.md** - This file (overview and quick start)
- **DASHBOARD_GUIDE.md** - Detailed dashboard usage guide
- **arduino/HARDWARE_SETUP.md** - Complete hardware setup and wiring
- **data/DATASET_NOTES.md** - ML model training and dataset integration

## 💡 Pro Tips

1. **Use mock data to learn** - Explore all features before deploying hardware
2. **Calibrate sensors weekly** - Improves recommendation accuracy
3. **Enter N-P-K values** - Boosts confidence scores significantly
4. **Track trends daily** - Spot issues before they become problems
5. **Check warnings carefully** - They prevent ineffective applications
6. **Start with Dashboard tab** - Best overview for daily use

## 🆘 Support

For help:
1. Read this README
2. Check DASHBOARD_GUIDE.md for UI questions
3. Review arduino/HARDWARE_SETUP.md for sensor issues
4. Check data/DATASET_NOTES.md for ML questions
5. Review browser console for errors

## 🎓 Educational Use

This project is ideal for:
- Agricultural technology courses
- IoT and sensor integration classes
- Data visualization projects
- Machine learning applications
- Smart farming demonstrations
- Student projects and research

---

**Built with ❤️ for farmers using React, TypeScript, Tailwind CSS, Recharts, and Arduino**

**Dashboard-Powered Smart Agriculture** 🌾📊
