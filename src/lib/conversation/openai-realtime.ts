import type { ConversationProvider } from './types';
import type { ConversationConfig, TranscriptEntry, ConnectionState } from '@/types/session';
import { getPersonaPrompt } from '@/lib/personas/prompts';

export class OpenAIRealtimeProvider implements ConversationProvider {
  private ws: WebSocket | null = null;
  private transcript: TranscriptEntry[] = [];
  private connected = false;

  private transcriptCallback: ((entry: TranscriptEntry) => void) | null = null;
  private agentAudioCallback: ((chunk: ArrayBuffer) => void) | null = null;
  private agentTranscriptCallback: ((entry: TranscriptEntry) => void) | null = null;
  private errorCallback: ((error: Error) => void) | null = null;
  private stateChangeCallback: ((state: ConnectionState) => void) | null = null;

  async connect(config: ConversationConfig): Promise<void> {
    try {
      const response = await fetch('/api/realtime/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: config.sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
      }

      const { token } = await response.json();

      const wsUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';
      this.ws = new WebSocket(wsUrl, ['realtime', `openai-insecure-api-key.${token}`]);

      this.ws.addEventListener('open', () => {
        const sessionUpdate = {
          type: 'session.update',
          session: {
            instructions: getPersonaPrompt(config),
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              silence_duration_ms: 500,
            },
          },
        };

        this.ws?.send(JSON.stringify(sessionUpdate));
      });

      this.ws.addEventListener('message', (event) => {
        this.handleMessage(event.data);
      });

      this.ws.addEventListener('error', () => {
        const error = new Error('WebSocket error occurred');
        this.errorCallback?.(error);
      });

      this.ws.addEventListener('close', () => {
        this.connected = false;
        this.stateChangeCallback?.('disconnected');
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during connect');
      this.errorCallback?.(err);
      throw err;
    }
  }

  private handleMessage(data: string): void {
    try {
      const event = JSON.parse(data);

      switch (event.type) {
        case 'session.created':
          this.connected = true;
          this.stateChangeCallback?.('connected');
          break;

        case 'response.audio.delta':
          if (event.delta) {
            const audioData = this.base64ToArrayBuffer(event.delta);
            this.agentAudioCallback?.(audioData);
          }
          break;

        case 'response.audio_transcript.delta':
          if (event.delta) {
            const entry: TranscriptEntry = {
              role: 'agent',
              text: event.delta,
              timestamp: Date.now(),
            };
            this.transcript.push(entry);
            this.agentTranscriptCallback?.(entry);
          }
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (event.transcript) {
            const entry: TranscriptEntry = {
              role: 'user',
              text: event.transcript,
              timestamp: Date.now(),
            };
            this.transcript.push(entry);
            this.transcriptCallback?.(entry);
          }
          break;

        case 'error':
          const error = new Error(event.error?.message || 'Unknown OpenAI error');
          this.errorCallback?.(error);
          break;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to parse message');
      this.errorCallback?.(err);
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      if (byte !== undefined) {
        binary += String.fromCharCode(byte);
      }
    }
    return btoa(binary);
  }

  sendAudio(chunk: ArrayBuffer): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const base64Audio = this.arrayBufferToBase64(chunk);
    const event = {
      type: 'input_audio_buffer.append',
      audio: base64Audio,
    };

    this.ws.send(JSON.stringify(event));
  }

  onTranscript(cb: (entry: TranscriptEntry) => void): void {
    this.transcriptCallback = cb;
  }

  onAgentAudio(cb: (chunk: ArrayBuffer) => void): void {
    this.agentAudioCallback = cb;
  }

  onAgentTranscript(cb: (entry: TranscriptEntry) => void): void {
    this.agentTranscriptCallback = cb;
  }

  onError(cb: (error: Error) => void): void {
    this.errorCallback = cb;
  }

  onStateChange(cb: (state: ConnectionState) => void): void {
    this.stateChangeCallback = cb;
  }

  getFullTranscript(): TranscriptEntry[] {
    return [...this.transcript];
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.stateChangeCallback?.('disconnecting');
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.transcript = [];
      this.transcriptCallback = null;
      this.agentAudioCallback = null;
      this.agentTranscriptCallback = null;
      this.errorCallback = null;
      this.stateChangeCallback = null;
    }
  }

  isConnected(): boolean {
    return this.connected && (this.ws?.readyState ?? WebSocket.CLOSED) === WebSocket.OPEN;
  }
}
