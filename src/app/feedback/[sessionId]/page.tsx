// TODO: Implement feedback display page with scores, analysis, and share functionality

interface FeedbackPageProps {
  params: {
    sessionId: string;
  };
}

export default function FeedbackDetailPage({ params }: FeedbackPageProps) {
  return (
    <div>
      <h1>Feedback for Session {params.sessionId}</h1>
    </div>
  );
}
