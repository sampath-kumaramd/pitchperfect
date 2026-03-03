import type { ConversationProvider } from './types';
import { createOpenAIRealtimeProvider } from './openai-realtime';

export function createConversationProvider(type: 'openai-realtime'): ConversationProvider {
  if (type === 'openai-realtime') {
    return createOpenAIRealtimeProvider();
  }
  
  throw new Error(`Unknown conversation provider type: ${type}`);
}

export type { ConversationProvider };
