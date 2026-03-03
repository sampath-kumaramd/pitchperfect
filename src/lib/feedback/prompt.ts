import type { TranscriptEntry } from '@/types/session';
import type { SessionMetrics } from '@/types/feedback';
import type { PersonaType } from '@/types/persona';

interface FeedbackPromptParams {
  transcript: TranscriptEntry[];
  persona: PersonaType;
  presentationTitle: string;
  presentationContext: string;
  durationSeconds: number;
  metrics: SessionMetrics;
}

export function buildFeedbackPrompt(params: FeedbackPromptParams): string {
  const {
    transcript,
    persona,
    presentationTitle,
    presentationContext,
    durationSeconds,
    metrics,
  } = params;

  const transcriptText = transcript
    .map((entry) => `[${entry.role === 'user' ? 'Presenter' : 'Buyer'}]: ${entry.text}`)
    .join('\n');

  const durationMinutes = Math.floor(durationSeconds / 60);
  const durationSeconds_ = durationSeconds % 60;

  return `You are an expert pitch coach analyzing a practice sales presentation. The presenter practiced with an AI buyer persona to prepare for a real pitch meeting.

PRESENTATION DETAILS:
- Title: ${presentationTitle}
- Context: ${presentationContext}
- Buyer Persona: ${persona}
- Duration: ${durationMinutes}m ${durationSeconds_}s
- Total Words: ${metrics.totalWords}
- Average WPM: ${metrics.averageWPM}
- Filler Word Count: ${metrics.fillerWordCount}
- Total Silence: ${metrics.totalSilenceSeconds}s

TRANSCRIPT:
${transcriptText}

Your task is to provide constructive feedback on the presenter's performance using this EXACT scoring rubric:

Clarity: 1=Incoherent -> 5=Crystal clear precise language
Confidence: 1=Constant hesitation many fillers -> 5=Commanding assertive no fillers
Structure: 1=No discernible flow -> 5=Compelling arc strong open/close

Analyze the presenter's:
- Clarity: Were their explanations clear and easy to follow? Did they use precise language?
- Confidence: Did they speak with authority? How many filler words (um, uh, like, you know) did they use?
- Structure: Was there a logical flow? Did they have a strong opening and closing?

Identify 2-4 specific strengths and 2-4 actionable improvements. Include notable moments from the transcript with timestamps (in seconds from start).

Respond ONLY with valid JSON matching this exact schema:
{ scores: { clarity: 1-5, confidence: 1-5, structure: 1-5 }, overallSummary: string, strengths: string[] (2-4 items), improvements: string[] (2-4 items), notableMoments: Array<{ timestamp: number, observation: string }> }`;
}
