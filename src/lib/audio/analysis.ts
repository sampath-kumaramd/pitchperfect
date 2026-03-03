import { TranscriptEntry } from '@/types/session';

export const FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'basically',
  'actually',
  'so',
  'right',
] as const;

export function calculateWPM(
  entries: TranscriptEntry[],
  windowMs: number = 30000
): number {
  const now = Date.now();
  const windowStart = now - windowMs;

  const userEntries = entries.filter(
    (entry) => entry.role === 'user' && entry.timestamp >= windowStart
  );

  if (userEntries.length === 0) {
    return 0;
  }

  const totalWords = userEntries.reduce((sum, entry) => {
    return sum + countTotalWords(entry.text);
  }, 0);

  return Math.round((totalWords / windowMs) * 60000);
}

export function detectFillerWords(text: string): Record<string, number> {
  const lowerText = text.toLowerCase();
  const counts: Record<string, number> = {};

  for (const filler of FILLER_WORDS) {
    const pattern = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(pattern);
    if (matches) {
      counts[filler] = matches.length;
    }
  }

  return counts;
}

export function countTotalWords(text: string): number {
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  return words.length;
}
