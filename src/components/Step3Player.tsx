import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { Download, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWizardStore } from '@/state/wizardStore';
import type { CompositionPlan } from '@/types';

// Format time in mm:ss
function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Step3Player() {
  const { audioResult, compositionPlanObject, reset } = useWizardStore();
  const barsRef = useRef<HTMLDivElement[]>([]);
  const vinylRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

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

  // Vinyl spin animation - only when playing
  useEffect(() => {
    if (vinylRef.current) {
      if (isPlaying) {
        gsap.to(vinylRef.current, {
          rotation: '+=360',
          duration: 4,
          repeat: -1,
          ease: 'none',
        });
      } else {
        gsap.killTweensOf(vinylRef.current);
      }

      return () => {
        if (vinylRef.current) {
          gsap.killTweensOf(vinylRef.current);
        }
      };
    }
  }, [isPlaying]);

  // Audio player controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

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
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6 relative"
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
          className="block text-xs uppercase tracking-[0.3em] text-primary font-medium mb-3 mr-[0.3em]"
        >
          Complete
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 text-center"
        >
          Your Music is <span className="italic text-primary">Ready</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-lg text-muted-foreground text-center"
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
              <div className="flex items-end justify-center gap-[2px] sm:gap-[3px] h-20 sm:h-28 relative z-10">
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

            {/* Custom audio player */}
            <div className="relative bg-foreground/95 rounded-2xl p-4 shadow-lg">
              {/* Hidden native audio element */}
              <audio
                ref={audioRef}
                src={audioResult.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              <div className="flex items-center gap-4">
                {/* Play/Pause button */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 ml-0" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Progress section */}
                <div className="flex-1 space-y-1">
                  {/* Progress bar */}
                  <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="h-2 bg-background/30 rounded-full cursor-pointer group relative overflow-hidden"
                  >
                    {/* Progress fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    {/* Hover highlight */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Playhead */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `calc(${progressPercentage}% - 6px)` }}
                    />
                  </div>

                  {/* Time display */}
                  <div className="flex justify-between text-xs font-mono-code text-background/70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Volume controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-lg bg-background/20 hover:bg-background/30 text-background/80 hover:text-background flex items-center justify-center transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="hidden sm:block w-16 h-1 bg-background/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                    aria-label="Volume"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button asChild className="flex-1" size="lg">
                <a
                  href={audioResult.downloadUrl || audioResult.audioUrl}
                  download={audioResult.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Download Track</span>
                </a>
              </Button>
              <Button variant="outline" onClick={reset} className="flex-1" size="lg">
                <RotateCcw className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Start New Composition</span>
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
