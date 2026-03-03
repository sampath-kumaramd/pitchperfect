'use client';

import { SetupForm } from '@/components/setup/SetupForm';

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Setup Your Practice Session
          </h1>
          <p className="text-gray-600">
            Configure your presentation practice session
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <SetupForm />
        </div>
      </div>
    </div>
  );
}
