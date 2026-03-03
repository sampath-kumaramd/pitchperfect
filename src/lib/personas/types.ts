// TODO: Define persona types and configuration structure

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type PersonaId = string;
