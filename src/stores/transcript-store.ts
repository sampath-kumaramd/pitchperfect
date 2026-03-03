import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TranscriptEntry } from '@/types/session';

interface TranscriptStore {
  entries: TranscriptEntry[];
  currentWPM: number;
  fillerWordCount: number;
  fillerWords: Record<string, number>;
  addEntry: (entry: TranscriptEntry) => void;
  updateWPM: (wpm: number) => void;
  updateFillerWords: (word: string, count: number) => void;
  clearTranscript: () => void;
}

export const useTranscriptStore = create<TranscriptStore>()(
  devtools(
    (set) => ({
      entries: [],
      currentWPM: 0,
      fillerWordCount: 0,
      fillerWords: {},

      addEntry: (entry) => {
        set(
          (state) => ({
            entries: [...state.entries, entry],
          }),
          false,
          'addEntry'
        );
      },

      updateWPM: (currentWPM) => {
        if (currentWPM < 0) {
          console.warn(`Invalid WPM: ${currentWPM}. Must be non-negative.`);
          return;
        }
        set({ currentWPM }, false, 'updateWPM');
      },

      updateFillerWords: (word, count) => {
        if (count < 0) {
          console.warn(`Invalid count: ${count}. Must be non-negative.`);
          return;
        }
        set(
          (state) => {
            const newFillerWords = { ...state.fillerWords, [word]: count };
            const newFillerWordCount = Object.values(newFillerWords).reduce(
              (sum, wordCount) => sum + wordCount,
              0
            );
            return {
              fillerWords: newFillerWords,
              fillerWordCount: newFillerWordCount,
            };
          },
          false,
          'updateFillerWords'
        );
      },

      clearTranscript: () => {
        set(
          {
            entries: [],
            currentWPM: 0,
            fillerWordCount: 0,
            fillerWords: {},
          },
          false,
          'clearTranscript'
        );
      },
    }),
    { name: 'TranscriptStore' }
  )
);
