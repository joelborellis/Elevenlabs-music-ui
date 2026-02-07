// Step 1 selection options

export type ProjectBlueprint =
  | 'ad_brand_fast_hook'
  | 'podcast_voiceover_loop'
  | 'video_game_action_loop'
  | 'meditation_sleep'
  | 'standalone_song_mini';

export type SoundProfile =
  | 'bright_pop_electro'
  | 'dark_trap_night'
  | 'lofi_cozy'
  | 'epic_cinematic'
  | 'indie_live_band';

export type DeliveryAndControl =
  | 'exploratory_iterate'
  | 'balanced_studio'
  | 'blueprint_plan_first'
  | 'live_one_take'
  | 'isolation_stems';

export interface Selections {
  project_blueprint: ProjectBlueprint | null;
  sound_profile: SoundProfile | null;
  delivery_and_control: DeliveryAndControl | null;
  instrumental_only: boolean;
}

// Option metadata for UI display
export interface SelectionOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

// Extended option metadata with hints from the guide
export interface ExtendedSelectionOption<T extends string> extends SelectionOption<T> {
  shortDescription: string;  // Brief (for compact view)
  details: string;           // What it does to your music
  whenToChoose: string[];    // Use cases
  specs?: Record<string, string>; // Technical specs like length, BPM
  recommended?: boolean;     // Whether this is a recommended default
  instrumental?: boolean;    // Whether this is an instrumental-only preset
}

export const PROJECT_BLUEPRINT_OPTIONS: ExtendedSelectionOption<ProjectBlueprint>[] = [
  // Instrumental presets first
  {
    value: 'podcast_voiceover_loop',
    label: 'Podcast Bed',
    description: '60 seconds, seamless loop, instrumental',
    shortDescription: '60s loopable bed',
    details: 'Creates gentle, unobtrusive background music that evolves subtly without jarring transitions. Perfect for looping endlessly while you talk over it.',
    whenToChoose: [
      'Need music to play behind spoken content',
      'Want something that can repeat without being annoying',
      'Need a calming backdrop that doesn\'t distract',
    ],
    specs: { 'Length': '60 seconds', 'Vocals': 'None', 'Ending': 'Seamless loop' },
    instrumental: true,
  },
  {
    value: 'video_game_action_loop',
    label: 'Game Music',
    description: '90 seconds with intro, loop, and exit',
    shortDescription: '90s action loop',
    details: 'Creates dynamic, high-energy music with exciting build-ups and powerful drops. Structure: Build-up, Drop, Breakdown, Final climax.',
    whenToChoose: [
      'Creating gaming videos or action sequences',
      'Need energetic, driving music with tension and release',
      'Want clear rising and falling intensity',
    ],
    specs: { 'Length': '90 seconds', 'Vocals': 'None', 'Structure': 'Intro + Loop + Exit' },
    instrumental: true,
  },
  {
    value: 'meditation_sleep',
    label: 'Meditation',
    description: 'Extended length, gentle fade, peaceful',
    shortDescription: 'Ambient & sleep',
    details: 'Creates soothing, atmospheric music that evolves very slowly and peacefully. No abrupt changes or energetic moments—pure tranquility.',
    whenToChoose: [
      'Want calming, peaceful music',
      'Need ambient soundscapes without sudden moments',
      'Creating content for relaxation or sleep',
    ],
    specs: { 'Length': 'Auto (usually longer)', 'Vocals': 'None', 'Ending': 'Gentle fade' },
    instrumental: true,
  },
  // Non-instrumental presets
  {
    value: 'ad_brand_fast_hook',
    label: 'Ad/Brand Spot',
    description: '30 seconds, jingle or voiceover, button ending',
    shortDescription: '30s hook, jingle or voiceover',
    details: 'Creates attention-grabbing music that hooks listeners immediately, builds quickly, and ends with a memorable stinger. Flexible for catchy sung jingles (1-2 earworm phrases) or instrumental with voiceover space.',
    whenToChoose: [
      'Making short advertisements or promotional videos',
      'Want a catchy jingle with memorable taglines',
      'Need instrumental with space for voiceover',
      'Creating content for social media platforms',
    ],
    specs: { 'Length': '30 seconds', 'Vocals': 'Flexible (jingle or voiceover space)', 'Ending': 'Stinger button' },
  },
  {
    value: 'standalone_song_mini',
    label: 'Mini Song',
    description: '90 seconds with vocals, lyrics, full structure',
    shortDescription: '90s complete song',
    details: 'Creates a mini pop song with proper structure: Intro, Verse, Chorus, Verse, Chorus, Outro. Includes AI-generated original lyrics and vocals.',
    whenToChoose: [
      'Want an actual song with singing',
      'Creating something personal to share',
      'Want a complete musical piece with a story',
    ],
    specs: { 'Length': '90 seconds', 'Vocals': 'Yes (with lyrics)', 'Structure': 'Full song' },
  },
];

