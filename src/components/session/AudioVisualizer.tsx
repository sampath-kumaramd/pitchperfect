import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  state: 'idle' | 'listening' | 'speaking' | 'error';
}

export function AudioVisualizer({ state }: AudioVisualizerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'w-30 h-30 rounded-full transition-all duration-300 ease-in-out',
          state === 'idle' && 'bg-gray-400 opacity-50',
          state === 'listening' && 'bg-blue-500 animate-[pulse-subtle_2s_ease-in-out_infinite]',
          state === 'speaking' && 'bg-indigo-600 animate-[pulse-active_0.8s_ease-in-out_infinite] shadow-[0_0_20px_rgba(79,70,229,0.6)]',
          state === 'error' && 'bg-red-500 opacity-75'
        )}
      />
    </div>
  );
}
