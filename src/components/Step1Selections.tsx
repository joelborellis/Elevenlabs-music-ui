import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useWizardStore, useSelectionsComplete } from '@/state/wizardStore';
import {
  PROJECT_BLUEPRINT_OPTIONS,
  SOUND_PROFILE_OPTIONS,
  DELIVERY_AND_CONTROL_OPTIONS,
  type ProjectBlueprint,
  type SoundProfile,
  type DeliveryAndControl,
} from '@/types';

// Category icons
const CategoryIcons = {
  blueprint: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  sound: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  delivery: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
};

export function Step1Selections() {
  const {
    selections,
    setProjectBlueprint,
    setSoundProfile,
    setDeliveryAndControl,
    setInstrumentalOnly,
    nextStep,
  } = useWizardStore();

  const canProceed = useSelectionsComplete();

  const handleContinue = () => {
    if (!canProceed) return;
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-10"
    >
      {/* Header section */}
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block text-xs uppercase tracking-[0.3em] text-primary font-medium mb-3"
        >
          Step One
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
        >
          What kind of <span className="italic text-primary">music</span> are you creating?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Select your project type, sound profile, and workflow preferences
        </motion.p>
      </div>

      {/* Selection cards grid */}
      <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Project Blueprint */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card className="h-full relative overflow-visible group">
            {/* Category indicator */}
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full uppercase tracking-wider">
              01
            </div>

            <CardHeader className="pt-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary">
                  {CategoryIcons.blueprint}
                </div>
                <div>
                  <CardTitle className="text-base">Project Blueprint</CardTitle>
                  <CardDescription className="text-xs">What are you creating?</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <RadioGroup
                value={selections.project_blueprint || ''}
                onValueChange={(value) => setProjectBlueprint(value as ProjectBlueprint)}
                className="space-y-2"
              >
                {PROJECT_BLUEPRINT_OPTIONS.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                  >
                    <label
                      htmlFor={option.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selections.project_blueprint === option.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border/40 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-sm text-foreground">{option.label}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sound Profile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="h-full relative overflow-visible">
            {/* Category indicator */}
            <div className="absolute -top-3 left-6 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full uppercase tracking-wider">
              02
            </div>

            <CardHeader className="pt-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center text-secondary">
                  {CategoryIcons.sound}
                </div>
                <div>
                  <CardTitle className="text-base">Sound Profile</CardTitle>
                  <CardDescription className="text-xs">Genre & sonic character</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <RadioGroup
                value={selections.sound_profile || ''}
                onValueChange={(value) => setSoundProfile(value as SoundProfile)}
                className="space-y-2"
              >
                {SOUND_PROFILE_OPTIONS.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
                  >
                    <label
                      htmlFor={option.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selections.sound_profile === option.value
                          ? 'border-secondary bg-secondary/5 shadow-sm'
                          : 'border-border/40 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-sm text-foreground">{option.label}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery and Control */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Card className="h-full relative overflow-visible">
            {/* Category indicator */}
            <div className="absolute -top-3 left-6 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full uppercase tracking-wider">
              03
            </div>

            <CardHeader className="pt-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent">
                  {CategoryIcons.delivery}
                </div>
                <div>
                  <CardTitle className="text-base">Delivery & Control</CardTitle>
                  <CardDescription className="text-xs">Workflow preferences</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <RadioGroup
                value={selections.delivery_and_control || ''}
                onValueChange={(value) => setDeliveryAndControl(value as DeliveryAndControl)}
                className="space-y-2"
              >
                {DELIVERY_AND_CONTROL_OPTIONS.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  >
                    <label
                      htmlFor={option.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selections.delivery_and_control === option.value
                          ? 'border-accent bg-accent/5 shadow-sm'
                          : 'border-border/40 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium text-sm text-foreground">{option.label}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Instrumental Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="max-w-md mx-auto"
      >
        <Card className="bg-muted/30">
          <CardContent className="py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                </div>
                <div>
                  <Label htmlFor="instrumental" className="text-sm font-medium cursor-pointer">
                    Instrumental Only
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Generate music without vocals
                  </p>
                </div>
              </div>
              <Switch
                id="instrumental"
                checked={selections.instrumental_only}
                onCheckedChange={setInstrumentalOnly}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <Button
          size="xl"
          onClick={handleContinue}
          disabled={!canProceed}
          className="min-w-[280px] group gap-3"
        >
          Continue to Your Story
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>

        {!canProceed && (
          <p className="text-sm text-muted-foreground">
            Select an option from each category to continue
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
