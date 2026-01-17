import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWizardStore } from '@/state/wizardStore';
import type { CompositionPlan } from '@/types';

export function Step3Player() {
  const { audioResult, compositionPlanObject, reset } = useWizardStore();
  const barsRef = useRef<HTMLDivElement[]>([]);
  const vinylRef = useRef<HTMLDivElement>(null);

  // Extract song title from plan
  const songTitle = (
    compositionPlanObject as CompositionPlan & {
      song_metadata?: { title?: string; description?: string };
    }
  )?.song_metadata?.title || 'Your Composition';

  const songDescription = (
    compositionPlanObject as CompositionPlan & {
      song_metadata?: { description?: string };
    }
  )?.song_metadata?.description;

  // GSAP waveform animation
  useEffect(() => {
    if (barsRef.current.length > 0) {
      const bars = barsRef.current;

      // Initial stagger animation
      gsap.fromTo(
        bars,
        { scaleY: 0.2, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.out',
        }
      );

      // Continuous wave animation
      bars.forEach((bar, index) => {
        const randomDelay = index * 0.08;
        gsap.to(bar, {
          scaleY: () => 0.2 + Math.random() * 0.8,
          duration: 0.25 + Math.random() * 0.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: randomDelay,
        });
      });

      return () => {
        bars.forEach((bar) => {
          gsap.killTweensOf(bar);
        });
      };
    }
  }, []);

  // Vinyl spin animation
  useEffect(() => {
    if (vinylRef.current) {
      gsap.to(vinylRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: 'none',
      });

      return () => {
        if (vinylRef.current) {
          gsap.killTweensOf(vinylRef.current);
        }
      };
    }
  }, []);

  if (!audioResult) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground font-display italic">No audio available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-10"
    >
      {/* Success header */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6 relative"
        >
          {/* Vinyl record design */}
          <div
            ref={vinylRef}
            className="absolute inset-2 rounded-full bg-gradient-to-br from-foreground to-foreground/80"
          >
            {/* Vinyl grooves */}
            <div className="absolute inset-0 rounded-full vinyl-groove opacity-30" />
            {/* Center label */}
            <div className="absolute inset-[30%] rounded-full bg-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/80" />
            </div>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="inline-block text-xs uppercase tracking-[0.3em] text-primary font-medium mb-3"
        >
          Complete
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="font-display text-4xl md:text-5xl text-foreground mb-4"
        >
          Your Music is <span className="italic text-primary">Ready</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-lg text-muted-foreground"
        >
          Listen to your composition and download when ready
        </motion.p>
      </div>

      {/* Main player card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="relative overflow-visible">
          {/* Decorative corners */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-r-2 border-t-2 border-accent/40 rounded-tr-lg" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-l-2 border-b-2 border-secondary/40 rounded-bl-lg" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-lg" />

          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              </div>
            </div>
            <CardTitle className="font-display text-2xl">{songTitle}</CardTitle>
            {songDescription && (
              <CardDescription className="line-clamp-2 max-w-md mx-auto mt-2">
                {songDescription}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Waveform visualization */}
            <div className="relative bg-muted/30 rounded-2xl p-6 overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

              {/* Waveform bars */}
              <div className="flex items-end justify-center gap-[3px] h-28 relative z-10">
                {Array.from({ length: 48 }).map((_, i) => {
                  const heightVariation = Math.sin(i * 0.3) * 30 + Math.cos(i * 0.5) * 20;
                  const baseHeight = 30 + heightVariation + Math.random() * 20;

                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        if (el) barsRef.current[i] = el;
                      }}
                      className="rounded-full origin-bottom"
                      style={{
                        width: '4px',
                        height: `${baseHeight}%`,
                        background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))`,
                        opacity: 0.7 + Math.random() * 0.3,
                      }}
                    />
                  );
                })}
              </div>

              {/* Time markers */}
              <div className="flex justify-between mt-4 px-2 text-xs text-muted-foreground font-mono-code">
                <span>0:00</span>
                <span>0:30</span>
              </div>
            </div>

            {/* Native audio player - styled container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-xl" />
              <audio
                controls
                className="w-full h-12 relative z-10"
                src={audioResult.audioUrl}
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1" size="lg">
                <a
                  href={audioResult.downloadUrl || audioResult.audioUrl}
                  download={audioResult.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Track
                </a>
              </Button>
              <Button variant="outline" onClick={reset} className="flex-1" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Start New Composition
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* File metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-4 px-5 py-3 rounded-full bg-muted/30 border border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="font-mono-code">{audioResult.filename}</span>
          </div>
          <span className="w-px h-4 bg-border" />
          <span className="text-xs text-muted-foreground font-mono-code">{audioResult.mimeType}</span>
          {audioResult.fileSizeBytes > 0 && (
            <>
              <span className="w-px h-4 bg-border" />
              <span className="text-xs text-muted-foreground font-mono-code">
                {(audioResult.fileSizeBytes / 1024).toFixed(1)} KB
              </span>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
