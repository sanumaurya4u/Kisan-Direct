import { Loader2 } from 'lucide-react';

interface Props {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = 'Loading...', className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 text-gray-500 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="font-medium animate-pulse">{text}</p>
    </div>
  );
}
