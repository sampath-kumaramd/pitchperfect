import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaType } from '@/types/persona';
import type { ConversationConfig } from '@/types/session';
import { createSession } from '@/lib/storage';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateId } from '@/lib/utils';

const CreateSessionSchema = z.object({
  userName: z.string().min(2).max(50).trim(),
  presentationTitle: z.string().min(5).max(100).trim(),
  presentationContext: z.string().min(10).max(500).trim(),
  persona: z.enum([
    PersonaType.CURIOUS,
    PersonaType.SKEPTICAL,
    PersonaType.FRIENDLY,
    PersonaType.NEUTRAL,
  ]),
  durationMinutes: z.number().int().min(2).max(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = CreateSessionSchema.safeParse(body);
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

    const data = validationResult.data;

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT',
        },
        { status: 429 }
      );
    }

    const sessionId = generateId();
    const durationSeconds = data.durationMinutes * 60;

    const config: ConversationConfig = {
      sessionId,
      persona: data.persona,
      presentationTitle: data.presentationTitle,
      presentationContext: data.presentationContext,
      durationSeconds,
      userName: data.userName,
    };

    await createSession(sessionId, config);

    return NextResponse.json(
      {
        sessionId,
        config,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /sessions]', error);

    if (error instanceof Error && error.message.includes('Failed to create session')) {
      return NextResponse.json(
        {
          error: 'Failed to create session',
          code: 'STORAGE_ERROR',
        },
        { status: 500 }
      );
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
