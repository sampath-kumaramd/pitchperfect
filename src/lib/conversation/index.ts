import type { ConversationProvider } from './types';
import { OpenAIRealtimeProvider } from './openai-realtime';

export function createConversationProvider(type: 'openai-realtime'): ConversationProvider {
  if (type === 'openai-realtime') {
    return new OpenAIRealtimeProvider();
  }
  
  throw new Error(`Unknown conversation provider type: ${type}`);
}

export type { ConversationProvider };
