'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSessionStore } from '@/stores/session-store';
import { track } from '@/lib/analytics';
import type { FeedbackResponse } from '@/types/feedback';
import { ScoreCard } from '@/components/feedback/ScoreCard';
import { FeedbackSection } from '@/components/feedback/FeedbackSection';
import { SessionSummary } from '@/components/feedback/SessionSummary';
import { ShareButton } from '@/components/feedback/ShareButton';

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sessionId: storeSessionId, config } = useSessionStore();
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeedback() {
      const urlSessionId = searchParams.get('sessionId');
      const sessionId = storeSessionId || urlSessionId;

      if (!sessionId) {
        router.push('/setup');
        return;
      }

      setActiveSessionId(sessionId);

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/sessions/${sessionId}/feedback`);

        if (!response.ok) {
          throw new Error('Failed to load feedback');
        }

        const data = await response.json();
        setFeedback(data);
        
        track('feedback_generated', { 
          sessionId, 
          clarity: data.scores.clarity, 
          confidence: data.scores.confidence, 
          structure: data.scores.structure 
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load feedback. The session may have expired.');
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, [storeSessionId, searchParams, router]);

  function handleTryAgain() {
    if (activeSessionId) {
      track('session_retried', { sessionId: activeSessionId });
    }
    
    if (!config) {
      router.push('/setup');
      return;
    }

    const params = new URLSearchParams({
      userName: config.userName,
      title: config.presentationTitle,
      persona: config.persona,
      duration: Math.round(config.durationSeconds / 60).toString(),
    });

    if (config.presentationContext) {
      params.set('context', config.presentationContext);
    }

    router.push(`/setup?${params.toString()}`);
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

  if (error || !feedback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Could not load feedback</h2>
          <p className="mb-6 text-gray-600">
            {error || 'Could not load feedback. The session may have expired.'}
          </p>
          
          <div className="flex gap-4">
            <Link
              href="/setup"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Start New Session
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
          <button
            onClick={handleTryAgain}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Try Again
          </button>
          {activeSessionId && <ShareButton sessionId={activeSessionId} />}
        </div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <FeedbackContent />
    </Suspense>
  );
}
