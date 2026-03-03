import { kv } from '@vercel/kv';
import type { ConversationConfig, SessionData } from '@/types/session';
import type { FeedbackResponse } from '@/types/feedback';

const SESSION_TTL = 60 * 60 * 24;
const FEEDBACK_TTL = 60 * 60 * 24 * 7;

export async function createSession(id: string, config: ConversationConfig): Promise<void> {
  try {
    const sessionData: SessionData = {
      config,
      createdAt: new Date().toISOString(),
      status: 'idle',
    };
    await kv.set(`session:${id}`, sessionData, { ex: SESSION_TTL });
  } catch (error) {
    console.error(`Failed to create session ${id}:`, error);
    throw new Error(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getSession(id: string): Promise<SessionData | null> {
  try {
    const data = await kv.get<SessionData>(`session:${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to get session ${id}:`, error);
    throw new Error(`Failed to get session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveFeedback(id: string, feedback: FeedbackResponse): Promise<void> {
  try {
    await kv.set(`feedback:${id}`, feedback, { ex: FEEDBACK_TTL });
  } catch (error) {
    console.error(`Failed to save feedback for session ${id}:`, error);
    throw new Error(`Failed to save feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getFeedback(id: string): Promise<FeedbackResponse | null> {
  try {
    const data = await kv.get<FeedbackResponse>(`feedback:${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to get feedback for session ${id}:`, error);
    throw new Error(`Failed to get feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
