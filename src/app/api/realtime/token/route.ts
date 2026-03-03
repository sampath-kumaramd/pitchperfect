import { NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  model: z
    .string()
    .optional()
    .default('gpt-4o-realtime-preview-2024-12-17'),
  voice: z
    .enum(['alloy', 'echo', 'shimmer'])
    .optional()
    .default('alloy'),
});

interface OpenAIRealtimeSessionResponse {
  id: string;
  object: string;
  model: string;
  expires_at: number;
  client_secret: {
    value: string;
    expires_at: number;
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('[API /realtime/token] OPENAI_API_KEY not configured');
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          code: 'CONFIGURATION_ERROR',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validationResult = RequestSchema.safeParse(body);

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

    const { model, voice } = validationResult.data;

    const response = await fetch(
      'https://api.openai.com/v1/realtime/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          voice,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        '[API /realtime/token] OpenAI API error:',
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error: 'Failed to create realtime session',
          code: 'OPENAI_ERROR',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const sessionData =
      (await response.json()) as OpenAIRealtimeSessionResponse;

    return NextResponse.json(
      {
        token: sessionData.client_secret.value,
        expiresAt: sessionData.client_secret.expires_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /realtime/token]', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'INTERNAL_ERROR',
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