export const SOUND_PROFILE_OPTIONS: ExtendedSelectionOption<SoundProfile>[] = [
  {
    value: 'bright_pop_electro',
    label: 'Pop/Electro',
    description: 'Happy, energetic, 110-125 BPM',
    shortDescription: 'Uplifting electronic',
    details: 'Creates bright, shimmering electronic music with exciting drops and catchy melodies. Think: uplifting commercials or happy social media videos.',
    whenToChoose: [
      'Want something that makes people feel happy',
      'Need energetic, danceable music',
      'Creating celebratory or positive content',
    ],
    specs: { 'Genre': 'Electronic Pop / EDM', 'Tempo': '110-125 BPM', 'Mood': 'Euphoric, celebratory' },
  },
  {
    value: 'dark_trap_night',
    label: 'Dark Trap',
    description: 'Intense, moody, 145-170 BPM',
    shortDescription: 'Dark hip-hop/trap',
    details: 'Creates heavy, bass-driven music with a menacing atmosphere. Deep 808 bass, crisp hi-hats, and dark textures. Hits hard with laid-back swagger.',
    whenToChoose: [
      'Want something with attitude and edge',
      'Creating content with a darker, moodier vibe',
      'Need music that feels urban and contemporary',
    ],
    specs: { 'Genre': 'Hip-Hop / Trap', 'Tempo': '145-170 BPM (half-time feel)', 'Mood': 'Dark, tense, edgy' },
  },
  {
    value: 'lofi_cozy',
    label: 'Lo-Fi',
    description: 'Relaxed, cozy, 85-105 BPM',
    shortDescription: 'Chill lo-fi beats',
    details: 'Creates warm, slightly imperfect-sounding music with a gentle swing. The lo-fi quality adds character and nostalgia—like an old record.',
    whenToChoose: [
      'Want background music for studying or working',
      'Need something cozy and unobtrusive',
      'Creating content with a nostalgic feel',
    ],
    specs: { 'Genre': 'Lo-fi / Chillhop', 'Tempo': '85-105 BPM', 'Mood': 'Warm, intimate, nostalgic' },
    recommended: true,
  },
  {
    value: 'epic_cinematic',
    label: 'Cinematic',
    description: 'Grand, heroic, 110-125 BPM',
    shortDescription: 'Epic orchestral',
    details: 'Creates sweeping, cinematic music building from subtle beginnings to powerful crescendos. Combines orchestral instruments with modern electronic elements.',
    whenToChoose: [
      'Want music that feels like a movie soundtrack',
      'Need something grand and inspiring',
      'Creating content with dramatic moments',
    ],
    specs: { 'Genre': 'Cinematic / Orchestral + Electronic', 'Tempo': '110-125 BPM', 'Mood': 'Epic, powerful, inspiring' },
  },
  {
    value: 'indie_live_band',
    label: 'Indie Band',
    description: 'Authentic, warm, 85-105 BPM',
    shortDescription: 'Live band feel',
    details: 'Creates music that sounds like actual musicians playing together. Starts intimate, builds to an emotionally satisfying finish with human feel.',
    whenToChoose: [
      'Want music that sounds like a real band',
      'Prefer organic, human-sounding music',
      'Creating content with an authentic vibe',
    ],
    specs: { 'Genre': 'Indie / Rock', 'Tempo': '85-105 BPM', 'Instruments': 'Drums, bass, guitars, keys' },
  },
];

