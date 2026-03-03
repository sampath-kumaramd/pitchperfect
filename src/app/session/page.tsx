'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SessionView } from '@/components/session/SessionView';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { createConversationProvider } from '@/lib/conversation/factory';
import type { ConversationProvider } from '@/lib/conversation/types';
import { MicCapture } from '@/lib/audio/capture';
import { AudioPlaybackQueue } from '@/lib/audio/playback';
import { useSessionStore } from '@/stores/session-store';
import { useTranscriptStore } from '@/stores/transcript-store';
import { useAudioStore } from '@/stores/audio-store';
import { calculateWPM } from '@/lib/audio/analysis';
import { track } from '@/lib/analytics';

const RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL_MS = 2000;

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

function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'your browser';
}

function getMicPermissionInstructions(): string {
  const browser = getBrowserName();
  switch (browser) {
    case 'Chrome':
    case 'Edge':
      return 'Click the camera icon in the address bar, then select "Always allow" and click "Done".';
    case 'Firefox':
      return 'Click the microphone icon in the address bar, remove the block, and reload the page.';
    case 'Safari':
      return 'Go to Safari > Settings > Websites > Microphone, and select "Allow" for this website.';
    default:
      return 'Check your browser settings to enable microphone access for this website.';
  }
}

interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry?: () => void;
  onBackToSetup: () => void;
  showRetry?: boolean;
}

