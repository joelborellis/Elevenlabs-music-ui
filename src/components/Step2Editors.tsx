import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle, Sparkles, Music, RefreshCw, Code2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useWizardStore, usePlanValid } from '@/state/wizardStore';
import { generateCompositionPlan, createMusicFromPlan } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { VisualPlanEditor, EditorModeToggle } from '@/components/composition-editor';
import type { CompositionPlan, CompositionPlanData } from '@/types';

// Type guard to check if plan has required structure for visual editor
// Handles both wrapped format {composition_plan: {...}} and direct format {sections: [...]}
function isValidPlanStructure(plan: CompositionPlan | null): boolean {
  if (!plan) return false;

  // Check for wrapped format: {composition_plan: {sections: [...]}}
  const wrapped = plan as CompositionPlanData;
  if (wrapped.composition_plan && Array.isArray(wrapped.composition_plan.sections)) {
    return true;
  }

  // Check for direct format: {sections: [...]}
  const direct = plan as { sections?: unknown };
  if (Array.isArray(direct.sections)) {
    return true;
  }

  return false;
}

// Normalize plan to wrapped format for the visual editor
function normalizePlan(plan: CompositionPlan): CompositionPlanData {
  const wrapped = plan as CompositionPlanData;

  // Already in wrapped format
  if (wrapped.composition_plan && Array.isArray(wrapped.composition_plan.sections)) {
    return wrapped;
  }

  // Direct format - wrap it
  const direct = plan as unknown as CompositionPlanData['composition_plan'] & {
    song_metadata?: CompositionPlanData['song_metadata'];
  };

  return {
    composition_plan: {
      positive_global_styles: direct.positive_global_styles,
      negative_global_styles: direct.negative_global_styles,
      sections: direct.sections,
    },
    song_metadata: direct.song_metadata,
  };
}

