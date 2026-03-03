// TODO: Define feedback result types for API responses

export interface FeedbackResult {
  sessionId: string;
  overallScore: number;
  scores: {
    clarity: number;
    confidence: number;
    structure: number;
    engagement: number;
  };
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  generatedAt: number;
}
