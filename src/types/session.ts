// TODO: Define session-related types for API and state management

export interface Session {
  id: string;
  personaId: string;
  duration: number;
  startedAt: number;
  endedAt?: number;
  transcript: string;
}

export interface SessionConfig {
  personaId: string;
  duration: number;
}
