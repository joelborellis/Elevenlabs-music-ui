import type { Selections, CompositionPlan } from '@/types';
import { createMockAudioUrl } from '@/lib/mockAudio';

/**
 * Backend API base URL
 */
const API_BASE_URL = 'http://localhost:8000';

/**
 * Toggle this to switch between mock mode and real API calls.
 * Set to false to use the FastAPI backend.
 */
export const MOCK_MODE_PROMPT = false;  // Use real /prompt endpoint
export const MOCK_MODE_PLAN = false;    // Use real /plan endpoint
export const MOCK_MODE_RENDER = false;  // Use real /render endpoint


/**
 * Simulated network latency range (ms)
 */
const MIN_LATENCY = 600;
const MAX_LATENCY = 1200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomLatency = () => Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;

/**
 * {{PROMPT_TEMPLATE}}
 * 
 * This template is used to generate the prompt text from user selections.
 * Replace this with your actual prompt template logic.
 */
function generateMockPrompt(selections: Selections): string {
  const blueprintDescriptions: Record<string, string> = {
    ad_brand_fast_hook: 'a 30-second ad/brand spot with a fast, attention-grabbing hook',
    podcast_voiceover_loop: 'a 60-second loopable podcast background bed',
    video_game_action_loop: 'a 90-second loopable video game action track',
    meditation_sleep: 'ambient meditation and sleep music',
    standalone_song_mini: 'a 90-second mini-song with full structure',
  };

  const profileDescriptions: Record<string, string> = {
    bright_pop_electro: 'uplifting electronic/EDM with bright pop sensibilities',
    dark_trap_night: 'dark trap/hip-hop with nighttime vibes',
    lofi_cozy: 'cozy lo-fi beats with warm textures',
    epic_cinematic: 'epic cinematic orchestral arrangements',
    indie_live_band: 'indie live band sound with organic instruments',
  };

  const deliveryDescriptions: Record<string, string> = {
    exploratory_iterate: 'an exploratory approach with room for iteration',
    balanced_studio: 'a balanced studio production approach',
    blueprint_plan_first: 'a blueprint-first planning methodology',
    live_one_take: 'a live one-take recording style',
    isolation_stems: 'isolated stem outputs for maximum flexibility',
  };

  const blueprint = selections.project_blueprint 
    ? blueprintDescriptions[selections.project_blueprint] 
    : 'a custom music piece';
  const profile = selections.sound_profile 
    ? profileDescriptions[selections.sound_profile] 
    : 'a unique sonic palette';
  const delivery = selections.delivery_and_control 
    ? deliveryDescriptions[selections.delivery_and_control] 
    : 'a flexible workflow';
  const instrumental = selections.instrumental_only 
    ? 'The track should be purely instrumental with no vocals.' 
    : '';

  return `Create ${blueprint} featuring ${profile}. Use ${delivery} for the production. ${instrumental}

The composition should have clear sections with distinct energy levels, appropriate transitions, and professional production quality. Focus on creating an engaging musical journey that serves the intended purpose.`.trim();
}

/**
 * {{SAMPLE_COMPOSITION_PLAN_JSON}}
 * 
 * This is the mock composition plan returned by the API.
 * Replace with actual API response structure.
 */
const SAMPLE_PLAN: CompositionPlan = {
  composition_plan: {
    positive_global_styles: [
      "electronic",
      "fast-paced",
      "intense",
      "video game music",
      "high-adrenaline",
      "driving synth arpeggios",
      "punchy drums",
      "distorted bass",
      "aggressive rhythmic textures",
      "140 bpm"
    ],
    negative_global_styles: [
      "slow",
      "calm",
      "acoustic",
      "orchestral",
      "ambient",
      "lo-fi"
    ],
    sections: [
      {
        section_name: "Intro",
        positive_local_styles: [
          "glitch effects",
          "stuttering synth intro",
          "quick drum fill"
        ],
        negative_local_styles: [
          "melody",
          "bass",
          "vocals"
        ],
        duration_ms: 3000,
        lines: []
      },
      {
        section_name: "Main Section",
        positive_local_styles: [
          "full energy",
          "driving synth arpeggio",
          "punchy drum beat",
          "heavy distorted bassline",
          "aggressive rhythm",
          "glitchy vocal chop"
        ],
        negative_local_styles: [
          "slow tempo",
          "clean sounds",
          "acoustic instruments"
        ],
        duration_ms: 4000,
        lines: [
          "Go!",
          "Faster!"
        ]
      },
      {
        section_name: "Outro",
        positive_local_styles: [
          "abrupt stop",
          "sound of a short circuit",
          "final explosive hit",
          "echoing reverb tail"
        ],
        negative_local_styles: [
          "fade out",
          "melodic resolution",
          "vocals"
        ],
        duration_ms: 3000,
        lines: []
      }
    ]
  },
  song_metadata: {
    title: "Adrenaline Spike",
    description: "An intense, fast-paced electronic track designed for a high-adrenaline video game scene. Features driving synth arpeggios, punchy drums, distorted bass, and glitch effects to create a feeling of relentless forward motion and excitement.",
    genres: [
      "electronic",
      "video game music",
      "techno",
      "industrial"
    ],
    languages: [
      "English"
    ],
    is_explicit: false
  },
  words_timestamps: null
};

