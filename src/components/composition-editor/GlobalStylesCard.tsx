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
  return (
    <Card className="bg-card/80 border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          Global Styles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
    </Card>
  );
}
