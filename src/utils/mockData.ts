import { ArduinoData } from '../types';

export class MockDataGenerator {
  private intervalId: number | null = null;
  private onDataCallback: ((data: ArduinoData) => void) | null = null;

  onData(callback: (data: ArduinoData) => void) {
    this.onDataCallback = callback;
  }

  start(intervalMs: number = 2000) {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      const data: ArduinoData = {
        ph: parseFloat((5.5 + Math.random() * 2.5).toFixed(1)),
        moisture: Math.floor(30 + Math.random() * 50),
        temperature: parseFloat((25 + Math.random() * 10).toFixed(1)),
        humidity: Math.floor(40 + Math.random() * 40)
      };

      if (this.onDataCallback) {
        this.onDataCallback(data);
      }
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
