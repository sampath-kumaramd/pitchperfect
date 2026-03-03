'use client';

import { useState, useEffect } from 'react';

interface BrowserSupport {
  isSupported: boolean;
  missingFeatures: string[];
}

function checkBrowserSupport(): BrowserSupport {
  const missingFeatures: string[] = [];

  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return { isSupported: true, missingFeatures: [] };
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    missingFeatures.push('getUserMedia API');
  }

  if (typeof MediaRecorder === 'undefined') {
    missingFeatures.push('MediaRecorder API');
  }

  if (typeof WebSocket === 'undefined') {
    missingFeatures.push('WebSocket API');
  }

  return {
    isSupported: missingFeatures.length === 0,
    missingFeatures,
  };
}

export function BrowserCheck() {
  const [browserSupport, setBrowserSupport] = useState<BrowserSupport | null>(null);

  useEffect(() => {
    const support = checkBrowserSupport();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowserSupport(support);
  }, []);

  if (!browserSupport || browserSupport.isSupported) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-16 w-16 text-amber-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browser Not Supported</h1>
          <p className="text-gray-600">
            Your browser is missing required features for PitchPerfect to work properly.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-red-900 mb-2">Missing Features:</h2>
          <ul className="list-disc list-inside text-red-800 space-y-1">
            {browserSupport.missingFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900">Supported Browsers:</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4285F4" />
                <path d="M12 7a5 5 0 015 5h-5V7z" fill="#EA4335" />
                <path d="M12 17a5 5 0 01-5-5h5v5z" fill="#34A853" />
                <path d="M17 12a5 5 0 01-5 5v-5h5z" fill="#FBBC04" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Chrome</div>
                <div className="text-sm text-gray-600">Version 90+</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#0078D4" />
                <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Edge</div>
                <div className="text-sm text-gray-600">Version 90+</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FF9500" />
                <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Firefox</div>
                <div className="text-sm text-gray-600">Version 90+</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#006CFF" />
                <path d="M9 12h6M12 9v6" stroke="white" strokeWidth="2" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Safari</div>
                <div className="text-sm text-gray-600">Version 15+</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Please update your browser to the latest version or switch to a
            supported browser to use PitchPerfect.
          </p>
        </div>
      </div>
    </div>
  );
}