/**
 * Response from the /prompt endpoint
 */
interface PromptGenerationResponse {
  prompt: string;
  title: string;
  description: string;
  request_id: string;
  timestamp: string;
  input_parameters: {
    project_blueprint: string;
    sound_profile: string;
    delivery_and_control: string;
    instrumental_only: boolean;
    user_narrative: string;
    title: string;
    description: string;
  };
}

/**
 * Parsed result from generatePromptFromSelections
 */
export interface PromptResult {
  prompt: string;
  title: string;
  description: string;
}

/**
 * Response from the /render endpoint
 */
interface RenderResponse {
  filename: string;
  file_path: string;
  download_url: string;        // e.g., "/render/download/track_abc123.mp3"
  content_type: string;        // "audio/mpeg"
  file_size_bytes: number;
  composition_plan: object | null;
  song_metadata: object | null;
  request_id: string;
  timestamp: string;
}

/**
 * Get the full URL for streaming audio (for <audio> element src).
 */
export function getStreamUrl(filename: string): string {
  return `${API_BASE_URL}/render/stream/${filename}`;
}

/**
 * Get the full URL for downloading audio.
 */
export function getDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/render/download/${filename}`;
}

/**
 * Generate a prompt from user selections.
 *
 * @param selections - The user's step 1 selections
 * @param userNarrative - The user's narrative describing their intent
 * @returns Promise<PromptResult> - The generated prompt text with title and description
 *
 * Calls POST http://localhost:8000/prompt
 */
export async function generatePromptFromSelections(selections: Selections, userNarrative: string): Promise<PromptResult> {
  const payload = {
    project_blueprint: selections.project_blueprint,
    sound_profile: selections.sound_profile,
    delivery_and_control: selections.delivery_and_control,
    instrumental_only: selections.instrumental_only,
    user_narrative: userNarrative,
  };
  console.log('POST /prompt payload:', JSON.stringify(payload, null, 2));

  if (MOCK_MODE_PROMPT) {
    await delay(randomLatency());
    return {
      prompt: generateMockPrompt(selections),
      title: 'Untitled Song',
      description: 'A custom music composition',
    };
  }

  const response = await fetch(`${API_BASE_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate prompt: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: PromptGenerationResponse = await response.json();
  console.log('POST /prompt response:', data);

  return {
    prompt: data.prompt,
    title: data.title,
    description: data.description,
  };
}

/**
 * Generate a composition plan from prompt text.
 *
 * @param promptText - The prompt text (editable by user)
 * @returns Promise<CompositionPlan> - The composition plan JSON
 *
 * Calls POST http://localhost:8000/plan
 */
export async function generateCompositionPlan(promptText: string): Promise<CompositionPlan> {
  const payload = {
    prompt: promptText,
  };
  console.log('POST /plan payload:', JSON.stringify(payload, null, 2));

  if (MOCK_MODE_PLAN) {
    await delay(randomLatency());
    // In mock mode, we ignore the prompt and return the sample plan
    console.log('Generating plan from prompt:', promptText);
    return SAMPLE_PLAN;
  }

  const response = await fetch(`${API_BASE_URL}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate plan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('POST /plan response:', data);
  
  return data;
}

/**
 * Create music from a composition plan.
 * Note: This can take 30-120 seconds depending on complexity.
 * 
 * @param plan - The composition plan JSON (editable by user)
 * @returns Promise<{ audioUrl: string; filename: string; mimeType: string; downloadUrl: string; fileSizeBytes: number }>
 * 
 * Calls POST http://localhost:8000/render
 */
export async function createMusicFromPlan(
  plan: CompositionPlan
): Promise<{ audioUrl: string; filename: string; mimeType: string; downloadUrl: string; fileSizeBytes: number }> {
  // Unwrap composition_plan if it's in wrapped format
  // The render endpoint expects the plan content directly, not wrapped
  const wrapped = plan as { composition_plan?: CompositionPlan };
  const renderPayload = wrapped.composition_plan || plan;

  console.log('POST /render payload:', JSON.stringify(renderPayload, null, 2));

  if (MOCK_MODE_RENDER) {
    await delay(randomLatency() * 1.5); // Music generation takes longer
    console.log('Creating music from plan:', renderPayload);

    // Extract title from plan if available
    const metadata = (plan as { song_metadata?: { title?: string } }).song_metadata;
    const title = metadata?.title || 'composition';
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.mp3`;

    return {
      audioUrl: createMockAudioUrl(),
      filename,
      mimeType: 'audio/mpeg',
      downloadUrl: '',
      fileSizeBytes: 0,
    };
  }

  const response = await fetch(`${API_BASE_URL}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(renderPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to create music: ${response.status} ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data: RenderResponse = await response.json();
  console.log('POST /render response:', data);

  // Use the stream URL for playback
  const audioUrl = getStreamUrl(data.filename);
  const downloadUrl = getDownloadUrl(data.filename);

  return {
    audioUrl,
    filename: data.filename,
    mimeType: data.content_type,
    downloadUrl,
    fileSizeBytes: data.file_size_bytes,
  };
}
