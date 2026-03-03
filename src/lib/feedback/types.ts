// TODO: Define feedback-specific types and scoring structure

export interface FeedbackScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface FeedbackAnalysis {
  scores: FeedbackScore[];
  strengths: string[];
  improvements: string[];
  overallScore: number;
}
