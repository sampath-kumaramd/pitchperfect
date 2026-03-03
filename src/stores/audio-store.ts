import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AudioStore {
  isRecording: boolean;
  isMuted: boolean;
  isAgentSpeaking: boolean;
  micLevel: number;
  agentLevel: number;
  startRecording: () => void;
  stopRecording: () => void;
  toggleMute: () => void;
  setMicLevel: (level: number) => void;
  setAgentLevel: (level: number) => void;
  setAgentSpeaking: (speaking: boolean) => void;
}

export const useAudioStore = create<AudioStore>()(
  devtools(
    (set) => ({
      isRecording: false,
      isMuted: false,
      isAgentSpeaking: false,
      micLevel: 0,
      agentLevel: 0,

      startRecording: () => {
        set({ isRecording: true }, false, 'startRecording');
      },

      stopRecording: () => {
        set({ isRecording: false }, false, 'stopRecording');
      },

      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }), false, 'toggleMute');
      },

      setMicLevel: (micLevel) => {
        if (micLevel < 0 || micLevel > 1) {
          console.warn(`Invalid micLevel: ${micLevel}. Must be between 0 and 1.`);
          return;
        }
        set({ micLevel }, false, 'setMicLevel');
      },

      setAgentLevel: (agentLevel) => {
        if (agentLevel < 0 || agentLevel > 1) {
          console.warn(`Invalid agentLevel: ${agentLevel}. Must be between 0 and 1.`);
          return;
        }
        set({ agentLevel }, false, 'setAgentLevel');
      },

      setAgentSpeaking: (isAgentSpeaking) => {
        set({ isAgentSpeaking }, false, 'setAgentSpeaking');
      },
    }),
    { name: 'AudioStore' }
  )
);
