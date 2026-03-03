import { Check, ArrowUp } from 'lucide-react';

interface FeedbackSectionProps {
  title: string;
  items: string[];
  variant: 'positive' | 'improvement';
}

export function FeedbackSection({ title, items, variant }: FeedbackSectionProps) {
  const isPositive = variant === 'positive';
  const Icon = isPositive ? Check : ArrowUp;
  
  const borderColor = isPositive ? 'border-green-500' : 'border-amber-500';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-amber-50';
  const iconColor = isPositive ? 'text-green-600' : 'text-amber-600';
  
  return (
    <div className={`rounded-lg border-l-4 ${borderColor} ${bgColor} p-6`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
