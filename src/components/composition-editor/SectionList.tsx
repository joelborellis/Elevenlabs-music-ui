import { Reorder } from 'motion/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionCard } from './SectionCard';
import type { Section } from '@/types';

interface SectionListProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onUpdateSection: (index: number, section: Section) => void;
  onDeleteSection: (index: number) => void;
  onAddSection: () => void;
}

export function SectionList({
  sections,
  onReorder,
  onUpdateSection,
  onDeleteSection,
  onAddSection,
}: SectionListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Sections ({sections.length})
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddSection}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">No sections defined</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAddSection}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add First Section
          </Button>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={onReorder}
          className="space-y-3"
        >
          {sections.map((section, index) => (
            <Reorder.Item
              key={`${section.section_name}-${index}`}
              value={section}
              className="cursor-default"
            >
              <SectionCard
                section={section}
                index={index}
                onUpdate={(updated) => onUpdateSection(index, updated)}
                onDelete={() => onDeleteSection(index)}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
