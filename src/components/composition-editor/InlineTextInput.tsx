import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  as?: 'span' | 'h3' | 'h4' | 'p';
}

export function InlineTextInput({
  value,
  onChange,
  placeholder = 'Click to edit',
  className,
  inputClassName,
  as: Component = 'span',
}: InlineTextInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
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
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const commitChange = () => {
    const trimmed = localValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setLocalValue(value);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitChange}
        placeholder={placeholder}
        className={cn(
          'bg-background/80 border border-primary/50 rounded px-2 py-0.5 text-sm outline-none focus:ring-2 focus:ring-primary/30',
          inputClassName
        )}
      />
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={cn(
        'group cursor-pointer inline-flex items-center gap-1.5 hover:text-primary transition-colors',
        className
      )}
    >
      {value || <span className="text-muted-foreground/60 italic">{placeholder}</span>}
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
    </Component>
  );
}
