'use client';

import { useEffect, useState } from 'react';

const PROGRESS_STEPS = [
  'Processing transcript...',
  'Evaluating clarity...',
  'Scoring confidence...',
  'Generating insights...',
];

const STEP_DURATION_MS = 2000;

export function FeedbackLoadingOverlay() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROGRESS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, STEP_DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  const progress = ((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-8 text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Analyzing your pitch...</h2>
        
        <div className="mb-6 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="space-y-2">
          {PROGRESS_STEPS.map((step, index) => (
            <div
              key={step}
              className={`flex items-center justify-center gap-2 text-sm transition-opacity duration-300 ${
                index === currentStepIndex
                  ? 'font-semibold text-indigo-600'
                  : index < currentStepIndex
                  ? 'text-emerald-600'
                  : 'text-gray-400'
              }`}
            >
              {index < currentStepIndex && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {index === currentStepIndex && (
                <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600"></div>
              )}
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
