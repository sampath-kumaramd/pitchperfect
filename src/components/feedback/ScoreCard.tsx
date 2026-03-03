interface ScoreCardProps {
  label: string;
  score: number;
  maxScore: number;
}

export function ScoreCard({ label, score, maxScore }: ScoreCardProps) {
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), maxScore);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{label}</h3>
      
      <div className="mb-3 flex items-center justify-center gap-2">
        {Array.from({ length: maxScore }, (_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full ${
              i < normalizedScore ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <div className="text-center text-2xl font-bold text-gray-900">
        {normalizedScore}/{maxScore}
      </div>
    </div>
  );
}
