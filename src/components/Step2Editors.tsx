import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileCode, Loader2, Music, Wand2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useWizardStore, usePlanValid } from '@/state/wizardStore';
import { generateCompositionPlan, createMusicFromPlan } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import type { CompositionPlan } from '@/types';

export function Step2Editors() {
  const {
    promptText,
    setPromptText,
    compositionPlanText,
    compositionPlanObject,
    planJsonError,
    validateAndSetPlan,
    setAudioResult,
    prevStep,
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
      const planText = JSON.stringify(plan, null, 2);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold mb-1">Compose Your Music</h2>
          <p className="text-muted-foreground text-sm">
            Edit the prompt and plan to customize your composition
          </p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prompt Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Your Prompt
            </CardTitle>
            <CardDescription>Edit the composition prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Your composition prompt will appear here..."
              className="min-h-[300px] font-mono text-sm"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGeneratePlan}
                disabled={!promptText.trim() || isGeneratingPlan}
                className="w-full"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <FileCode className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Plan Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Composition Plan (JSON)
            </CardTitle>
            <CardDescription>Review and edit the composition plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={compositionPlanText}
                onChange={(e) => handlePlanChange(e.target.value)}
                placeholder="Generate a plan from your prompt, or paste JSON here..."
                className={`min-h-[300px] font-mono text-sm ${
                  displayError ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
              />
              {displayError && (
                <div className="mt-2 flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleFormatJson}
                disabled={!compositionPlanText.trim()}
                className="flex-1"
              >
                Format JSON
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleCreateMusic}
                  disabled={!isPlanValid || isCreatingMusic}
                  className="w-full"
                >
                  {isCreatingMusic ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      Create Music
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
