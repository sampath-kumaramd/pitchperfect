// TODO: Define ConversationProvider interface and related types for AI abstraction

export interface ConversationProvider {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendAudio: (audioData: ArrayBuffer) => void;
  onTranscript: (callback: (text: string, speaker: string) => void) => void;
  onAudioReceived: (callback: (audio: ArrayBuffer) => void) => void;
}

export type ConversationStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
