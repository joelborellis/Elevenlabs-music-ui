import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useWizardStore } from '@/state/wizardStore';

interface StepperProps {
  className?: string;
}

const steps = [
  { number: 0, label: 'Narrative' },
  { number: 1, label: 'Selections' },
  { number: 2, label: 'Compose' },
  { number: 3, label: 'Play' },
];

export function Stepper({ className }: StepperProps) {
  const currentStep = useWizardStore((state) => state.currentStep);
  const progressRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // GSAP animation for progress bar
  useEffect(() => {
    if (progressRef.current) {
      const progress = (currentStep / (steps.length - 1)) * 100;
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [currentStep]);

  // GSAP animation for step indicators (scale only - colors handled by CSS)
  useEffect(() => {
    if (stepsRef.current) {
      const stepElements = stepsRef.current.querySelectorAll('.step-indicator');
      stepElements.forEach((el, index) => {
        gsap.to(el, {
          scale: index + 1 === currentStep ? 1.1 : 1,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      });
    }
  }, [currentStep]);

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div ref={stepsRef} className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border z-0" />
        
        {/* Animated progress line */}
        <div
          ref={progressRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0"
          style={{ width: '0%' }}
        />

        {/* Step indicators */}
        {steps.map((step) => (
          <div key={step.number} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={cn(
                'step-indicator w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                step.number <= currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-border text-muted-foreground'
              )}
            >
              {step.number}
            </div>
            <span
              className={cn(
                'text-xs font-medium transition-colors',
                step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
