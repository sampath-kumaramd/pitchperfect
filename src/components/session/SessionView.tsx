'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session-store';
import { AudioVisualizer } from './AudioVisualizer';
import { TranscriptPane } from './TranscriptPane';
import { MicControls } from './MicControls';
import { CoachingHUD } from './CoachingHUD';

export function SessionView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const config = useSessionStore((state) => state.config);
  const elapsedSeconds = useSessionStore((state) => state.elapsedSeconds);
  const endSession = useSessionStore((state) => state.endSession);
  const tick = useSessionStore((state) => state.tick);
  const setError = useSessionStore((state) => state.setError);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      router.push('/');
      return;
    }

    async function fetchSession() {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        useSessionStore.getState().setConfig(data.config);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load session';
        setError(errorMessage);
        router.push('/');
      }
    }

    fetchSession();
  }, [sessionId, router, setError]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [tick]);

  useEffect(() => {
    const durationSeconds = config?.durationSeconds ?? 0;
    if (durationSeconds > 0 && elapsedSeconds >= durationSeconds) {
      endSession();
    }
  }, [elapsedSeconds, config, endSession]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-center py-12">
              <AudioVisualizer state="idle" />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <TranscriptPane />
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 pt-4">
              <MicControls />
            </div>
          </div>
          
          <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <CoachingHUD />
          </aside>
        </div>
      </div>
    </div>
  );
}
