import { describe, it, expect } from 'vitest';
import {
  calculateWPM,
  detectFillerWords,
  countTotalWords,
  FILLER_WORDS,
} from '../analysis';
import { TranscriptEntry } from '@/types/session';

describe('calculateWPM', () => {
  it('should return 0 for empty entries', () => {
    const entries: TranscriptEntry[] = [];
    expect(calculateWPM(entries)).toBe(0);
  });

  it('should return 0 for entries outside window', () => {
    const now = Date.now();
    const entries: TranscriptEntry[] = [
      {
        role: 'user',
        text: 'hello world',
        timestamp: now - 40000, // 40 seconds ago, outside default 30s window
      },
    ];
    expect(calculateWPM(entries)).toBe(0);
  });

  it('should calculate WPM for typical entries', () => {
    const now = Date.now();
    const entries: TranscriptEntry[] = [
      {
        role: 'user',
        text: 'hello world this is a test',
        timestamp: now - 5000, // 5 seconds ago
      },
      {
        role: 'user',
        text: 'another test sentence here',
        timestamp: now - 2000, // 2 seconds ago
      },
    ];
    // Total: 10 words in 30000ms window
    // WPM = (10 / 30000) * 60000 = 20
    expect(calculateWPM(entries)).toBe(20);
  });

  it('should only count user entries, not agent entries', () => {
    const now = Date.now();
    const entries: TranscriptEntry[] = [
      {
        role: 'user',
        text: 'hello world',
        timestamp: now - 5000,
      },
      {
        role: 'agent',
        text: 'this should not be counted at all',
        timestamp: now - 3000,
      },
    ];
    // Only 2 words from user
    // WPM = (2 / 30000) * 60000 = 4
    expect(calculateWPM(entries)).toBe(4);
  });

  it('should respect custom window size', () => {
    const now = Date.now();
    const entries: TranscriptEntry[] = [
      {
        role: 'user',
        text: 'hello world',
        timestamp: now - 5000,
      },
    ];
    // 2 words in 10000ms window
    // WPM = (2 / 10000) * 60000 = 12
    expect(calculateWPM(entries, 10000)).toBe(12);
  });
});

describe('detectFillerWords', () => {
  it('should detect all filler words correctly', () => {
    const text = 'I um basically like think you know';
    const result = detectFillerWords(text);
    
    expect(result['um']).toBe(1);
    expect(result['basically']).toBe(1);
    expect(result['like']).toBe(1);
    expect(result['you know']).toBe(1);
  });

  it('should NOT match filler words inside other words', () => {
    const text = 'I likely enjoyed it';
    const result = detectFillerWords(text);
    
    expect(result['like']).toBeUndefined();
  });

  it('should be case-insensitive', () => {
    const text = 'UM Like BASICALLY You Know';
    const result = detectFillerWords(text);
    
    expect(result['um']).toBe(1);
    expect(result['like']).toBe(1);
    expect(result['basically']).toBe(1);
    expect(result['you know']).toBe(1);
  });

  it('should count multiple occurrences', () => {
    const text = 'um I think um you know um that you know';
    const result = detectFillerWords(text);
    
    expect(result['um']).toBe(3);
    expect(result['you know']).toBe(2);
  });

  it('should return empty object for text with no filler words', () => {
    const text = 'This is clean speech';
    const result = detectFillerWords(text);
    
    expect(Object.keys(result).length).toBe(0);
  });

  it('should handle empty string', () => {
    const result = detectFillerWords('');
    expect(Object.keys(result).length).toBe(0);
  });

  it('should handle multi-word fillers at boundaries', () => {
    const text = 'you know this is good, you know?';
    const result = detectFillerWords(text);
    
    expect(result['you know']).toBe(2);
  });
});

describe('countTotalWords', () => {
  it('should return 0 for empty string', () => {
    expect(countTotalWords('')).toBe(0);
  });

  it('should count words correctly', () => {
    expect(countTotalWords('hello world')).toBe(2);
  });

  it('should handle multiple spaces', () => {
    expect(countTotalWords('hello    world')).toBe(2);
  });

  it('should handle leading and trailing spaces', () => {
    expect(countTotalWords('  hello world  ')).toBe(2);
  });

  it('should handle single word', () => {
    expect(countTotalWords('hello')).toBe(1);
  });

  it('should handle tabs and newlines as whitespace', () => {
    expect(countTotalWords('hello\tworld\ntest')).toBe(3);
  });
});

describe('FILLER_WORDS constant', () => {
  it('should contain all expected filler words', () => {
    const expectedFillers = [
      'um',
      'uh',
      'like',
      'you know',
      'basically',
      'actually',
      'so',
      'right',
    ];
    
    expect(FILLER_WORDS).toEqual(expectedFillers);
  });
});
