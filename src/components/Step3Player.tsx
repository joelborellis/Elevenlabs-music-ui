import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { Download, RotateCcw, CheckCircle, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWizardStore } from '@/state/wizardStore';
import type { CompositionPlan } from '@/types';

export function Step3Player() {
  const { audioResult, compositionPlanObject, reset } = useWizardStore();
  const waveformRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

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
        { scaleY: 0.3 },
        {
          scaleY: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );

      // Continuous wave animation
      bars.forEach((bar, index) => {
        const randomDelay = index * 0.1;
        gsap.to(bar, {
          scaleY: () => 0.3 + Math.random() * 0.7,
          duration: 0.3 + Math.random() * 0.3,
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

  if (!audioResult) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No audio available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4"
        >
          <CheckCircle className="h-8 w-8" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Your Music is Ready!</h2>
        <p className="text-muted-foreground">
          Listen to your composition and download when you're happy
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            {songTitle}
          </CardTitle>
          {songDescription && (
            <CardDescription className="line-clamp-2">
              {songDescription}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GSAP Animated Waveform */}
          <div 
            ref={waveformRef}
            className="flex items-end justify-center gap-1 h-24 px-4 py-4 bg-muted/50 rounded-lg"
          >
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) barsRef.current[i] = el;
                }}
                className="w-2 bg-primary rounded-full origin-bottom"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 30}%`,
                }}
              />
            ))}
          </div>

          {/* Audio Player */}
          <div className="w-full">
            <audio
              controls
              className="w-full h-12"
              src={audioResult.audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button asChild className="w-full">
                <a
                  href={audioResult.downloadUrl || audioResult.audioUrl}
                  download={audioResult.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button variant="outline" onClick={reset} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* File Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          File: <span className="font-mono">{audioResult.filename}</span>
          {' • '}
          Type: <span className="font-mono">{audioResult.mimeType}</span>
          {audioResult.fileSizeBytes > 0 && (
            <>
              {' • '}
              Size: <span className="font-mono">{(audioResult.fileSizeBytes / 1024).toFixed(1)} KB</span>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}
