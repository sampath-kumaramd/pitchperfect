export default function FeedbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-16 w-64 rounded-lg bg-gray-200"></div>
          
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-gray-200"></div>
            <div className="h-32 rounded-lg bg-gray-200"></div>
          </div>
          
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-gray-200"></div>
            <div className="h-48 rounded-lg bg-gray-200"></div>
          </div>
          
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-gray-200"></div>
            <div className="h-48 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
