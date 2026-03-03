import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-indigo-50">
      <main className="flex flex-col items-center text-center px-8 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          PitchPerfect
        </h1>
        
        <p className="text-2xl text-gray-900 mb-4 max-w-2xl leading-relaxed">
          Practice your pitch with an AI audience that challenges you.
        </p>
        
        <p className="text-lg text-gray-500 mb-12">
          No signup. No credit card. Just start practicing.
        </p>
        
        <Link 
          href="/setup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg px-12 py-5 rounded-xl transition-colors mb-8"
        >
          Start Practicing
        </Link>
        
        <p className="text-gray-600 text-sm">
          4 AI personas | Real-time coaching | Instant feedback
        </p>
      </main>
    </div>
  );
}
