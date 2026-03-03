// TODO: Define persona types for type-safe persona handling

export interface PersonaConfig {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type PersonaType = 'vc' | 'customer' | 'technical' | 'media';
