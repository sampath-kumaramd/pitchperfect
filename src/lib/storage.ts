// TODO: Implement Vercel KV storage operations for sessions and feedback

export async function saveSession(sessionId: string, data: unknown): Promise<void> {
  throw new Error('Not implemented');
}

export async function getSession(sessionId: string): Promise<unknown> {
  throw new Error('Not implemented');
}

export async function saveFeedback(sessionId: string, feedback: unknown): Promise<void> {
  throw new Error('Not implemented');
}
