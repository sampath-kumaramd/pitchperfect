import type { FeedbackResponse } from '@/types/feedback';

// TODO: Implement feedback generation using Claude API with transcript analysis

export async function generateFeedback(
  transcript: string,
  sessionId: string
): Promise<FeedbackResponse> {
  throw new Error('Not implemented');
}
