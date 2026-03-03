import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { SessionMetrics } from '@/types/feedback';
import type { TranscriptEntry } from '@/types/session';
import { getSession, saveFeedback, getFeedback } from '@/lib/storage';
import { generateFeedback } from '@/lib/feedback/generate';

const TranscriptEntrySchema = z.object({
  role: z.enum(['user', 'agent']),
  text: z.string(),
  timestamp: z.number(),
});

const SessionMetricsSchema = z.object({
  averageWPM: z.number(),
  fillerWordCount: z.number(),
  fillerWords: z.record(z.string(), z.number()),
  totalSilenceSeconds: z.number(),
  totalWords: z.number(),
});

const FeedbackRequestSchema = z.object({
  transcript: z.array(TranscriptEntrySchema),
  metrics: SessionMetricsSchema,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedback = await getFeedback(id);

    if (!feedback) {
      return NextResponse.json(
        {
          error: 'Feedback not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    console.error('[API GET /sessions/[id]/feedback]', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = FeedbackRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        {
          error: firstError?.message || 'Validation failed',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const { transcript, metrics } = validationResult.data;

    const session = await getSession(id);

    if (!session) {
      return NextResponse.json(
        {
          error: 'Session not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const feedback = await generateFeedback(
      id,
      transcript as TranscriptEntry[],
      session.config,
      metrics as SessionMetrics
    );

    await saveFeedback(id, feedback);

    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    console.error('[API /sessions/[id]/feedback]', error);

    if (error instanceof Error) {
      if (error.message.includes('Failed to get session')) {
        return NextResponse.json(
          {
            error: 'Failed to retrieve session',
            code: 'STORAGE_ERROR',
          },
          { status: 500 }
        );
      }

      if (error.message.includes('Failed to save feedback')) {
        return NextResponse.json(
          {
            error: 'Failed to save feedback',
            code: 'STORAGE_ERROR',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
