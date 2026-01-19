import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { Stepper } from '@/components/Stepper';
import { Step0UserNarrative } from '@/components/Step0UserNarrative';
import { Step1Selections } from '@/components/Step1Selections';
import { Step2Editors } from '@/components/Step2Editors';
import { Step3Player } from '@/components/Step3Player';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Toaster } from '@/components/ui/toaster';
import { useWizardStore } from '@/state/wizardStore';

export function App() {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header - Editorial style with asymmetric layout */}
        <header className="relative border-b border-border/50 bg-background/60 backdrop-blur-md sticky top-0 z-20">
          {/* Decorative top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-80" />

          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-end justify-between">
              {/* Logo and branding - editorial asymmetry */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <h1 className="font-display text-3xl md:text-4xl tracking-tight text-foreground">
                    Composer
                    <span className="italic text-primary ml-1">Studio</span>
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-sm text-muted-foreground mt-1 tracking-wide uppercase"
                >
                  AI-Powered Music Creation
                </motion.p>
              </div>

              {/* Decorative element - vinyl/record motif */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="hidden md:block"
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin-slow" />
                  <div className="absolute inset-2 rounded-full border border-muted-foreground/20" />
                  <div className="absolute inset-[18px] rounded-full bg-primary/80" />
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Stepper - with generous spacing */}
        <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-6">
          <Stepper className="mb-8" />
        </div>

        {/* Step Content - with left offset for editorial feel */}
        <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
          <AnimatePresence mode="wait">
            {currentStep === 0 && <Step1Selections key="step0" />}
            {currentStep === 1 && <Step0UserNarrative key="step1" />}
            {currentStep === 2 && <Step2Editors key="step2" />}
            {currentStep === 3 && <Step3Player key="step3" />}
          </AnimatePresence>
        </main>

        {/* Footer - minimal, refined */}
        <footer className="relative border-t border-border/50 py-8">
          {/* Decorative bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground font-display italic">
                Crafting soundscapes with intention
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-warm" />
                <span className="uppercase tracking-widest">Powered by ElevenLabs</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
