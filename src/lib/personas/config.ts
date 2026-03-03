import type { PersonaType, PersonaConfig } from '@/types/persona';

export const PERSONAS: Record<PersonaType, PersonaConfig> = {
  curious: {
    id: 'curious',
    name: 'Curious Buyer',
    description: 'Asks deep follow-up questions',
    difficulty: 'medium',
    icon: '🤔',
    interruptFrequency: 'every 30-45 seconds',
    questionStyle: 'Deep, exploratory questions about implications and possibilities',
    backchannels: ['Interesting...', 'Tell me more', 'I see', 'Hmm'],
  },
  skeptical: {
    id: 'skeptical',
    name: 'Skeptical Buyer',
    description: 'Challenges your claims and data',
    difficulty: 'hard',
    icon: '🤨',
    interruptFrequency: 'when claims lack proof',
    questionStyle: 'Direct challenges requiring evidence and data',
    backchannels: ['Really?', 'How do you know that?', 'Prove it', 'Show me'],
  },
  friendly: {
    id: 'friendly',
    name: 'Friendly Buyer',
    description: 'Supportive and encouraging',
    difficulty: 'easy',
    icon: '😊',
    interruptFrequency: 'rarely, only for clarification',
    questionStyle: 'Supportive questions that help the presenter',
    backchannels: ['That sounds great!', 'I love that', 'Makes sense', 'Good point'],
  },
  neutral: {
    id: 'neutral',
    name: 'Neutral Buyer',
    description: 'Professional and balanced',
    difficulty: 'medium',
    icon: '😐',
    interruptFrequency: 'at natural pauses',
    questionStyle: 'Methodical, process-oriented questions',
    backchannels: ['I understand', 'Go on', 'Okay', 'Noted'],
  },
};