function ErrorDisplay({ title, message, onRetry, onBackToSetup, showRetry = false }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex gap-3 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          )}
          <button
            onClick={onBackToSetup}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Setup
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackLoadingDisplay({ isTimeout }: { isTimeout: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium mb-2">Generating your feedback...</p>
        {isTimeout && (
          <p className="text-amber-600 text-sm">Taking longer than expected. Please wait...</p>
        )}
      </div>
    </div>
  );
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

  const [errorType, setErrorType] = useState<'mic' | 'websocket' | 'session' | 'feedback' | 'general' | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isFeedbackTimeout, setIsFeedbackTimeout] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const providerRef = useRef<ConversationProvider | null>(null);
  const micCaptureRef = useRef<MicCapture | null>(null);
  const playbackQueueRef = useRef<AudioPlaybackQueue | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          if (response.status === 404) {
            setErrorType('session');
            setError('Session not found or has expired');
          } else {
            throw new Error('Failed to fetch session');
          }
          return;
        }

        const data = await response.json();
        setConfig(data.config);

        await setupProviderAndAudio(data.config);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
        setError(errorMessage);
        setErrorType('general');
      }
    }

    initializeSession();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, router, setConfig, setError]);

  async function setupProviderAndAudio(sessionConfig: NonNullable<typeof config>) {
    try {
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
        console.error('[Session] Provider error:', err);
        if (sessionId) {
          track('session_error', { 
            sessionId, 
            errorType: err.message.includes('WebSocket') ? 'websocket' : 'provider',
            errorMessage: err.message 
          });
        }
        if (err.message.includes('WebSocket')) {
          handleWebSocketDisconnect();
        } else {
          setError(err.message);
          setErrorType('general');
        }
      });

      provider.onStateChange((state) => {
        console.log('[Session] Connection state:', state);
        if (state === 'disconnected' && !isReconnecting) {
          handleWebSocketDisconnect();
        }
      });

      await provider.connect(sessionConfig);

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

      try {
        await micCapture.start();
        startRecording();
      } catch (micError) {
        if (micError instanceof Error) {
          if (micError.message.includes('permission denied')) {
            track('mic_permission_denied', { browser: navigator.userAgent });
            setErrorType('mic');
            setError(`Microphone access denied.\n\n${getMicPermissionInstructions()}`);
          } else {
            setError(micError.message);
            setErrorType('general');
          }
        }
        return;
      }

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup session';
      setError(errorMessage);
      setErrorType('general');
    }
  }

  function handleWebSocketDisconnect() {
    if (reconnectAttempts >= RECONNECT_ATTEMPTS) {
      setErrorType('websocket');
      setError('Lost connection to AI agent');
      return;
    }

    setIsReconnecting(true);
    const nextAttempt = reconnectAttempts + 1;
    setReconnectAttempts(nextAttempt);

    console.log(`[Session] Reconnecting... Attempt ${nextAttempt}/${RECONNECT_ATTEMPTS}`);

    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        if (config && providerRef.current) {
          await providerRef.current.disconnect();
          await setupProviderAndAudio(config);
          setReconnectAttempts(0);
          setIsReconnecting(false);
        }
      } catch (err) {
        console.error('[Session] Reconnect failed:', err);
        handleWebSocketDisconnect();
      }
    }, RECONNECT_INTERVAL_MS);
  }

  function handleManualReconnect() {
    setReconnectAttempts(0);
    setIsReconnecting(false);
    setErrorType(null);
    setError(null);
    if (config) {
      setupProviderAndAudio(config);
    }
  }

  function cleanup() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
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
  }

  useEffect(() => {
    const durationSeconds = config?.durationSeconds ?? 0;
    if (durationSeconds > 0 && elapsedSeconds >= durationSeconds) {
      async function endSessionFlow() {
        try {
          setIsGeneratingFeedback(true);

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

          const totalWords = entries.reduce((sum, entry) => {
            if (entry.role === 'user') {
              return sum + (entry.text?.split(/\s+/).filter(w => w.length > 0).length || 0);
            }
            return sum;
          }, 0);

          track('session_completed', { 
            sessionId, 
            duration: elapsedSeconds, 
            totalWords 
          });

          feedbackTimeoutRef.current = setTimeout(() => {
            setIsFeedbackTimeout(true);
          }, 15000);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          try {
            const response = await fetch(`/api/sessions/${sessionId}/feedback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript: entries,
              }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);
            if (feedbackTimeoutRef.current) {
              clearTimeout(feedbackTimeoutRef.current);
            }

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to generate feedback');
            }

            router.push(`/feedback?sessionId=${sessionId}`);
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              setErrorType('feedback');
              setError('Request timed out while generating feedback');
            } else {
              throw fetchError;
            }
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
          setError(errorMessage);
          setErrorType('general');
        } finally {
          setIsGeneratingFeedback(false);
          setIsFeedbackTimeout(false);
        }
      }

      endSessionFlow();
    }
  }, [elapsedSeconds, config, sessionId, entries, router, setError, stopRecording]);

  if (isGeneratingFeedback) {
    return <FeedbackLoadingDisplay isTimeout={isFeedbackTimeout} />;
  }

  if (errorType === 'mic') {
    return (
      <ErrorDisplay
        title="Microphone Access Required"
        message={error || 'Microphone access is required to use PitchPerfect'}
        onBackToSetup={() => router.push('/setup')}
      />
    );
  }

  if (errorType === 'websocket') {
    return (
      <ErrorDisplay
        title="Connection Lost"
        message={error || 'Lost connection to AI agent'}
        onRetry={handleManualReconnect}
        onBackToSetup={() => router.push('/setup')}
        showRetry
      />
    );
  }

  if (errorType === 'session') {
    return (
      <ErrorDisplay
        title="Session Expired"
        message="This session has expired or could not be found. Please start a new session."
        onBackToSetup={() => router.push('/setup')}
      />
    );
  }

  if (errorType === 'feedback') {
    return (
      <ErrorDisplay
        title="Feedback Generation Timeout"
        message={error || 'The feedback generation is taking longer than expected.'}
        onRetry={() => {
          setErrorType(null);
          setError(null);
          if (sessionId) {
            router.push(`/feedback?sessionId=${sessionId}`);
          }
        }}
        onBackToSetup={() => router.push('/setup')}
        showRetry
      />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Session Error"
        message={error}
        onBackToSetup={() => router.push('/setup')}
      />
    );
  }

  if (isReconnecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium mb-2">Reconnecting to AI agent...</p>
          <p className="text-sm text-gray-600">
            Attempt {reconnectAttempts} of {RECONNECT_ATTEMPTS}
          </p>
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

  return (
    <ErrorBoundary>
      <SessionView />
    </ErrorBoundary>
  );
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
