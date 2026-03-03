import { PersonaType } from './persona';

export const SessionState = {
  IDLE: 'idle',
  CONFIGURING: 'configuring',
  READY: 'ready',
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  ENDING: 'ending',
  FEEDBACK: 'feedback',
  ERROR: 'error',
} as const;

export type SessionState = typeof SessionState[keyof typeof SessionState];

export interface ConversationConfig {
  sessionId: string;
  persona: PersonaType;
  presentationTitle: string;
  presentationContext: string;
  durationSeconds: number;
  userName: string;
}

export interface TranscriptEntry {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export const ConnectionState = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnecting',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

export type ConnectionState = typeof ConnectionState[keyof typeof ConnectionState];

export interface SessionData {
  config: ConversationConfig;
  createdAt: string;
  status: SessionState;
}
