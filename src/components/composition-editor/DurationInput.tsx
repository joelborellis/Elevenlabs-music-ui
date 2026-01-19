import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DurationInputProps {
  value: number; // milliseconds
  onChange: (value: number) => void;
  className?: string;
}

export function DurationInput({ value, onChange, className }: DurationInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const seconds = (value / 1000).toFixed(1);

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitChange();
    } else if (e.key === 'Escape') {
      setLocalValue(String(value));
      setIsEditing(false);
    }
  };

  const commitChange = () => {
    const parsed = parseInt(localValue, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed !== value) {
      onChange(parsed);
    } else {
      setLocalValue(String(value));
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <input
          ref={inputRef}
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitChange}
          min={100}
          step={100}
          className="w-20 bg-background/80 border border-primary/50 rounded px-2 py-0.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-xs text-muted-foreground">ms</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={cn(
        'group inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:py-1 min-h-[44px] sm:min-h-0 rounded-md hover:bg-muted/50 transition-colors',
        className
      )}
    >
      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
      {/* Mobile: compact display / Desktop: full display */}
      <span className="text-sm font-mono sm:hidden">{seconds}s</span>
      <span className="text-sm font-mono hidden sm:inline">{value}ms</span>
      <span className="text-xs text-muted-foreground hidden sm:inline">({seconds}s)</span>
    </button>
  );
}
