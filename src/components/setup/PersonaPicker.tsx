import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PERSONAS } from '@/lib/personas/config';
import type { PersonaType } from '@/types/persona';
import { cn } from '@/lib/utils';

interface PersonaPickerProps {
  selected: PersonaType | null;
  onSelect: (persona: PersonaType) => void;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-600 text-white',
  medium: 'bg-amber-600 text-white',
  hard: 'bg-red-600 text-white',
} as const;

export function PersonaPicker({ selected, onSelect }: PersonaPickerProps) {
  const personaList = Object.values(PERSONAS);

  return (
    <div className="grid grid-cols-2 gap-4">
      {personaList.map((persona) => {
        const isSelected = selected === persona.id;
        
        return (
          <Card
            key={persona.id}
            className={cn(
              'cursor-pointer transition-all p-4',
              isSelected
                ? 'ring-2 ring-indigo-600 bg-indigo-50'
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
            )}
            onClick={() => onSelect(persona.id)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{persona.icon}</span>
                  <span className="font-bold text-sm">{persona.name}</span>
                </div>
                <Badge className={cn('capitalize', DIFFICULTY_COLORS[persona.difficulty])}>
                  {persona.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{persona.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
