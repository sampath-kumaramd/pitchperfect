import { create } from 'zustand';

// TODO: Implement transcript state management with speaker labels and timestamps

interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: number;
}

interface TranscriptState {
  entries: TranscriptEntry[];
  addEntry: (entry: Omit<TranscriptEntry, 'id'>) => void;
  clear: () => void;
}

export const useTranscriptStore = create<TranscriptState>((set) => ({
  entries: [],
  addEntry: (entry) => set((state) => ({
    entries: [...state.entries, { ...entry, id: Math.random().toString(36) }],
  })),
  clear: () => set({ entries: [] }),
}));
