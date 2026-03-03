import type { ConversationProvider } from './types';

// TODO: Implement OpenAI Realtime API provider via WebSocket relay through /api/realtime

export function createOpenAIRealtimeProvider(): ConversationProvider {
  return {
    connect: async () => {
      throw new Error('Not implemented');
    },
    disconnect: () => {
      throw new Error('Not implemented');
    },
    sendAudio: () => {
      throw new Error('Not implemented');
    },
    onTranscript: () => {
      throw new Error('Not implemented');
    },
    onAudioReceived: () => {
      throw new Error('Not implemented');
    },
  };
}
