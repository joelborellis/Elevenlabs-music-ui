import { motion } from 'motion/react';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagInput } from './TagInput';
import { InlineTextInput } from './InlineTextInput';
import { DurationInput } from './DurationInput';
import { LinesEditor } from './LinesEditor';
import type { Section } from '@/types';

interface SectionCardProps {
  section: Section;
  index: number;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
  dragControls?: boolean;
}

export function SectionCard({
  section,
  index,
  onUpdate,
  onDelete,
  dragControls = true,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = <K extends keyof Section>(key: K, value: Section[K]) => {
    onUpdate({ ...section, [key]: value });
  };

  return (
    <Card className="relative overflow-visible bg-card/80 border-border/60 hover:border-border transition-colors">
      {/* Section header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        {dragControls && (
          <div className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            <GripVertical className="h-5 w-5" />
          </div>
        )}

        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-primary">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          <InlineTextInput
            value={section.name}
            onChange={(name) => updateField('name', name)}
            placeholder="Section name"
            className="font-medium text-foreground"
            as="h4"
          />
        </div>

        <DurationInput
          value={section.duration_ms}
          onChange={(duration_ms) => updateField('duration_ms', duration_ms)}
        />

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Expandable content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <CardContent className="pt-2 pb-4 space-y-4">
          {/* Style tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Positive Styles
              </label>
              <TagInput
                tags={section.positive_style || []}
                onChange={(tags) => updateField('positive_style', tags)}
                placeholder="Add style..."
                variant="positive"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Negative Styles
              </label>
              <TagInput
                tags={section.negative_style || []}
                onChange={(tags) => updateField('negative_style', tags)}
                placeholder="Add style..."
                variant="negative"
              />
            </div>
          </div>

          {/* Lyrics lines */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Lyrics / Lines
            </label>
            <LinesEditor
              lines={section.lines || []}
              onChange={(lines) => updateField('lines', lines)}
            />
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
