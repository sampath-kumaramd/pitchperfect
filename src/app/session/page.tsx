'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SessionView } from '@/components/session/SessionView';
import { createConversationProvider } from '@/lib/conversation/factory';
import type { ConversationProvider } from '@/lib/conversation/types';
import { MicCapture } from '@/lib/audio/capture';
import { AudioPlaybackQueue } from '@/lib/audio/playback';
import { useSessionStore } from '@/stores/session-store';
import { useTranscriptStore } from '@/stores/transcript-store';
import { useAudioStore } from '@/stores/audio-store';
import { calculateWPM } from '@/lib/audio/analysis';

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

function SessionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const config = useSessionStore((state) => state.config);
  const elapsedSeconds = useSessionStore((state) => state.elapsedSeconds);
  const sessionState = useSessionStore((state) => state.state);
  const error = useSessionStore((state) => state.error);
  const setConfig = useSessionStore((state) => state.setConfig);
  const setError = useSessionStore((state) => state.setError);
  const tick = useSessionStore((state) => state.tick);

  const addEntry = useTranscriptStore((state) => state.addEntry);
  const updateWPM = useTranscriptStore((state) => state.updateWPM);
  const entries = useTranscriptStore((state) => state.entries);

  const setAgentLevel = useAudioStore((state) => state.setAgentLevel);
  const setAgentSpeaking = useAudioStore((state) => state.setAgentSpeaking);
  const startRecording = useAudioStore((state) => state.startRecording);
  const stopRecording = useAudioStore((state) => state.stopRecording);

  const providerRef = useRef<ConversationProvider | null>(null);
  const micCaptureRef = useRef<MicCapture | null>(null);
  const playbackQueueRef = useRef<AudioPlaybackQueue | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      router.push('/setup');
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    async function initializeSession() {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }

        const data = await response.json();
        setConfig(data.config);

        const provider = createConversationProvider('openai-realtime');
        providerRef.current = provider;

        provider.onTranscript((entry) => {
          addEntry(entry);
        });

        provider.onAgentTranscript((entry) => {
          addEntry(entry);
        });

        provider.onAgentAudio((chunk) => {
          if (playbackQueueRef.current) {
            playbackQueueRef.current.enqueue(chunk);
            setAgentSpeaking(true);
          }
        });

        provider.onError((err) => {
          console.error('[Session]', err);
          setError(err.message);
        });

        provider.onStateChange((state) => {
          console.log('[Session] Connection state:', state);
        });

        await provider.connect(data.config);

        const micCapture = new MicCapture();
        micCaptureRef.current = micCapture;

        micCapture.onData(async (blob) => {
          try {
            const arrayBuffer = await blobToArrayBuffer(blob);
            provider.sendAudio(arrayBuffer);
          } catch (error) {
            console.error('[Session] Audio conversion error:', error);
          }
        });

        await micCapture.start();
        startRecording();

        const playbackQueue = new AudioPlaybackQueue();
        playbackQueueRef.current = playbackQueue;
        playbackQueue.init();

        volumeIntervalRef.current = setInterval(() => {
          if (playbackQueueRef.current) {
            const volume = playbackQueueRef.current.getVolume();
            setAgentLevel(volume);
            setAgentSpeaking(volume > 0.05);
          }
        }, 100);

        timerRef.current = setInterval(() => {
          tick();
          const wpm = calculateWPM(entries);
          updateWPM(wpm);
        }, 1000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
        setError(errorMessage);
      }
    }

    initializeSession();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
      if (micCaptureRef.current) {
        micCaptureRef.current.stop();
        stopRecording();
      }
      if (providerRef.current) {
        providerRef.current.disconnect();
      }
      if (playbackQueueRef.current) {
        playbackQueueRef.current.destroy();
      }
    };
  }, [sessionId, router, setConfig, setError, addEntry, setAgentLevel, setAgentSpeaking, startRecording, stopRecording, tick, updateWPM, entries]);

  useEffect(() => {
    const durationSeconds = config?.durationSeconds ?? 0;
    if (durationSeconds > 0 && elapsedSeconds >= durationSeconds) {
      async function endSessionFlow() {
        try {
          if (micCaptureRef.current) {
            micCaptureRef.current.stop();
            stopRecording();
          }

          if (providerRef.current) {
            await providerRef.current.disconnect();
          }

          if (playbackQueueRef.current) {
            playbackQueueRef.current.stop();
          }

          if (!sessionId) {
            throw new Error('No session ID');
          }

          const response = await fetch(`/api/sessions/${sessionId}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcript: entries,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate feedback');
          }

          router.push(`/feedback?sessionId=${sessionId}`);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
          setError(errorMessage);
        }
      }

      endSessionFlow();
    }
  }, [elapsedSeconds, config, sessionId, entries, router, setError, stopRecording]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Session Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/setup')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  if (sessionState === 'connecting' || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Connecting to AI agent...</p>
        </div>
      </div>
    );
  }

  return <SessionView />;
}

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading session...</p>
          </div>
        </div>
      }
    >
      <SessionPageContent />
    </Suspense>
  );
}