export const DELIVERY_AND_CONTROL_OPTIONS: ExtendedSelectionOption<DeliveryAndControl>[] = [
  {
    value: 'exploratory_iterate',
    label: 'Exploratory',
    description: 'Maximum creativity, unique results',
    shortDescription: 'Max AI creativity',
    details: 'Gives the AI permission to take creative liberties. You might get unexpected but delightful results. Transitions flow naturally with a warm, atmospheric feel.',
    whenToChoose: [
      'Want to be surprised by what the AI creates',
      'Exploring without a specific vision',
      'Value creativity over predictability',
    ],
    specs: { 'AI Freedom': 'Very High', 'Sound': 'Warm, organic' },
  },
  {
    value: 'balanced_studio',
    label: 'Balanced',
    description: 'Recommended: professional, polished',
    shortDescription: 'Balanced studio',
    details: 'Creates professionally polished music with clear structure and smooth transitions. This is the "just make it sound good" option—reliable, clean, and balanced.',
    whenToChoose: [
      'Not sure which option to pick',
      'Want professional-sounding results',
      'Need music that sounds "radio-ready"',
    ],
    specs: { 'AI Freedom': 'Moderate', 'Sound': 'Modern, polished' },
    recommended: true,
  },
  {
    value: 'blueprint_plan_first',
    label: 'Blueprint',
    description: 'Maximum structure, precise timing',
    shortDescription: 'Max structure',
    details: 'Creates highly structured music with deliberate timing and dramatic transitions. Clear risers and impacts. Great for syncing music to specific visuals.',
    whenToChoose: [
      'Need precise control over structure',
      'Creating content where timing matters',
      'Syncing music to specific visuals',
    ],
    specs: { 'AI Freedom': 'Low', 'Sound': 'Cinematic, dramatic' },
  },
  {
    value: 'live_one_take',
    label: 'Live Take',
    description: 'Live performance feel, human touch',
    shortDescription: 'Live recording',
    details: 'Creates music that sounds like it was recorded live in one take. Natural variations, room acoustics, and imperfections that make music feel alive.',
    whenToChoose: [
      'Want music that feels "real" and human',
      'Prefer imperfections over sterile perfection',
      'Love the sound of live recordings',
    ],
    specs: { 'AI Freedom': 'Medium', 'Sound': 'Natural, breathing' },
  },
  {
    value: 'isolation_stems',
    label: 'Stems',
    description: 'Clean separation, edit-friendly',
    shortDescription: 'Separated tracks',
    details: 'Each instrument is clearly separated with a dry, precise sound. Not as musical feeling, but perfect if you plan to edit or remix the audio later.',
    whenToChoose: [
      'Might want to edit or remix later',
      'Need very clean, separated sounds',
      'Experienced with audio editing',
    ],
    specs: { 'AI Freedom': 'Very Low', 'Sound': 'Dry, precise' },
  },
];

// Recommended preset combinations by use case
export interface RecommendedCombo {
  useCase: string;
  description: string;
  blueprint: ProjectBlueprint;
  sound: SoundProfile;
  delivery: DeliveryAndControl;
}

export const RECOMMENDED_COMBINATIONS: RecommendedCombo[] = [
  {
    useCase: 'Social Media Ad',
    description: 'Catchy, energetic clip for social media advertising',
    blueprint: 'ad_brand_fast_hook',
    sound: 'bright_pop_electro',
    delivery: 'balanced_studio',
  },
  {
    useCase: 'Podcast Background',
    description: 'Chill, unobtrusive background music for spoken content',
    blueprint: 'podcast_voiceover_loop',
    sound: 'lofi_cozy',
    delivery: 'exploratory_iterate',
  },
  {
    useCase: 'Gaming Video',
    description: 'High-energy music for action and gaming content',
    blueprint: 'video_game_action_loop',
    sound: 'dark_trap_night',
    delivery: 'blueprint_plan_first',
  },
  {
    useCase: 'Meditation Track',
    description: 'Peaceful ambient music for relaxation and sleep',
    blueprint: 'meditation_sleep',
    sound: 'lofi_cozy',
    delivery: 'exploratory_iterate',
  },
  {
    useCase: 'Personal Song',
    description: 'A complete song with vocals for someone special',
    blueprint: 'standalone_song_mini',
    sound: 'indie_live_band',
    delivery: 'balanced_studio',
  },
  {
    useCase: 'Epic Trailer',
    description: 'Cinematic music for dramatic content and trailers',
    blueprint: 'video_game_action_loop',
    sound: 'epic_cinematic',
    delivery: 'blueprint_plan_first',
  },
  {
    useCase: 'Study Music',
    description: 'Relaxing background music for focus and studying',
    blueprint: 'podcast_voiceover_loop',
    sound: 'lofi_cozy',
    delivery: 'exploratory_iterate',
  },
  {
    useCase: 'Birthday Song',
    description: 'Upbeat celebratory song with personalized lyrics',
    blueprint: 'standalone_song_mini',
    sound: 'bright_pop_electro',
    delivery: 'balanced_studio',
  }
];

