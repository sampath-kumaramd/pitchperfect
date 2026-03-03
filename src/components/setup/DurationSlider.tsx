import { Slider } from '@/components/ui/slider';

interface DurationSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function DurationSlider({ value, onChange }: DurationSliderProps) {
  function handleValueChange(values: number[]) {
    const newValue = values[0];
    if (newValue !== undefined) {
      onChange(newValue);
    }
  }

  return (
    <div className="space-y-2">
      <Slider
        min={2}
        max={10}
        step={1}
        value={[value]}
        onValueChange={handleValueChange}
        className="w-full"
      />
      <div className="text-sm text-center font-medium text-gray-700">
        {value} minutes
      </div>
    </div>
  );
}
