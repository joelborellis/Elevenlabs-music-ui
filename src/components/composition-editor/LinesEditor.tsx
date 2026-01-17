import { useState, useRef, type KeyboardEvent } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { Reorder } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LinesEditorProps {
  lines: string[];
  onChange: (lines: string[]) => void;
  className?: string;
}

export function LinesEditor({ lines, onChange, className }: LinesEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newLineValue, setNewLineValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const newLineRef = useRef<HTMLInputElement>(null);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(lines[index]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const newLines = [...lines];
      newLines[editingIndex] = trimmed;
      onChange(newLines);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const addLine = () => {
    const trimmed = newLineValue.trim();
    if (trimmed) {
      onChange([...lines, trimmed]);
      setNewLineValue('');
    }
  };

  const handleNewLineKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLine();
    }
  };

  const removeLine = (index: number) => {
    onChange(lines.filter((_, i) => i !== index));
  };

  if (lines.length === 0) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2">
          <input
            ref={newLineRef}
            type="text"
            value={newLineValue}
            onChange={(e) => setNewLineValue(e.target.value)}
            onKeyDown={handleNewLineKeyDown}
            placeholder="Add lyrics line..."
            className="flex-1 bg-background/50 border border-border/60 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLine}
            disabled={!newLineValue.trim()}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground italic">No lyrics for this section</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Reorder.Group axis="y" values={lines} onReorder={onChange} className="space-y-1.5">
        {lines.map((line, index) => (
          <Reorder.Item
            key={line + index}
            value={line}
            className="flex items-center gap-2 group"
          >
            <div className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <GripVertical className="h-4 w-4" />
            </div>
            {editingIndex === index ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={commitEdit}
                className="flex-1 bg-background/80 border border-primary/50 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <span
                onClick={() => startEditing(index)}
                className="flex-1 px-2 py-1 text-sm cursor-pointer hover:bg-muted/50 rounded transition-colors"
              >
                "{line}"
              </span>
            )}
            <button
              type="button"
              onClick={() => removeLine(index)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex items-center gap-2 pt-1">
        <input
          ref={newLineRef}
          type="text"
          value={newLineValue}
          onChange={(e) => setNewLineValue(e.target.value)}
          onKeyDown={handleNewLineKeyDown}
          placeholder="Add lyrics line..."
          className="flex-1 bg-background/50 border border-border/60 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLine}
          disabled={!newLineValue.trim()}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
