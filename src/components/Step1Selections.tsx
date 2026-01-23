import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, Sparkles, Info, Lightbulb, Music } from 'lucide-react';
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
  RECOMMENDED_COMBINATIONS,
  type ProjectBlueprint,
  type SoundProfile,
  type DeliveryAndControl,
  type ExtendedSelectionOption,
  type RecommendedCombo,
} from '@/types';

// Category icons
const CategoryIcons = {
  blueprint: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  sound: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  delivery: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
};

// Category help text
const CATEGORY_HELP = {
  blueprint: {
    question: 'What are you creating?',
    hint: 'This determines the length, structure, and purpose of your music.',
  },
  sound: {
    question: 'What genre and mood?',
    hint: 'This sets the overall vibe, instruments, and tempo.',
  },
  delivery: {
    question: 'How creative vs. controlled?',
    hint: 'This controls how much freedom the AI has in creating your music.',
  },
};

// Option card with expandable details
interface OptionCardProps<T extends string> {
  option: ExtendedSelectionOption<T>;
  isSelected: boolean;
  onSelect: () => void;
  colorClass: string;
  delay: number;
}

function OptionCard<T extends string>({
  option,
  isSelected,
  onSelect,
  colorClass,
  delay,
}: OptionCardProps<T>) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div
        onClick={onSelect}
        className={`relative rounded-xl border cursor-pointer transition-all duration-200 ${
          isSelected
            ? `border-${colorClass} bg-${colorClass}/5 shadow-sm`
            : 'border-border/40 hover:border-border hover:bg-muted/30'
        }`}
      >
        {/* Main option row */}
        <label className="flex items-start gap-3 p-3 cursor-pointer">
          <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="block font-medium text-sm text-foreground">{option.label}</span>
              {option.instrumental && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 text-[10px] font-medium border border-violet-500/20">
                  <Music className="w-2.5 h-2.5" />
                  Instrumental
                </span>
              )}
              {option.recommended && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  Recommended
                </span>
              )}
            </div>
            <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {option.description}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="p-2 sm:p-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
            title="Show details"
          >
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                showDetails ? 'rotate-180' : ''
              }`}
            />
          </button>
        </label>

        {/* Expandable details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-0 border-t border-border/30 mt-1">
                <div className="pt-3 space-y-3">
                  {/* What it does */}
                  <div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.details}
                    </p>
                  </div>

                  {/* Specs */}
                  {option.specs && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(option.specs).map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-[10px]"
                        >
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium text-foreground">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* When to choose */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      When to choose this
                    </p>
                    <ul className="space-y-1">
                      {option.whenToChoose.map((reason, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary/60 mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Quick start combo card
interface QuickStartCardProps {
  combo: RecommendedCombo;
  onApply: () => void;
  isActive: boolean;
}

function QuickStartCard({ combo, onApply, isActive }: QuickStartCardProps) {
  return (
    <button
      onClick={onApply}
      className={`flex-shrink-0 w-28 sm:w-36 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
        isActive
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border/40 hover:border-border hover:bg-muted/30'
      }`}
    >
      <h4 className="font-medium text-sm text-foreground truncate">{combo.useCase}</h4>
      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{combo.description}</p>
    </button>
  );
}

// Expandable category hint component
interface CategoryHintProps {
  hint: string;
  colorClass: 'primary' | 'secondary' | 'accent';
  isExpanded: boolean;
  onToggle: () => void;
}

function CategoryHint({ hint, colorClass, isExpanded, onToggle }: CategoryHintProps) {
  const bgClass = colorClass === 'primary' ? 'bg-primary/5 border-primary/10'
    : colorClass === 'secondary' ? 'bg-secondary/5 border-secondary/10'
    : 'bg-accent/5 border-accent/10';

  const textClass = colorClass === 'primary' ? 'text-primary'
    : colorClass === 'secondary' ? 'text-secondary'
    : 'text-accent';

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg border transition-colors ${bgClass} hover:opacity-80`}
      >
        <div className="flex items-center gap-2">
          <Info className={`w-3.5 h-3.5 ${textClass} flex-shrink-0`} />
          <span className="text-[11px] text-muted-foreground font-medium">What does this control?</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className={`text-[11px] text-muted-foreground leading-relaxed pt-2 px-2`}>
              {hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  // State for expanded category hints
  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>({
    blueprint: false,
    sound: false,
    delivery: false,
  });

  const toggleHint = (category: string) => {
    setExpandedHints(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleContinue = () => {
    if (!canProceed) return;
    nextStep();
  };

  const applyCombo = (combo: RecommendedCombo) => {
    setProjectBlueprint(combo.blueprint);
    setSoundProfile(combo.sound);
    setDeliveryAndControl(combo.delivery);
  };

  const isComboActive = (combo: RecommendedCombo) =>
    selections.project_blueprint === combo.blueprint &&
    selections.sound_profile === combo.sound &&
    selections.delivery_and_control === combo.delivery;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
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
          Select your project type, sound profile, and workflow preferences. Click the{' '}
          <ChevronDown className="inline w-4 h-4" /> icon on any option for more details.
        </motion.p>
      </div>

      {/* Quick Start Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <div className="relative bg-muted/30 rounded-2xl p-4 border border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Quick Start</span>
            <span className="text-xs text-muted-foreground">— click to apply a recommended combination</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {RECOMMENDED_COMBINATIONS.map((combo) => (
              <QuickStartCard
                key={combo.useCase}
                combo={combo}
                onApply={() => applyCombo(combo)}
                isActive={isComboActive(combo)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Selection cards grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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

            <CardHeader className="pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-md">
                  {CategoryIcons.blueprint}
                </div>
                <div>
                  <CardTitle className="text-xl font-display text-foreground">Project Blueprint</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-0.5">
                    {CATEGORY_HELP.blueprint.question}
                  </CardDescription>
                </div>
              </div>
              {/* Expandable help hint */}
              <CategoryHint
                hint={CATEGORY_HELP.blueprint.hint}
                colorClass="primary"
                isExpanded={expandedHints.blueprint}
                onToggle={() => toggleHint('blueprint')}
              />
              {/* Separator */}
              <div className="mt-4 h-px bg-gradient-to-r from-primary/40 via-border/60 to-transparent" />
            </CardHeader>

            <CardContent className="pt-2">
              <RadioGroup
                value={selections.project_blueprint || ''}
                onValueChange={(value) => setProjectBlueprint(value as ProjectBlueprint)}
                className="space-y-2"
              >
                {PROJECT_BLUEPRINT_OPTIONS.map((option, index) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    isSelected={selections.project_blueprint === option.value}
                    onSelect={() => setProjectBlueprint(option.value)}
                    colorClass="primary"
                    delay={0.3 + index * 0.05}
                  />
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

            <CardHeader className="pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-secondary-foreground shadow-md">
                  {CategoryIcons.sound}
                </div>
                <div>
                  <CardTitle className="text-xl font-display text-foreground">Sound Profile</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-0.5">
                    {CATEGORY_HELP.sound.question}
                  </CardDescription>
                </div>
              </div>
              {/* Expandable help hint */}
              <CategoryHint
                hint={CATEGORY_HELP.sound.hint}
                colorClass="secondary"
                isExpanded={expandedHints.sound}
                onToggle={() => toggleHint('sound')}
              />
              {/* Separator */}
              <div className="mt-4 h-px bg-gradient-to-r from-secondary/40 via-border/60 to-transparent" />
            </CardHeader>

            <CardContent className="pt-2">
              <RadioGroup
                value={selections.sound_profile || ''}
                onValueChange={(value) => setSoundProfile(value as SoundProfile)}
                className="space-y-2"
              >
                {SOUND_PROFILE_OPTIONS.map((option, index) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    isSelected={selections.sound_profile === option.value}
                    onSelect={() => setSoundProfile(option.value)}
                    colorClass="secondary"
                    delay={0.35 + index * 0.05}
                  />
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

            <CardHeader className="pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-accent-foreground shadow-md">
                  {CategoryIcons.delivery}
                </div>
                <div>
                  <CardTitle className="text-xl font-display text-foreground">Delivery & Control</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-0.5">
                    {CATEGORY_HELP.delivery.question}
                  </CardDescription>
                </div>
              </div>
              {/* Expandable help hint */}
              <CategoryHint
                hint={CATEGORY_HELP.delivery.hint}
                colorClass="accent"
                isExpanded={expandedHints.delivery}
                onToggle={() => toggleHint('delivery')}
              />
              {/* Separator */}
              <div className="mt-4 h-px bg-gradient-to-r from-accent/40 via-border/60 to-transparent" />
            </CardHeader>

            <CardContent className="pt-2">
              <RadioGroup
                value={selections.delivery_and_control || ''}
                onValueChange={(value) => setDeliveryAndControl(value as DeliveryAndControl)}
                className="space-y-2"
              >
                {DELIVERY_AND_CONTROL_OPTIONS.map((option, index) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    isSelected={selections.delivery_and_control === option.value}
                    onSelect={() => setDeliveryAndControl(option.value)}
                    colorClass="accent"
                    delay={0.4 + index * 0.05}
                  />
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
                    Generate music without vocals (overrides blueprint setting)
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
          className="w-full sm:w-auto sm:min-w-[280px] group gap-3"
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
