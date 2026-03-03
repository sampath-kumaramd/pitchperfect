import { useSessionStore } from '@/stores/session-store';
import { useTranscriptStore } from '@/stores/transcript-store';
import { TimerBar } from './TimerBar';
import { WPMGauge } from './WPMGauge';

export function CoachingHUD() {
  const config = useSessionStore((state) => state.config);
  const elapsedSeconds = useSessionStore((state) => state.elapsedSeconds);
  const currentWPM = useTranscriptStore((state) => state.currentWPM);
  const fillerWordCount = useTranscriptStore((state) => state.fillerWordCount);
  const fillerWords = useTranscriptStore((state) => state.fillerWords);

  const totalSeconds = config?.durationSeconds ?? 0;

  const topFillers = Object.entries(fillerWords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
      <TimerBar totalSeconds={totalSeconds} elapsedSeconds={elapsedSeconds} />
      
      <WPMGauge currentWPM={currentWPM} />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">
          Filler Words: {fillerWordCount}
        </h3>
        {topFillers.length > 0 && (
          <ul className="text-sm text-gray-600 space-y-1">
            {topFillers.map(([word, count]) => (
              <li key={word} className="flex items-center justify-between">
                <span className="font-mono">&quot;{word}&quot;</span>
                <span className="text-gray-500">{count}×</span>
              </li>
            ))}
          </ul>
        )}
        {topFillers.length === 0 && (
          <p className="text-sm text-gray-500">No filler words detected</p>
        )}
      </div>
      
      {config && (
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Persona:</span>{' '}
            <span className="text-gray-600">{config.persona}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Title:</span>{' '}
            <span className="text-gray-600">{config.presentationTitle}</span>
          </div>
        </div>
      )}
    </div>
  );
}
