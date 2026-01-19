import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from './TagInput';
import { InlineTextInput } from './InlineTextInput';
import type { SongMetadata } from '@/types';

interface MetadataCardProps {
  metadata: SongMetadata;
  onChange: (metadata: SongMetadata) => void;
}

export function MetadataCard({ metadata, onChange }: MetadataCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = <K extends keyof SongMetadata>(
    key: K,
    value: SongMetadata[K]
  ) => {
    onChange({ ...metadata, [key]: value });
  };

  // Summary for collapsed state
  const title = metadata.title || 'Untitled';
  const genreCount = metadata.genres?.length || 0;
  const summary = genreCount > 0
    ? `${title} • ${genreCount} genre${genreCount !== 1 ? 's' : ''}`
    : title;

  return (
    <Card className="bg-card/80 border-border/60">
      <CardHeader
        className="pb-2 sm:pb-3 px-3 sm:px-6 cursor-pointer select-none hover:bg-muted/30 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span>Song Metadata</span>
            <div className="flex items-center gap-2 min-w-0">
              {!isExpanded && (
                <span className="text-xs text-muted-foreground font-normal truncate max-w-[120px] sm:max-w-[180px]">{summary}</span>
              )}
              <div className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors shrink-0">
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
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <div className="px-3 py-2 rounded-lg border border-border/60 bg-background/50">
              <InlineTextInput
                value={metadata.title || ''}
                onChange={(title) => updateField('title', title)}
                placeholder="Untitled Song"
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Textarea
              value={metadata.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="A brief description of your song..."
              className="min-h-[60px] text-sm resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Genres</label>
            <TagInput
              tags={metadata.genres || []}
              onChange={(genres) => updateField('genres', genres)}
              placeholder="electronic, pop, ambient..."
              variant="positive"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Moods</label>
            <TagInput
              tags={metadata.moods || []}
              onChange={(moods) => updateField('moods', moods)}
              placeholder="energetic, happy, dreamy..."
              variant="positive"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Tags</label>
            <TagInput
              tags={metadata.tags || []}
              onChange={(tags) => updateField('tags', tags)}
              placeholder="workout, gaming, relaxation..."
              variant="negative"
            />
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
