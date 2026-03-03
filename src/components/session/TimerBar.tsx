import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';

interface TimerBarProps {
  totalSeconds: number;
  elapsedSeconds: number;
}

export function TimerBar({ totalSeconds, elapsedSeconds }: TimerBarProps) {
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const progressPercentage = Math.min(100, (elapsedSeconds / totalSeconds) * 100);
  
  const isUrgent = remainingSeconds < 15;
  const isWarning = remainingSeconds >= 15 && remainingSeconds <= 60;
  const isNormal = remainingSeconds > 60;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-sm font-medium transition-colors duration-300',
            isNormal && 'text-indigo-600',
            isWarning && 'text-amber-500',
            isUrgent && 'text-red-600 animate-[pulse-urgent_1s_ease-in-out_infinite]'
          )}
        >
          {formatTime(remainingSeconds)} remaining
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 ease-linear',
            isNormal && 'bg-indigo-600',
            isWarning && 'bg-amber-500',
            isUrgent && 'bg-red-600'
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
