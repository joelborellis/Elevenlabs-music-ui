import { motion } from 'motion/react';
import { GlobalStylesCard } from './GlobalStylesCard';
import { MetadataCard } from './MetadataCard';
import { SectionList } from './SectionList';
import type { CompositionPlanData, Section, SongMetadata } from '@/types';

interface VisualPlanEditorProps {
  plan: CompositionPlanData;
  onUpdate: (updater: (plan: CompositionPlanData) => CompositionPlanData) => void;
}

export function VisualPlanEditor({ plan, onUpdate }: VisualPlanEditorProps) {
  const compositionPlan = plan.composition_plan;
  const metadata = plan.song_metadata || {};

  // Global styles handlers
  const handlePositiveStylesChange = (styles: string[]) => {
    onUpdate((p) => ({
      ...p,
      composition_plan: {
        ...p.composition_plan,
        positive_global_styles: styles,
      },
    }));
  };

  const handleNegativeStylesChange = (styles: string[]) => {
    onUpdate((p) => ({
      ...p,
      composition_plan: {
        ...p.composition_plan,
        negative_global_styles: styles,
      },
    }));
  };

  // Metadata handler
  const handleMetadataChange = (newMetadata: SongMetadata) => {
    onUpdate((p) => ({
      ...p,
      song_metadata: newMetadata,
    }));
  };

  // Section handlers
  const handleSectionsReorder = (sections: Section[]) => {
    onUpdate((p) => ({
      ...p,
      composition_plan: {
        ...p.composition_plan,
        sections,
      },
    }));
  };

  const handleUpdateSection = (index: number, section: Section) => {
    onUpdate((p) => ({
      ...p,
      composition_plan: {
        ...p.composition_plan,
        sections: p.composition_plan.sections.map((s, i) =>
          i === index ? section : s
        ),
      },
    }));
  };

  const handleDeleteSection = (index: number) => {
    onUpdate((p) => ({
      ...p,
      composition_plan: {
        ...p.composition_plan,
        sections: p.composition_plan.sections.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddSection = () => {
    const newSection: Section = {
      section_name: `Section ${compositionPlan.sections.length + 1}`,
      duration_ms: 4000,
      positive_local_styles: [],
      negative_local_styles: [],
      lines: [],
    };
    onUpdate((p) => ({
      ...p,
      composition_plan: {
        ...p.composition_plan,
        sections: [...p.composition_plan.sections, newSection],
      },
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Global Styles and Metadata side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlobalStylesCard
          positiveStyles={compositionPlan.positive_global_styles || []}
          negativeStyles={compositionPlan.negative_global_styles || []}
          onPositiveChange={handlePositiveStylesChange}
          onNegativeChange={handleNegativeStylesChange}
        />
        <MetadataCard
          metadata={metadata}
          onChange={handleMetadataChange}
        />
      </div>

      {/* Sections */}
      <SectionList
        sections={compositionPlan.sections}
        onReorder={handleSectionsReorder}
        onUpdateSection={handleUpdateSection}
        onDeleteSection={handleDeleteSection}
        onAddSection={handleAddSection}
      />
    </motion.div>
  );
}
