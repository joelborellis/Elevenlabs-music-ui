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
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = <K extends keyof Section>(key: K, value: Section[K]) => {
    onUpdate({ ...section, [key]: value });
  };

  return (
    <Card className="relative overflow-visible bg-card/80 border-border/60 hover:border-border transition-colors">
      {/* Section header */}
      <div className="p-3 sm:p-4 pb-2">
        {/* Mobile: Two rows / Desktop: Single row */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Drag handle */}
          {dragControls && (
            <div className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors touch-none">
              <GripVertical className="h-5 w-5" />
            </div>
          )}

          {/* Section number badge */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs sm:text-sm font-medium text-primary">{index + 1}</span>
          </div>

          {/* Section name - truncate on mobile */}
          <div className="flex-1 min-w-0 truncate">
            <InlineTextInput
              value={section.section_name}
              onChange={(section_name) => updateField('section_name', section_name)}
              placeholder="Section name"
              className="font-medium text-foreground text-sm sm:text-base"
              as="h4"
            />
          </div>

          {/* Duration - hidden on mobile, shown in second row */}
          <div className="hidden sm:block">
            <DurationInput
              value={section.duration_ms}
              onChange={(duration_ms) => updateField('duration_ms', duration_ms)}
            />
          </div>

          {/* Action buttons with better touch targets */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 sm:p-1.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors flex items-center justify-center"
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
              className="p-2 sm:p-1.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile: Duration on second row */}
        <div className="flex sm:hidden items-center gap-2 mt-2 ml-9 sm:ml-11">
          <DurationInput
            value={section.duration_ms}
            onChange={(duration_ms) => updateField('duration_ms', duration_ms)}
            className="text-xs"
          />
        </div>
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
        <CardContent className="pt-2 pb-3 sm:pb-4 px-3 sm:px-6 space-y-3 sm:space-y-4">
          {/* Style tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Positive Styles
              </label>
              <TagInput
                tags={section.positive_local_styles || []}
                onChange={(tags) => updateField('positive_local_styles', tags)}
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
                tags={section.negative_local_styles || []}
                onChange={(tags) => updateField('negative_local_styles', tags)}
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
