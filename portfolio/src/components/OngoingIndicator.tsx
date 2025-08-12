import { Badge } from '@/components/ui/badge';

interface OngoingIndicatorProps {
  className?: string;
}

export default function OngoingIndicator({ className = '' }: OngoingIndicatorProps) {
  return (
    <Badge className={`bg-primary/90 backdrop-blur ${className}`}>
      <div className="h-2 w-2 rounded-full bg-green-400 mr-1" />
      進行中
    </Badge>
  );
}
