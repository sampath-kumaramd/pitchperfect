import type { ConversationConfig, TranscriptEntry, ConnectionState } from '@/types/session';

export interface ConversationProvider {
  connect(config: ConversationConfig): Promise<void>;
  sendAudio(chunk: ArrayBuffer): void;
  onTranscript(cb: (entry: TranscriptEntry) => void): void;
  onAgentAudio(cb: (chunk: ArrayBuffer) => void): void;
  onAgentTranscript(cb: (entry: TranscriptEntry) => void): void;
  onError(cb: (error: Error) => void): void;
  onStateChange(cb: (state: ConnectionState) => void): void;
  getFullTranscript(): TranscriptEntry[];
  disconnect(): Promise<void>;
  isConnected(): boolean;
}
