export const PersonaType = {
  CURIOUS: 'curious',
  SKEPTICAL: 'skeptical',
  FRIENDLY: 'friendly',
  NEUTRAL: 'neutral',
} as const;

export type PersonaType = typeof PersonaType[keyof typeof PersonaType];

export interface PersonaConfig {
  id: PersonaType;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  interruptFrequency: string;
  questionStyle: string;
  backchannels: string[];
}
