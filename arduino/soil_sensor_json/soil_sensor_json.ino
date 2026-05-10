/**
 * FarmAssist - Arduino Soil Sensor JSON Serial Output
 * Sends live soil pH and moisture data in JSON format for the web app.
 * 
 * Hardware:
 * - Analog Soil Moisture Sensor (A0)
 * - Analog pH Sensor (A1)
 * - DHT11/22 for Temp/Humidity (Optional, Pin 2)
 */

#include <ArduinoJson.h> // Install via Library Manager

const int moisturePin = A0;
const int phPin = A1;

void setup() {
  Serial.begin(9600);
  while (!Serial) continue; // Wait for serial port
}

void loop() {
  // 1. Read Moisture (Analog 0-1023)
  int rawMoisture = analogRead(moisturePin);
  // Calibration: 1023 = Dry, 0 = Wet (depending on sensor)
  float moisturePercent = map(rawMoisture, 1023, 0, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  // 2. Read pH (Analog 0-1023)
  int rawPh = analogRead(phPin);
  // Simple calibration: 0-5V maps to 0-14 pH
  // float voltage = rawPh * (5.0 / 1023.0);
  // float phValue = 3.5 * voltage; // Standard pH sensor slope
  float phValue = map(rawPh, 0, 1023, 0, 14); // Placeholder mapping
  phValue = constrain(phValue, 0, 14);

  // 3. Optional Temp/Humidity (Mocked here)
  float temperature = 28.5 + (random(-10, 10) / 10.0);
  float humidity = 65 + random(-5, 5);

  // 4. Create JSON object
  StaticJsonDocument<200> doc;
  doc["ph"] = serialized(String(phValue, 1));
  doc["moisture"] = (int)moisturePercent;
  doc["temperature"] = serialized(String(temperature, 1));
  doc["humidity"] = (int)humidity;

  // 5. Send over Serial
  serializeJson(doc, Serial);
  Serial.println(); // Newline is important for the reader!

  delay(2000); // Send data every 2 seconds
}
