import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagInput } from './TagInput';

interface GlobalStylesCardProps {
  positiveStyles: string[];
  negativeStyles: string[];
  onPositiveChange: (styles: string[]) => void;
  onNegativeChange: (styles: string[]) => void;
}

export function GlobalStylesCard({
  positiveStyles,
  negativeStyles,
  onPositiveChange,
  onNegativeChange,
}: GlobalStylesCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Summary for collapsed state
  const totalStyles = positiveStyles.length + negativeStyles.length;
  const summary = totalStyles > 0
    ? `${positiveStyles.length} positive, ${negativeStyles.length} negative`
    : 'No styles defined';

  return (
    <Card className="bg-card/80 border-border/60">
      <CardHeader
        className="pb-2 sm:pb-3 px-3 sm:px-6 cursor-pointer select-none hover:bg-muted/30 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span>Global Styles</span>
            <div className="flex items-center gap-2">
              {!isExpanded && (
                <span className="text-xs text-muted-foreground font-normal">{summary}</span>
              )}
              <div className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pt-0">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Positive Styles
            </label>
            <TagInput
              tags={positiveStyles}
              onChange={onPositiveChange}
              placeholder="electronic, upbeat, energetic..."
              variant="positive"
            />
            <p className="text-xs text-muted-foreground">
              Styles to include throughout the song
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              Negative Styles
            </label>
            <TagInput
              tags={negativeStyles}
              onChange={onNegativeChange}
              placeholder="slow, acoustic, sad..."
              variant="negative"
            />
            <p className="text-xs text-muted-foreground">
              Styles to avoid throughout the song
            </p>
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
