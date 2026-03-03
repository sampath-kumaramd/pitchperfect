export interface FeedbackScores {
  clarity: number;
  confidence: number;
  structure: number;
}

export interface NotableMoment {
  timestamp: number;
  observation: string;
}

export interface SessionMetrics {
  averageWPM: number;
  fillerWordCount: number;
  fillerWords: Record<string, number>;
  totalSilenceSeconds: number;
  totalWords: number;
}

export interface FeedbackResponse {
  scores: FeedbackScores;
  overallSummary: string;
  strengths: string[];
  improvements: string[];
  notableMoments: NotableMoment[];
  metrics: SessionMetrics;
  shareUrl: string;
}
