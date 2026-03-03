'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSessionStore } from '@/stores/session-store';
import type { FeedbackResponse } from '@/types/feedback';
import { ScoreCard } from '@/components/feedback/ScoreCard';
import { FeedbackSection } from '@/components/feedback/FeedbackSection';
import { SessionSummary } from '@/components/feedback/SessionSummary';
import { ShareButton } from '@/components/feedback/ShareButton';

export default function FeedbackPage() {
  const router = useRouter();
  const { sessionId, config } = useSessionStore();
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeedback() {
      if (!sessionId) {
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/sessions/${sessionId}/feedback`);

        if (!response.ok) {
          throw new Error('Failed to load feedback');
        }

        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load feedback');
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, [sessionId, router]);

  function handleRetry() {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    fetch(`/api/sessions/${sessionId}/feedback`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load feedback');
        return res.json();
      })
      .then(data => {
        setFeedback(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Could not load feedback');
        setLoading(false);
      });
  }

  if (loading) {
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
            
            <div className="h-48 rounded-lg bg-gray-200"></div>
            <div className="h-64 rounded-lg bg-gray-200"></div>
            <div className="h-64 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Could not load feedback</h2>
          <p className="mb-6 text-gray-600">{error || 'An unexpected error occurred'}</p>
          
          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Retry
            </button>
            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Your Feedback</h1>
          {config && (
            <p className="text-lg text-gray-600">
              {config.persona.charAt(0).toUpperCase() + config.persona.slice(1)} Persona • {config.presentationTitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <ScoreCard label="Clarity" score={feedback.scores.clarity} maxScore={5} />
          <ScoreCard label="Confidence" score={feedback.scores.confidence} maxScore={5} />
          <ScoreCard label="Structure" score={feedback.scores.structure} maxScore={5} />
        </div>

        <SessionSummary summary={feedback.overallSummary} metrics={feedback.metrics} />

        <FeedbackSection
          title="Strengths"
          items={feedback.strengths}
          variant="positive"
        />

        <FeedbackSection
          title="Areas for Improvement"
          items={feedback.improvements}
          variant="improvement"
        />

        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Try Again
          </Link>
          {sessionId && <ShareButton sessionId={sessionId} />}
        </div>
      </div>
    </div>
  );
}
