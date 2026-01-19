import { motion } from 'motion/react';
import { ArrowRight, Loader2, Sparkles, ShieldAlert, Music, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWizardStore } from '@/state/wizardStore';
import { generatePromptFromSelections } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import type { ProjectBlueprint } from '@/types';

// Dynamic content based on blueprint selection
interface BlueprintContent {
  title: string;
  subtitle: string;
  description: string;
  placeholder: string;
  tips: string[];
  hasVocals: boolean;
  narrativeEffect: string;
  icon: React.ReactNode;
}

const BLUEPRINT_CONTENT: Record<ProjectBlueprint, BlueprintContent> = {
  ad_brand_fast_hook: {
    title: 'Tell us about your brand',
    subtitle: 'Ad/Brand Spot',
    description: 'Share details about your brand, product, and the message you want to convey in this 30-second spot.',
    placeholder: `Example: We're launching a new energy drink called "Surge" targeting young athletes. The ad should feel powerful and exciting, with a fast hook that grabs attention. The tagline is "Fuel Your Fire" and we want viewers to feel energized and motivated...

Key details to include:
- Brand name and product type
- Target audience demographics
- Desired emotional response
- Any taglines or key messages`,
    tips: [
      'Describe your brand personality and core values',
      'What emotion should viewers feel after watching?',
      'Who is your target audience?',
      'Any specific tagline or call-to-action to incorporate?',
    ],
    hasVocals: false,
    narrativeEffect: 'Your story will influence the musical mood and energy—the music will leave space for your voiceover while conveying your brand\'s personality.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  podcast_voiceover_loop: {
    title: 'Describe your podcast',
    subtitle: 'Podcast Background Music',
    description: 'Tell us about your podcast so we can create the perfect background bed that complements your content without stealing the spotlight.',
    placeholder: `Example: My podcast is called "Tech Tomorrow" where I discuss emerging technology trends with industry experts. The tone is conversational but professional. I need subtle background music that doesn't distract from the conversation but adds energy during transitions...

Key details to include:
- Podcast name and topic
- Overall tone and energy level
- When the music will play (intro, background, transitions)
- Any reference shows or moods to match`,
    tips: [
      'What is your podcast topic and format?',
      'Describe the overall tone (casual, professional, energetic)',
      'When will the music play (intro, background, transitions)?',
      'Any specific moods to match different segments?',
    ],
    hasVocals: false,
    narrativeEffect: 'Your story creates a "musical portrait" of your content—the mood and energy will match your podcast\'s personality while staying unobtrusive enough for talking over.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  video_game_action_loop: {
    title: 'Tell us about your game',
    subtitle: 'Video Game Music',
    description: 'Describe the game, scene, or level where this music will play. The more context you provide, the better we can match the gameplay experience.',
    placeholder: `Example: I'm creating a sci-fi roguelike where players explore an abandoned space station. This track is for the combat encounters with alien creatures. The gameplay is fast-paced with dodge-rolling and melee combat. Think Dead Cells meets Alien. I want players to feel tense but empowered...

Key details to include:
- Game genre and style
- Scene/level description
- Gameplay pace and intensity
- Reference games or soundtracks`,
    tips: [
      'What genre is your game (RPG, platformer, shooter)?',
      'Describe the scene or level where this plays',
      'What enemies or challenges does the player face?',
      'What emotions should players feel during gameplay?',
    ],
    hasVocals: false,
    narrativeEffect: 'Your story shapes the dynamic tension and release in the music—the build-ups, drops, and transitions will match your gameplay intensity.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    ),
  },
  meditation_sleep: {
    title: 'Describe your meditation journey',
    subtitle: 'Meditation & Sleep Music',
    description: 'Help us understand the meditative or restful experience you want to create for your listeners.',
    placeholder: `Example: I'm creating a guided meditation for stress relief after a long workday. The listener should feel like they're floating in a warm, peaceful space. Imagine a quiet forest at twilight with gentle streams. The meditation is 20 minutes and focuses on body scanning and breath awareness...

Key details to include:
- Type of meditation or relaxation
- Mental imagery or environment
- Time of day it's intended for
- Desired emotional outcome`,
    tips: [
      'What type of meditation or relaxation practice?',
      'Describe the mental environment or imagery',
      'What time of day is this intended for?',
      'What feelings should linger after the session?',
    ],
    hasVocals: false,
    narrativeEffect: 'Your story creates the emotional landscape—the music will evolve peacefully to match your described journey, with no sudden moments to break the tranquility.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  standalone_song_mini: {
    title: 'Share your song\'s story',
    subtitle: 'Personal Mini-Song',
    description: 'Tell us about the person, occasion, or story that will inspire this song. Personal details help us create something truly meaningful with custom lyrics.',
    placeholder: `Example: I want to create a song for my daughter Emma's 5th birthday. She loves unicorns, rainbows, and her cat named Whiskers. The song should be playful and magical, celebrating how she brings joy to our family. She always says "I love you to the moon and back"...

Key details to include:
- Who is this song for? (use their real name!)
- What's the occasion or story?
- Personal details, inside jokes, or memories
- Key phrases you want in the lyrics`,
    tips: [
      'Include specific names—they\'ll appear in the lyrics!',
      'Share personal details, inside jokes, or memories',
      'What emotions do you want to capture?',
      'Any specific phrases or quotes to include?',
    ],
    hasVocals: true,
    narrativeEffect: 'This is where the magic happens! Your story becomes the actual lyrics—names, occasions, and personal details will be woven into a custom song sung just for your person.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
};

export function Step0UserNarrative() {
  const {
    userNarrative,
    setUserNarrative,
    selections,
    setPromptText,
    setPromptMetadata,
    nextStep,
    isGeneratingPrompt,
    setIsGeneratingPrompt,
  } = useWizardStore();

  // Get content based on selected blueprint
  const blueprint = selections.project_blueprint;
  const content = blueprint ? BLUEPRINT_CONTENT[blueprint] : null;
  const isInstrumental = selections.instrumental_only;

  const handleGenerateAndContinue = async () => {
    setIsGeneratingPrompt(true);
    try {
      const result = await generatePromptFromSelections(selections, userNarrative);
      setPromptText(result.prompt);
      setPromptMetadata({ title: result.title, description: result.description });
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

  // Fallback content if no blueprint selected (shouldn't happen in normal flow)
  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please select a project blueprint first.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Hero section with dynamic typography */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
              Step Two
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {content.subtitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-[1.1]"
          >
            {content.title.split(' ').map((word, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? (
                  <span className="italic text-primary">{word}</span>
                ) : (
                  word + ' '
                )}
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            {content.description}
          </motion.p>
        </div>
      </div>

      {/* How your story affects the music */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {content.hasVocals && !isInstrumental ? (
              <Mic className="w-4 h-4 text-primary" />
            ) : (
              <Music className="w-4 h-4 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-foreground">How your story affects the music</h4>
              {content.hasVocals && !isInstrumental && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  Creates Lyrics
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isInstrumental && content.hasVocals
                ? 'Since you chose instrumental only, your story will influence the emotional journey and mood of the music instead of being turned into lyrics.'
                : content.narrativeEffect}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="relative overflow-visible">
          {/* Decorative corner accent */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-accent/40 rounded-br-lg" />

          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              {/* Dynamic icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary">
                {content.icon}
              </div>
              <div>
                <CardTitle className="text-lg">Your Story</CardTitle>
                <CardDescription>
                  The more detail you share, the better your music will be
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="user-narrative" className="sr-only">
                Your narrative
              </Label>
              <Textarea
                id="user-narrative"
                placeholder={content.placeholder}
                value={userNarrative}
                onChange={(e) => setUserNarrative(e.target.value)}
                disabled={isGeneratingPrompt}
                className="min-h-[160px] sm:min-h-[220px] resize-y text-base leading-relaxed placeholder:text-muted-foreground/50 rounded-xl border-border/60 bg-background/50 focus:bg-background transition-colors"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{userNarrative.length > 0 ? `${userNarrative.length} characters` : 'Start typing your story...'}</span>
                {userNarrative.length > 500 && (
                  <span className="text-primary">Great detail!</span>
                )}
              </div>
            </div>

            {/* Tips section with dynamic content */}
            <div className="relative bg-muted/30 rounded-xl p-5 border border-border/40">
              {/* Decorative tape stripe */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

              <h4 className="font-display text-base text-foreground flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                What to include
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {content.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span className="font-display text-primary/60 text-xs mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
              <ShieldAlert className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Privacy Note</p>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  Avoid including sensitive information like home addresses, phone numbers, emails, financial details, or medical information. These will be automatically filtered out for your protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleGenerateAndContinue}
          size="xl"
          disabled={isGeneratingPrompt}
          className="group gap-3 w-full sm:w-auto sm:min-w-[280px]"
        >
          {isGeneratingPrompt ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Prompt...
            </>
          ) : (
            <>
              Generate & Continue
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
