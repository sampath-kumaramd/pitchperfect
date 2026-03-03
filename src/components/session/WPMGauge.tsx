interface WPMGaugeProps {
  currentWPM: number;
}

export function WPMGauge({ currentWPM }: WPMGaugeProps) {
  const getWPMColor = () => {
    if (currentWPM < 100) return 'text-amber-600';
    if (currentWPM > 160) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getWPMLabel = () => {
    if (currentWPM < 100) return 'Too Slow';
    if (currentWPM > 160) return 'Too Fast';
    return 'Good Pace';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Speaking Rate</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${getWPMColor()}`}>
          {currentWPM}
        </span>
        <span className="text-sm text-gray-500">WPM</span>
      </div>
      <p className={`text-sm font-medium ${getWPMColor()}`}>
        {getWPMLabel()}
      </p>
    </div>
  );
}
