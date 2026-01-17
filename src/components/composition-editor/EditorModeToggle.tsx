import { cn } from '@/lib/utils';
import type { EditorMode } from '@/types';

interface EditorModeToggleProps {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
  className?: string;
}

export function EditorModeToggle({ mode, onChange, className }: EditorModeToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-lg bg-muted/50 border border-border/60',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange('visual')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
          mode === 'visual'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Visual
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange('json')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
          mode === 'json'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          JSON
        </span>
      </button>
    </div>
  );
}
