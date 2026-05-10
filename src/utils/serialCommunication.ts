import { ArduinoData, ConnectionStatus } from '../types';

export class ArduinoSerialConnection {
  private port: any | null = null;
  private reader: any | null = null;
  private onDataCallback: ((data: ArduinoData) => void) | null = null;
  private onStatusCallback: ((status: ConnectionStatus) => void) | null = null;

  onData(callback: (data: ArduinoData) => void) {
    this.onDataCallback = callback;
  }

  onStatus(callback: (status: ConnectionStatus) => void) {
    this.onStatusCallback = callback;
  }

  async connect(): Promise<boolean> {
    try {
      // @ts-ignore
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });

      if (this.onStatusCallback) {
        this.onStatusCallback({ connected: true });
      }

      this.readLoop();
      return true;
    } catch (error) {
      console.error('Serial connection failed:', error);
      if (this.onStatusCallback) {
        this.onStatusCallback({ connected: false, error: String(error) });
      }
      return false;
    }
  }

  async disconnect() {
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
    if (this.onStatusCallback) {
      this.onStatusCallback({ connected: false });
    }
  }

  private async readLoop() {
    while (this.port?.readable) {
      // @ts-ignore
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();

      try {
        let buffer = '';
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) break;
          
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            try {
              const data = JSON.parse(line.trim());
              if (this.onDataCallback && data.ph !== undefined) {
                this.onDataCallback(data);
              }
            } catch (e) {
              // Skip malformed lines
            }
          }
        }
      } catch (error) {
        console.error('Serial read error:', error);
      } finally {
        this.reader.releaseLock();
      }
    }
  }
}

export function isWebSerialSupported(): boolean {
  return 'serial' in navigator;
}
