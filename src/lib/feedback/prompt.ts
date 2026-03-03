// TODO: Define Claude prompt template for feedback generation

export function buildFeedbackPrompt(transcript: string, personaId: string): string {
  return `Analyze this pitch session transcript and provide detailed feedback.\n\nTranscript:\n${transcript}`;
}
