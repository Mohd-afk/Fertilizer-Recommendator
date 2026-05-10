import { Plug, PlugZap, WifiOff } from 'lucide-react';
import { ConnectionStatus } from '../../types';

interface ConnectionPanelProps {
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  onMockData: () => void;
  isMockMode: boolean;
  isWebSerialSupported: boolean;
}

export function ConnectionPanel({
  status,
  onConnect,
  onDisconnect,
  onMockData,
  isMockMode,
  isWebSerialSupported
}: ConnectionPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {status.connected ? (
            <PlugZap className="w-6 h-6 text-green-600" />
          ) : (
            <WifiOff className="w-6 h-6 text-gray-400" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">Arduino Connection</h3>
            <p className="text-sm text-gray-600">
              {status.connected
                ? `Connected - Last update: ${status.lastUpdate?.toLocaleTimeString()}`
                : isMockMode
                ? 'Using mock data (testing mode)'
                : 'Not connected'}
            </p>
          </div>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            status.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}
        />
      </div>

      {status.errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-800 text-sm">{status.errorMessage}</p>
        </div>
      )}

      {!isWebSerialSupported && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Web Serial API not supported in this browser. Use Chrome, Edge, or Opera for Arduino
            connection.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {!status.connected ? (
          <>
            {isWebSerialSupported && (
              <button
                onClick={onConnect}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plug className="w-5 h-5" />
                Connect Arduino
              </button>
            )}
            <button
              onClick={onMockData}
              className={`flex-1 ${
                isMockMode ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors`}
            >
              {isMockMode ? 'Mock Data Active' : 'Use Mock Data'}
            </button>
          </>
        ) : (
          <button
            onClick={onDisconnect}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
