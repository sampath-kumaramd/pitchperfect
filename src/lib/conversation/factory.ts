import { OpenAIRealtimeProvider } from './openai-realtime';
import type { ConversationProvider } from './types';

export function createConversationProvider(
  providerType: 'openai-realtime'
): ConversationProvider {
  switch (providerType) {
    case 'openai-realtime':
      return new OpenAIRealtimeProvider();
    default:
      throw new Error(`Unknown provider type: ${providerType}`);
  }
}
