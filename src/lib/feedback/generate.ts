import type { FeedbackResponse, SessionMetrics } from '@/types/feedback';
import type { TranscriptEntry, ConversationConfig } from '@/types/session';
import { buildFeedbackPrompt } from './prompt';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
}

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

interface FeedbackJSON {
  scores: {
    clarity: number;
    confidence: number;
    structure: number;
  };
  overallSummary: string;
  strengths: string[];
  improvements: string[];
  notableMoments: Array<{
    timestamp: number;
    observation: string;
  }>;
}

export async function generateFeedback(
  sessionId: string,
  transcript: TranscriptEntry[],
  config: ConversationConfig,
  metrics: SessionMetrics
): Promise<FeedbackResponse> {
  const prompt = buildFeedbackPrompt({
    transcript,
    persona: config.persona,
    presentationTitle: config.presentationTitle,
    presentationContext: config.presentationContext,
    durationSeconds: config.durationSeconds,
    metrics,
  });

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const requestBody: ClaudeRequest = {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ClaudeResponse;
    
    if (!data.content || data.content.length === 0 || !data.content[0]) {
      throw new Error('Empty response from Claude API');
    }
    
    let jsonText = data.content[0].text;
    
    if (!jsonText) {
      throw new Error('No text content in Claude response');
    }

    // Strip markdown code fences if present
    jsonText = jsonText.replace(/^```json?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

    const feedbackData = JSON.parse(jsonText) as FeedbackJSON;

    // Validate scores are integers 1-5
    const isValidScore = (score: number): boolean => {
      return Number.isInteger(score) && score >= 1 && score <= 5;
    };

    // Validate strengths and improvements are arrays of 2-4 strings
    const isValidArray = (arr: unknown): arr is string[] => {
      return (
        Array.isArray(arr) &&
        arr.length >= 2 &&
        arr.length <= 4 &&
        arr.every((item) => typeof item === 'string')
      );
    };

    if (
      !isValidScore(feedbackData.scores.clarity) ||
      !isValidScore(feedbackData.scores.confidence) ||
      !isValidScore(feedbackData.scores.structure) ||
      !isValidArray(feedbackData.strengths) ||
      !isValidArray(feedbackData.improvements)
    ) {
      throw new Error('Invalid feedback data structure');
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback/${sessionId}`;

    return {
      scores: feedbackData.scores,
      overallSummary: feedbackData.overallSummary,
      strengths: feedbackData.strengths,
      improvements: feedbackData.improvements,
      notableMoments: feedbackData.notableMoments || [],
      metrics,
      shareUrl,
    };
  } catch (error) {
    console.error('Failed to generate feedback:', error);

    // Return default feedback on error
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback/${sessionId}`;

    return {
      scores: {
        clarity: 3,
        confidence: 3,
        structure: 3,
      },
      overallSummary:
        'We encountered an issue analyzing your presentation. Please try again or contact support.',
      strengths: [
        'You completed the practice session',
        'You engaged with the AI buyer persona',
      ],
      improvements: [
        'Try practicing again for more detailed feedback',
        'Ensure a stable internet connection',
      ],
      notableMoments: [],
      metrics,
      shareUrl,
    };
  }
}
