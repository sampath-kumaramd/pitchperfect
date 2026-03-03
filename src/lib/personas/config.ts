import type { Persona } from './types';

// TODO: Define complete persona configurations with names, descriptions, and prompts

export const PERSONAS: Record<string, Persona> = {
  vc: {
    id: 'vc',
    name: 'Venture Capitalist',
    description: 'Tough questions about market size and business model',
    systemPrompt: 'You are a VC evaluating a pitch.',
    difficulty: 'hard',
  },
};
