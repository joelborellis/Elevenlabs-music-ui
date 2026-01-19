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

export const PROJECT_BLUEPRINT_OPTIONS: SelectionOption<ProjectBlueprint>[] = [
  { value: 'ad_brand_fast_hook', label: 'Ad/Brand Spot', description: '30s ad/brand spot with fast hook' },
  { value: 'podcast_voiceover_loop', label: 'Podcast Bed', description: '60s loopable podcast bed' },
  { value: 'video_game_action_loop', label: 'Game Music', description: '90s loopable game music' },
  { value: 'meditation_sleep', label: 'Meditation', description: 'Ambient meditation/sleep music' },
  { value: 'standalone_song_mini', label: 'Mini Song', description: '90s mini-song with structure' },
];

export const SOUND_PROFILE_OPTIONS: SelectionOption<SoundProfile>[] = [
  { value: 'bright_pop_electro', label: 'Pop/Electro', description: 'Uplifting electronic/EDM' },
  { value: 'dark_trap_night', label: 'Dark Trap', description: 'Dark trap/hip-hop' },
  { value: 'lofi_cozy', label: 'Lo-Fi', description: 'Cozy lo-fi beats' },
  { value: 'epic_cinematic', label: 'Cinematic', description: 'Epic cinematic orchestral' },
  { value: 'indie_live_band', label: 'Indie Band', description: 'Indie live band sound' },
];

export const DELIVERY_AND_CONTROL_OPTIONS: SelectionOption<DeliveryAndControl>[] = [
  { value: 'exploratory_iterate', label: 'Exploratory', description: 'Exploratory with iteration' },
  { value: 'balanced_studio', label: 'Balanced', description: 'Balanced studio approach' },
  { value: 'blueprint_plan_first', label: 'Blueprint', description: 'Blueprint planning first' },
  { value: 'live_one_take', label: 'Live Take', description: 'Live one-take recording' },
  { value: 'isolation_stems', label: 'Stems', description: 'Isolated stem outputs' },
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
}
