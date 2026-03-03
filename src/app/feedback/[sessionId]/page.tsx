import Link from 'next/link';
import { getFeedback } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyShareButton } from '@/components/feedback/CopyShareButton';

interface FeedbackPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function FeedbackDetailPage({ params }: FeedbackPageProps) {
  const { sessionId } = await params;
  const feedback = await getFeedback(sessionId);

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Feedback Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              This feedback has expired or does not exist.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/setup">Start New Practice Session</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Your Practice Feedback</h1>
          <p className="text-lg text-gray-600">Review your performance and insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{feedback.overallSummary}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-600">
                {feedback.scores.clarity}/5
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-600">
                {feedback.scores.confidence}/5
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-600">
                {feedback.scores.structure}/5
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-amber-600">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">→</span>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {feedback.notableMoments && feedback.notableMoments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Notable Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.notableMoments.map((moment, index) => (
                  <li key={index} className="border-l-4 border-indigo-600 pl-4">
                    <div className="text-sm text-gray-500 mb-1">
                      {Math.floor(moment.timestamp / 60)}:{String(moment.timestamp % 60).padStart(2, '0')}
                    </div>
                    <div className="text-gray-700">{moment.observation}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Session Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Average WPM</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {feedback.metrics.averageWPM}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Words</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {feedback.metrics.totalWords}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Filler Words</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {feedback.metrics.fillerWordCount}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Silence</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {Math.round(feedback.metrics.totalSilenceSeconds)}s
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/setup">Practice Again</Link>
          </Button>
          <CopyShareButton shareUrl={feedback.shareUrl} />
        </div>
      </div>
    </div>
  );
}
