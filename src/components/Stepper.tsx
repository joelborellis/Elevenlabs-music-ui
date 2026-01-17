import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useWizardStore } from '@/state/wizardStore';

interface StepperProps {
  className?: string;
}

const steps = [
  { number: 0, label: 'Configure', icon: '01' },
  { number: 1, label: 'Story', icon: '02' },
  { number: 2, label: 'Compose', icon: '03' },
  { number: 3, label: 'Listen', icon: '04' },
];

export function Stepper({ className }: StepperProps) {
  const currentStep = useWizardStore((state) => state.currentStep);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation for progress bar
  useEffect(() => {
    if (progressRef.current) {
      const progress = (currentStep / (steps.length - 1)) * 100;
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, [currentStep]);

  // GSAP stagger animation on mount
  useEffect(() => {
    if (containerRef.current) {
      const stepElements = containerRef.current.querySelectorAll('.step-item');
      gsap.fromTo(
        stepElements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  // Animate current step indicator
  useEffect(() => {
    if (containerRef.current) {
      const stepElements = containerRef.current.querySelectorAll('.step-indicator');
      stepElements.forEach((el, index) => {
        if (index === currentStep) {
          gsap.to(el, {
            scale: 1.05,
            duration: 0.4,
            ease: 'back.out(2)',
          });
        } else {
          gsap.to(el, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });
    }
  }, [currentStep]);

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <div ref={containerRef} className="relative">
        {/* Background track - tape deck inspired */}
        <div className="absolute left-0 right-0 top-8 h-[3px] bg-muted rounded-full overflow-hidden">
          {/* Subtle stripes pattern */}
          <div className="absolute inset-0 tape-stripes opacity-50" />
        </div>

        {/* Animated progress line with glow */}
        <div
          ref={progressRef}
          className="absolute left-0 top-8 h-[3px] rounded-full z-[1]"
          style={{
            width: '0%',
            background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
            boxShadow: '0 0 12px hsl(var(--primary) / 0.4)',
          }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between items-start">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;

            return (
              <div
                key={step.number}
                className="step-item flex flex-col items-center gap-3 relative z-10"
              >
                {/* Step indicator - analog dial inspired */}
                <div
                  className={cn(
                    'step-indicator relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-br from-primary to-accent glow-warm'
                      : isCompleted
                      ? 'bg-secondary'
                      : 'bg-card border-2 border-border'
                  )}
                >
                  {/* Inner ring - vintage dial look */}
                  <div
                    className={cn(
                      'absolute inset-1 rounded-full border transition-colors duration-300',
                      isActive
                        ? 'border-primary-foreground/30'
                        : isCompleted
                        ? 'border-secondary-foreground/20'
                        : 'border-border/50'
                    )}
                  />

                  {/* Step number with serif font */}
                  <span
                    className={cn(
                      'font-display text-lg relative z-10 transition-colors duration-300',
                      isActive
                        ? 'text-primary-foreground'
                        : isCompleted
                        ? 'text-secondary-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.icon}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent animate-pulse-warm" />
                  )}

                  {/* Completed checkmark */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Step label */}
                <div className="text-center">
                  <span
                    className={cn(
                      'text-sm font-medium tracking-wide transition-colors duration-300',
                      isActive
                        ? 'text-foreground'
                        : isCompleted
                        ? 'text-foreground/80'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
