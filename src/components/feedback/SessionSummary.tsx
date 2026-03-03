import type { SessionMetrics } from '@/types/feedback';
import { formatTime } from '@/lib/utils';

interface SessionSummaryProps {
  summary: string;
  metrics: SessionMetrics;
}

export function SessionSummary({ summary, metrics }: SessionSummaryProps) {
  const durationSeconds = Math.round(metrics.totalWords / (metrics.averageWPM / 60));
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Session Summary</h3>
      
      <p className="mb-6 text-gray-700">{summary}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Average WPM</div>
          <div className="text-2xl font-bold text-gray-900">{Math.round(metrics.averageWPM)}</div>
        </div>
        
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Total Words</div>
          <div className="text-2xl font-bold text-gray-900">{metrics.totalWords}</div>
        </div>
        
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Filler Words</div>
          <div className="text-2xl font-bold text-gray-900">{metrics.fillerWordCount}</div>
        </div>
        
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Duration</div>
          <div className="text-2xl font-bold text-gray-900">{formatTime(durationSeconds)}</div>
        </div>
      </div>
    </div>
  );
}