export function Step2Editors() {
  const {
    promptText,
    setPromptText,
    promptMetadata,
    compositionPlanText,
    compositionPlanObject,
    planJsonError,
    validateAndSetPlan,
    updatePlanObject,
    editorMode,
    setEditorMode,
    setAudioResult,
    nextStep,
    isGeneratingPlan,
    setIsGeneratingPlan,
    isCreatingMusic,
    setIsCreatingMusic,
  } = useWizardStore();

  const isPlanValid = usePlanValid();
  const [localJsonError, setLocalJsonError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const plan = await generateCompositionPlan(promptText);
      // Normalize the plan to wrapped format for consistent handling
      const normalizedPlan = normalizePlan(plan);

      // Merge prompt metadata (title/description) into song_metadata
      if (promptMetadata) {
        normalizedPlan.song_metadata = {
          ...normalizedPlan.song_metadata,
          title: promptMetadata.title,
          description: promptMetadata.description,
        };
      }

      const planText = JSON.stringify(normalizedPlan, null, 2);
      validateAndSetPlan(planText);
      toast({
        title: 'Plan generated!',
        description: 'Your composition plan is ready for review.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error generating plan',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(compositionPlanText);
      const formatted = JSON.stringify(parsed, null, 2);
      validateAndSetPlan(formatted);
      setLocalJsonError(null);
      toast({
        title: 'JSON formatted',
        description: 'Your plan has been pretty-printed.',
      });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Invalid JSON';
      setLocalJsonError(error);
    }
  };

  const handlePlanChange = (text: string) => {
    validateAndSetPlan(text);
    setLocalJsonError(null);
  };

  const handleCreateMusic = async () => {
    if (!compositionPlanObject) return;

    setIsCreatingMusic(true);
    try {
      const result = await createMusicFromPlan(compositionPlanObject as CompositionPlan);
      setAudioResult(result);
      toast({
        title: 'Music created!',
        description: 'Your composition is ready to play.',
        variant: 'success',
      });
      nextStep();
    } catch (error) {
      toast({
        title: 'Error creating music',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingMusic(false);
    }
  };

  const displayError = localJsonError || planJsonError;
  const canUseVisualEditor = isValidPlanStructure(compositionPlanObject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block text-xs uppercase tracking-[0.3em] text-primary font-medium mb-3"
        >
          Step Three
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="font-display text-3xl md:text-4xl text-foreground mb-2"
        >
          Compose Your <span className="italic text-primary">Music</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-muted-foreground"
        >
          Generate and refine your composition plan
        </motion.p>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Prompt Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card className="relative overflow-visible">
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-accent/50 rounded-tr" />

            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-display">AI Prompt</CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Review and edit the prompt before generating your composition plan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-5">
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Your composition prompt..."
                className="min-h-[160px] text-sm leading-relaxed rounded-xl border-border/60 bg-background/80 focus:bg-background transition-colors resize-none"
              />
              <div className="flex items-center justify-between mt-3 mb-4">
                <p className="text-xs text-muted-foreground">
                  This prompt was generated from your selections and story. Feel free to edit it before generating the plan.
                </p>
                {/* Character count indicator */}
                {(() => {
                  const charCount = promptText.length;
                  const maxChars = 4100;
                  const percentage = (charCount / maxChars) * 100;
                  const isOverLimit = charCount > maxChars;
                  const statusColor = isOverLimit || percentage >= 90
                    ? 'text-red-500'
                    : percentage >= 75
                    ? 'text-yellow-500'
                    : 'text-green-500';
                  const dotColor = isOverLimit || percentage >= 90
                    ? 'bg-red-500'
                    : percentage >= 75
                    ? 'bg-yellow-500'
                    : 'bg-green-500';

                  return (
                    <div className={`flex items-center gap-1.5 text-xs font-mono-code shrink-0 ml-4 ${statusColor}`}>
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span>{charCount.toLocaleString()}</span>
                      <span className="text-muted-foreground">/ {maxChars.toLocaleString()}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Generate Plan Button - prominent placement */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!promptText.trim() || isGeneratingPlan}
                  size="lg"
                  className="gap-2 min-w-[200px]"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Plan...
                    </>
                  ) : compositionPlanText.trim() ? (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      Regenerate Plan
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Composition Plan Section - Only shown after plan is generated */}
        <AnimatePresence>
          {compositionPlanText.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Card className="relative overflow-visible">
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-secondary/50 rounded-tl" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-accent/50 rounded-tr" />

                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-display">Composition Plan</CardTitle>
                        <CardDescription className="text-sm mt-0.5">
                          {canUseVisualEditor
                            ? 'Edit your music structure visually or in JSON'
                            : 'JSON structure that defines your music'}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Editor mode toggle - below heading on mobile, inline on desktop */}
                    {canUseVisualEditor && (
                      <div className="ml-0 sm:ml-auto">
                        <EditorModeToggle
                          mode={editorMode}
                          onChange={setEditorMode}
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <AnimatePresence mode="wait">
                    {editorMode === 'visual' && canUseVisualEditor ? (
                      <VisualPlanEditor
                        key="visual"
                        plan={compositionPlanObject as CompositionPlanData}
                        onUpdate={updatePlanObject}
                      />
                    ) : (
                      <motion.div
                        key="json"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* JSON editor */}
                        <div className="relative">
                          <Textarea
                            value={compositionPlanText}
                            onChange={(e) => handlePlanChange(e.target.value)}
                            placeholder="Your composition plan JSON..."
                            className={`min-h-[200px] sm:min-h-[320px] font-mono-code text-xs leading-relaxed rounded-xl border-border/60 bg-background/50 focus:bg-background transition-colors resize-none ${
                              displayError ? 'border-destructive/60 focus-visible:ring-destructive/50' : ''
                            }`}
                          />
                          {displayError && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 flex items-start gap-2 text-xs text-destructive bg-destructive/5 rounded-lg p-3"
                            >
                              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                              <span className="font-mono-code">{displayError}</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Format JSON button */}
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={handleFormatJson}
                            disabled={!compositionPlanText.trim()}
                            size="sm"
                          >
                            <Code2 className="mr-2 h-4 w-4" />
                            Format JSON
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Music Button */}
        <AnimatePresence>
          {isPlanValid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={handleCreateMusic}
                disabled={isCreatingMusic}
                size="xl"
                className="w-full sm:w-auto sm:min-w-[280px] gap-3 glow-warm"
              >
                {isCreatingMusic ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Your Music...
                  </>
                ) : (
                  <>
                    <Music className="h-5 w-5" />
                    Render Music
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workflow indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${promptText.trim() ? 'bg-primary' : 'bg-border'}`} />
            <span>Prompt</span>
          </div>
          <ChevronRight className="w-4 h-4 text-border" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlanValid ? 'bg-secondary' : 'bg-border'}`} />
            <span>Plan</span>
          </div>
          <ChevronRight className="w-4 h-4 text-border" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCreatingMusic ? 'bg-accent animate-pulse' : 'bg-border'}`} />
            <span>Render</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
