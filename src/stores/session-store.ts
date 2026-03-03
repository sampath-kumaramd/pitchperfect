import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SessionState, ConversationConfig } from '@/types/session';

interface SessionStore {
  state: SessionState;
  config: ConversationConfig | null;
  sessionId: string | null;
  startTime: number | null;
  elapsedSeconds: number;
  error: string | null;
  setConfig: (config: ConversationConfig) => void;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  resetSession: () => void;
  setError: (error: string | null) => void;
  tick: () => void;
}

const VALID_TRANSITIONS: Record<SessionState, SessionState[]> = {
  idle: ['configuring'],
  configuring: ['connecting', 'idle'],
  ready: ['connecting'],
  connecting: ['active', 'error'],
  active: ['ending', 'error'],
  ending: ['feedback', 'error'],
  feedback: ['configuring', 'idle'],
  error: ['configuring', 'idle'],
};

function canTransition(from: SessionState, to: SessionState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export const useSessionStore = create<SessionStore>()(
  devtools(
    (set, get) => ({
      state: 'idle',
      config: null,
      sessionId: null,
      startTime: null,
      elapsedSeconds: 0,
      error: null,

      setConfig: (config) => {
        const currentState = get().state;
        if (!canTransition(currentState, 'configuring')) {
          console.error(`Cannot set config: invalid transition from ${currentState} to configuring`);
          return;
        }
        set({ config, state: 'configuring', error: null }, false, 'setConfig');
      },

      startSession: async () => {
        const { state: currentState, config } = get();

        if (!config) {
          set({ error: 'No configuration set' }, false, 'startSession/error');
          return;
        }

        if (!canTransition(currentState, 'connecting')) {
          console.error(`Cannot start session: invalid transition from ${currentState} to connecting`);
          set({ error: `Cannot start session from ${currentState} state` }, false, 'startSession/error');
          return;
        }

        set({ state: 'connecting', error: null }, false, 'startSession/connecting');

        try {
          const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
          });

          if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
          }

          const data = await response.json();
          set(
            {
              sessionId: data.sessionId,
              startTime: Date.now(),
              state: 'active',
            },
            false,
            'startSession/success'
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
          set({ state: 'error', error: errorMessage }, false, 'startSession/error');
        }
      },

      endSession: async () => {
        const { state: currentState, sessionId } = get();

        if (!canTransition(currentState, 'ending')) {
          console.error(`Cannot end session: invalid transition from ${currentState} to ending`);
          set({ error: `Cannot end session from ${currentState} state` }, false, 'endSession/error');
          return;
        }

        if (!sessionId) {
          set({ error: 'No active session' }, false, 'endSession/error');
          return;
        }

        set({ state: 'ending' }, false, 'endSession/ending');

        try {
          const response = await fetch(`/api/sessions/${sessionId}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error(`Failed to generate feedback: ${response.statusText}`);
          }

          set({ state: 'feedback' }, false, 'endSession/success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate feedback';
          set({ state: 'error', error: errorMessage }, false, 'endSession/error');
        }
      },

      resetSession: () => {
        const currentState = get().state;
        if (!canTransition(currentState, 'configuring') && !canTransition(currentState, 'idle')) {
          console.error(`Cannot reset session: invalid transition from ${currentState}`);
          return;
        }

        set(
          {
            state: 'configuring',
            sessionId: null,
            startTime: null,
            elapsedSeconds: 0,
            error: null,
          },
          false,
          'resetSession'
        );
      },

      setError: (error) => {
        set({ error, state: error ? 'error' : get().state }, false, 'setError');
      },

      tick: () => {
        set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }), false, 'tick');
      },
    }),
    { name: 'SessionStore' }
  )
);
