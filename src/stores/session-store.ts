import { create } from 'zustand';

// TODO: Implement session state machine: idle->configuring->ready->connecting->active->ending->feedback

interface SessionState {
  status: 'idle' | 'configuring' | 'ready' | 'connecting' | 'active' | 'ending' | 'feedback';
  sessionId: string | null;
  personaId: string | null;
  duration: number;
  setStatus: (status: SessionState['status']) => void;
  setSessionId: (id: string) => void;
  setPersona: (id: string) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'idle',
  sessionId: null,
  personaId: null,
  duration: 5,
  setStatus: (status) => set({ status }),
  setSessionId: (sessionId) => set({ sessionId }),
  setPersona: (personaId) => set({ personaId }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ status: 'idle', sessionId: null, personaId: null, duration: 5 }),
}));
