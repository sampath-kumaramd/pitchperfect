import type { ConversationProvider } from './types';

// TODO: Implement OpenAI Realtime API provider via WebSocket relay through /api/realtime

export function createOpenAIRealtimeProvider(): ConversationProvider {
  return {
    connect: async () => {
      throw new Error('Not implemented');
    },
    disconnect: async () => {
      throw new Error('Not implemented');
    },
    sendAudio: () => {
      throw new Error('Not implemented');
    },
    onTranscript: () => {
      throw new Error('Not implemented');
    },
    onAgentAudio: () => {
      throw new Error('Not implemented');
    },
    onAgentTranscript: () => {
      throw new Error('Not implemented');
    },
    onError: () => {
      throw new Error('Not implemented');
    },
    onStateChange: () => {
      throw new Error('Not implemented');
    },
    getFullTranscript: () => {
      throw new Error('Not implemented');
    },
    isConnected: () => {
      throw new Error('Not implemented');
    },
  };
}