/**
 * Composition Plan Types
 *
 * The composition plan contains:
 * - composition_plan: object with global styles and sections
 * - song_metadata: title, description, genres, etc.
 * - words_timestamps: optional timing data
 */

// Section within the composition plan
export interface Section {
  section_name: string;
  duration_ms: number;
  positive_local_styles?: string[];
  negative_local_styles?: string[];
  lines?: string[];
}

// The core composition plan structure
export interface CompositionPlanCore {
  positive_global_styles?: string[];
  negative_global_styles?: string[];
  sections: Section[];
}

// Song metadata
export interface SongMetadata {
  title?: string;
  description?: string;
  genres?: string[];
  moods?: string[];
  tags?: string[];
}

// Full composition plan data structure
export interface CompositionPlanData {
  composition_plan: CompositionPlanCore;
  song_metadata?: SongMetadata;
  words_timestamps?: Record<string, unknown>;
}

// Generic type for backwards compatibility
export type CompositionPlan = CompositionPlanData | Record<string, unknown>;

// Editor mode for visual vs JSON editing
export type EditorMode = 'visual' | 'json';

// Prompt metadata from /prompt endpoint
export interface PromptMetadata {
  title: string;
  description: string;
}

export interface AudioResult {
  audioUrl: string;
  filename: string;
  mimeType: string;
  downloadUrl: string;
  fileSizeBytes: number;
}

// WebSocket message types for render progress
export interface WSProgressMessage {
  type: 'progress';
  stage: string;
  progress_percent: number;
  message: string;
  timestamp: string;
}

export interface WSResultMessage {
  type: 'result';
  data: {
    filename: string;
    file_path: string;
    download_url: string;
    stream_url: string;
    content_type: string;
    file_size_bytes: number;
    composition_plan: object | null;
    song_metadata: object | null;
    request_id: string;
    timestamp: string;
  };
}

export interface WSErrorMessage {
  type: 'error';
  error_code: 'INVALID_REQUEST' | 'VALIDATION_ERROR' | 'SERVER_ERROR';
  message: string;
  timestamp: string;
}

export type WSMessage = WSProgressMessage | WSResultMessage | WSErrorMessage;

export interface RenderProgress {
  stage: string;
  percent: number;
  message: string;
}

export type WizardStep = 0 | 1 | 2 | 3;

export interface WizardState {
  // Current step
  currentStep: WizardStep;

  // Step 0 data
  userNarrative: string;

  // Step 1 data
  selections: Selections;

  // Step 2 data
  promptText: string;
  promptMetadata: PromptMetadata | null;
  compositionPlanText: string;
  compositionPlanObject: CompositionPlan | null;
  planJsonError: string | null;
  editorMode: EditorMode;

  // Step 3 data
  audioResult: AudioResult | null;

  // Loading states
  isGeneratingPrompt: boolean;
  isGeneratingPlan: boolean;
  isCreatingMusic: boolean;

  // Render progress (WebSocket)
  renderProgress: RenderProgress | null;
}

export interface WizardActions {
  // Navigation
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  
  // Step 0 actions
  setUserNarrative: (text: string) => void;
  
  // Step 1 actions
  setProjectBlueprint: (value: ProjectBlueprint | null) => void;
  setSoundProfile: (value: SoundProfile | null) => void;
  setDeliveryAndControl: (value: DeliveryAndControl | null) => void;
  setInstrumentalOnly: (value: boolean) => void;
  
  // Step 2 actions
  setPromptText: (text: string) => void;
  setPromptMetadata: (metadata: PromptMetadata | null) => void;
  setCompositionPlanText: (text: string) => void;
  validateAndSetPlan: (text: string) => boolean;
  updatePlanObject: (updater: (plan: CompositionPlanData) => CompositionPlanData) => void;
  setEditorMode: (mode: EditorMode) => void;
  
  // Results
  setAudioResult: (result: AudioResult | null) => void;
  
  // Loading states
  setIsGeneratingPrompt: (value: boolean) => void;
  setIsGeneratingPlan: (value: boolean) => void;
  setIsCreatingMusic: (value: boolean) => void;

  // Render progress
  setRenderProgress: (progress: RenderProgress | null) => void;
}
