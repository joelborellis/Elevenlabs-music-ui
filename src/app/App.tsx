import { AnimatePresence } from 'motion/react';
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
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Composer Studio</h1>
                <p className="text-sm text-muted-foreground">AI Music Composition</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stepper */}
        <div className="container mx-auto px-4 py-8">
          <Stepper className="mb-12" />
        </div>

        {/* Step Content */}
        <main className="container mx-auto px-4 pb-16">
          <AnimatePresence mode="wait">
            {currentStep === 0 && <Step0UserNarrative key="step0" />}
            {currentStep === 1 && <Step1Selections key="step1" />}
            {currentStep === 2 && <Step2Editors key="step2" />}
            {currentStep === 3 && <Step3Player key="step3" />}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Composer Studio — AI-powered music composition</p>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
