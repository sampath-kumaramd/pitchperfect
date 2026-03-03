import { kv } from '@vercel/kv';

const MAX_REQUESTS_PER_HOUR = 10;
const RATE_LIMIT_TTL = 3600;

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  try {
    const key = `ratelimit:${ip}`;
    const count = await kv.incr(key);

    if (count === 1) {
      await kv.expire(key, RATE_LIMIT_TTL);
    }

    const allowed = count <= MAX_REQUESTS_PER_HOUR;
    const remaining = Math.max(0, MAX_REQUESTS_PER_HOUR - count);
    const resetAt = Date.now() + RATE_LIMIT_TTL * 1000;

    return {
      allowed,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error(`Rate limit check failed for IP ${ip}:`, error);
    throw new Error(`Rate limit check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
