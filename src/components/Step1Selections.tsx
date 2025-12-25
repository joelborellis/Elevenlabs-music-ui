import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useWizardStore, useSelectionsComplete } from '@/state/wizardStore';
import { generatePromptFromSelections } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import {
  PROJECT_BLUEPRINT_OPTIONS,
  SOUND_PROFILE_OPTIONS,
  DELIVERY_AND_CONTROL_OPTIONS,
  type ProjectBlueprint,
  type SoundProfile,
  type DeliveryAndControl,
} from '@/types';

export function Step1Selections() {
  const {
    selections,
    userNarrative,
    setProjectBlueprint,
    setSoundProfile,
    setDeliveryAndControl,
    setInstrumentalOnly,
    setPromptText,
    nextStep,
    prevStep,
    isGeneratingPrompt,
    setIsGeneratingPrompt,
  } = useWizardStore();

  const canProceed = useSelectionsComplete();

  const handleGeneratePrompt = async () => {
    if (!canProceed) return;

    setIsGeneratingPrompt(true);
    try {
      const prompt = await generatePromptFromSelections(selections, userNarrative);
      setPromptText(prompt);
      toast({
        title: 'Prompt generated!',
        description: 'Your composition prompt is ready for editing.',
        variant: 'success',
      });
      nextStep();
    } catch (error) {
      toast({
        title: 'Error generating prompt',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Configure Your Composition</h2>
        <p className="text-muted-foreground">
          Select your preferences to generate a music composition prompt
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Project Blueprint */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Blueprint</CardTitle>
            <CardDescription>Define the use case and structure</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selections.project_blueprint || ''}
              onValueChange={(value) => setProjectBlueprint(value as ProjectBlueprint)}
            >
              {PROJECT_BLUEPRINT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Sound Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sound Profile</CardTitle>
            <CardDescription>Define genre and sonic characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selections.sound_profile || ''}
              onValueChange={(value) => setSoundProfile(value as SoundProfile)}
            >
              {SOUND_PROFILE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Delivery and Control */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery & Control</CardTitle>
            <CardDescription>Define workflow preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selections.delivery_and_control || ''}
              onValueChange={(value) => setDeliveryAndControl(value as DeliveryAndControl)}
            >
              {DELIVERY_AND_CONTROL_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Instrumental Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="instrumental" className="text-base font-medium">
                Instrumental Only
              </Label>
              <p className="text-sm text-muted-foreground">
                Generate music without vocals
              </p>
            </div>
            <Switch
              id="instrumental"
              checked={selections.instrumental_only}
              onCheckedChange={setInstrumentalOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            variant="outline"
            onClick={prevStep}
            disabled={isGeneratingPrompt}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            onClick={handleGeneratePrompt}
            disabled={!canProceed || isGeneratingPrompt}
            className="min-w-[200px]"
          >
            {isGeneratingPrompt ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Prompt
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {!canProceed && (
        <p className="text-center text-sm text-muted-foreground">
          Please make all three selections to continue
        </p>
      )}
    </motion.div>
  );
}
