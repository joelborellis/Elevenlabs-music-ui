import { useState, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  variant?: 'positive' | 'negative';
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
  variant = 'positive',
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = inputValue.trim();

    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();
      if (!tags.includes(value)) {
        onChange([...tags, value]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const tagColors =
    variant === 'positive'
      ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
      : 'bg-muted text-muted-foreground border-border/60 hover:bg-muted/80';

  const removeButtonColors =
    variant === 'positive'
      ? 'hover:bg-primary/20 text-primary/60 hover:text-primary'
      : 'hover:bg-muted-foreground/20 text-muted-foreground/60 hover:text-muted-foreground';

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 p-2 min-h-[44px] sm:min-h-[42px] rounded-lg border border-border/60 bg-background/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all cursor-text',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border transition-colors',
            tagColors
          )}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className={cn(
              'rounded-sm p-1 sm:p-0.5 -mr-0.5 transition-colors',
              removeButtonColors
            )}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
