import { create } from 'zustand';

// TODO: Implement audio state management for capture, playback, and analysis

interface AudioState {
  isMuted: boolean;
  userVolume: number;
  aiVolume: number;
  wpm: number;
  setMuted: (muted: boolean) => void;
  setUserVolume: (volume: number) => void;
  setAiVolume: (volume: number) => void;
  setWpm: (wpm: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isMuted: false,
  userVolume: 0,
  aiVolume: 0,
  wpm: 0,
  setMuted: (isMuted) => set({ isMuted }),
  setUserVolume: (userVolume) => set({ userVolume }),
  setAiVolume: (aiVolume) => set({ aiVolume }),
  setWpm: (wpm) => set({ wpm }),
}));
