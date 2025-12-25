# Coding Agent Prompt — Build a Vite + Tailwind + shadcn/ui + motion + GSAP Front-End Scaffold (3‑Step Music Composer Flow)

You are a coding agent. Generate a **front-end-only** React application that implements a **3-step wizard** for a music composition experience.

This is a **UI scaffolding** project that will later call a **FastAPI backend**, but **for now it must simulate the backend** using mocked async calls. Structure the code so swapping mocks for real `fetch()` calls is straightforward.

---

## 1) Stack (required)

- **Vite + React + TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components (Radix-based)
- **Motion** (package name: `motion`)
- **GSAP**

Non-negotiables:
- App runs with `npm install` + `npm run dev`
- No backend code included
- All “backend” steps are mocked, but implemented behind a thin `services/api.ts` layer

---

## 2) Visual style and design system (required)

The look must be **clean, high-contrast, and professional**:

- **Base palette:** black + white, with subtle neutral grays for surfaces/borders.
  - Background: near-black
  - Foreground text: near-white
  - Muted surfaces: very dark gray (cards/panels)
  - Borders: low-contrast gray
- **Accent usage:** use **one primary accent color** (and at most one secondary accent) only for:
  - active selections
  - progress/step indicators
  - primary CTA buttons
  - success/error states (keep these minimal and consistent)
- **Icons:** use icons sparingly for clarity (e.g., small icons in buttons, section headers, toast states).
  - Recommended: `lucide-react` (pairs well with shadcn/ui), but keep icon usage minimal.
- **Typography & spacing:**
  - clean type hierarchy, generous whitespace, consistent spacing scale
  - avoid decorative gradients and excessive shadows; the “creativity” comes from motion + layout polish, not color noise
- **Motion style:** subtle, purposeful transitions; no flashy over-animation.

---

## 3) High-level product goal

Create a single-page app that guides the user through:

### Step 1 — Selections (3 required + 1 optional)
User selects options from **three questions** (defined below), plus an optional `instrumental_only` toggle.

These selections are sent to the backend (mocked) to generate a **prompt text** used to create a composition plan.

### Step 2 — Prompt + Composition Plan (editable)
- Generate prompt text (from Step 1 selections via mocked API)
- Allow user to **edit the prompt text**
- User clicks **Generate Plan** → send prompt text to backend (mocked) → receive a **composition plan JSON**
- Allow user to **edit the plan JSON**
- User clicks **Create Music** → send edited plan JSON to backend (mocked) → receive a simulated “music file”

### Step 3 — Playback + Download
- Display an audio player to play/pause the generated audio
- Provide a **Download** button
- Provide a **Start Over** action that resets the wizard state

---

## 4) Data contracts & placeholders (use these exactly)

### Step 1 options (current placeholders you can replace later)

Use these three required fields and their options:

- `project_blueprint` (required): defines the use case and structure  
  **options**
  - `ad_brand_fast_hook` — 30s ad/brand spot with fast hook
  - `podcast_voiceover_loop` — 60s loopable podcast bed
  - `video_game_action_loop` — 90s loopable game music
  - `meditation_sleep` — ambient meditation/sleep music
  - `standalone_song_mini` — 90s mini-song with structure

- `sound_profile` (required): defines genre and sonic characteristics  
  **options**
  - `bright_pop_electro` — uplifting electronic/EDM
  - `dark_trap_night` — dark trap/hip-hop
  - `lofi_cozy` — cozy lo-fi beats
  - `epic_cinematic` — epic cinematic orchestral
  - `indie_live_band` — indie live band sound

- `delivery_and_control` (required): defines workflow preferences  
  **options**
  - `exploratory_iterate` — exploratory with iteration
  - `balanced_studio` — balanced studio approach
  - `blueprint_plan_first` — blueprint planning first
  - `live_one_take` — live one-take recording
  - `isolation_stems` — isolated stem outputs

Include an additional optional boolean:
- `instrumental_only` (default `false`)

#### Step 1 → backend request payload (mocked)

When the user has selected all required fields, send this JSON payload:

```json
{
  "project_blueprint": "ad_brand_fast_hook",
  "sound_profile": "bright_pop_electro",
  "delivery_and_control": "balanced_studio",
  "instrumental_only": false
}
```

The mocked backend returns **plain text**: the generated prompt.

#### Prompt template placeholder
Keep this placeholder in the codebase so it can be replaced later:

- `{{PROMPT_TEMPLATE}}`

---

### Step 2 → composition plan JSON (mocked backend response)

When the user clicks **Generate Plan**, send the (editable) prompt text to the backend (mocked). The mocked backend returns this JSON shape (store it, show it, allow editing):

```json
{
  "composition_plan": {
    "positive_global_styles": [
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
    "negative_global_styles": [
      "slow",
      "calm",
      "acoustic",
      "orchestral",
      "ambient",
      "lo-fi"
    ],
    "sections": [
      {
        "section_name": "Intro",
        "positive_local_styles": [
          "glitch effects",
          "stuttering synth intro",
          "quick drum fill"
        ],
        "negative_local_styles": [
          "melody",
          "bass",
          "vocals"
        ],
        "duration_ms": 3000,
        "lines": []
      },
      {
        "section_name": "Main Section",
        "positive_local_styles": [
          "full energy",
          "driving synth arpeggio",
          "punchy drum beat",
          "heavy distorted bassline",
          "aggressive rhythm",
          "glitchy vocal chop"
        ],
        "negative_local_styles": [
          "slow tempo",
          "clean sounds",
          "acoustic instruments"
        ],
        "duration_ms": 4000,
        "lines": [
          "Go!",
          "Faster!"
        ]
      },
      {
        "section_name": "Outro",
        "positive_local_styles": [
          "abrupt stop",
          "sound of a short circuit",
          "final explosive hit",
          "echoing reverb tail"
        ],
        "negative_local_styles": [
          "fade out",
          "melodic resolution",
          "vocals"
        ],
        "duration_ms": 3000,
        "lines": []
      }
    ]
  },
  "song_metadata": {
    "title": "Adrenaline Spike",
    "description": "An intense, fast-paced electronic track designed for a high-adrenaline video game scene. Features driving synth arpeggios, punchy drums, distorted bass, and glitch effects to create a feeling of relentless forward motion and excitement.",
    "genres": [
      "electronic",
      "video game music",
      "techno",
      "industrial"
    ],
    "languages": [
      "English"
    ],
    "is_explicit": false
  },
  "words_timestamps": null
}
```

Also keep these placeholders in code (so they can be replaced later):

```ts
/**
 * {{COMPOSITION_PLAN_JSON_SCHEMA}}
 */
export const SAMPLE_PLAN = {{SAMPLE_COMPOSITION_PLAN_JSON}};
```

---

## 5) UX requirements (must implement)

### Stepper & navigation
- Show a **3-step progress indicator** (Step 1, Step 2, Step 3).
- Prevent moving forward unless:
  - Step 1: all 3 required selections are present
  - Step 2: plan JSON is valid JSON before enabling **Create Music**
- Allow Back navigation Step 2 → Step 1.
- After Step 3, allow **Start Over** to reset state.

### Step 2 editing UX
- **Prompt Editor**: editable textarea containing prompt text
- **Plan Editor**: editable JSON textarea containing the composition plan JSON
- Actions:
  - **Generate Plan** (prompt text → plan JSON)
  - **Format JSON** (pretty-print JSON, show inline error if invalid)
  - **Create Music** (plan JSON → audio URL)
- Validation:
  - show a clear inline parse error under the JSON editor
  - disable Create Music if invalid

### Feedback and resilience
- Use **shadcn/ui toast** or **Sonner** for success/error notifications
- Loading states: spinners, disabled buttons
- Simulate realistic latency with `setTimeout` (e.g., 600–1200ms)

---

## 6) Animation requirements (must implement)

Use **both** Motion and GSAP meaningfully and tastefully.

### Motion (`motion`)
- Wrap step content in `AnimatePresence`
- Use a consistent transition (example):
  - enter: `opacity: 0, y: 12`
  - animate: `opacity: 1, y: 0`
  - exit: `opacity: 0, y: -12`
- Add small button micro-interactions (hover/tap) on primary CTAs

### GSAP
Implement at least one “signature flourish”:
- step progress indicator fill animation **OR**
- subtle animated background elements (monochrome shapes) **OR**
- decorative waveform in Step 3

GSAP code must be isolated in a component, using refs (no global DOM querying).

---

## 7) Technical requirements

### Suggested folder structure (minimum)
Implement at least:

```
src/
  app/
    App.tsx
    main.tsx
  components/
    Stepper.tsx
    Step1Selections.tsx
    Step2Editors.tsx
    Step3Player.tsx
    AnimatedBackground.tsx
  lib/
    utils.ts
    mockAudio.ts
  services/
    api.ts
  state/
    wizardStore.ts
  styles/
    globals.css
```

### State management
Use **either**:
- `useReducer + Context`, **or**
- Zustand

Keep the wizard state strongly typed:
- step index
- selections
- prompt text
- plan JSON string + parsed object
- audio result (url, filename, mime type)

### Mock backend services (must be swappable later)
Create `src/services/api.ts` with three functions:

1. `generatePromptFromSelections(selections): Promise<string>`
2. `generateCompositionPlan(promptText): Promise<CompositionPlan>`
3. `createMusicFromPlan(plan): Promise<{ audioUrl: string; filename: string; mimeType: string }>`

Include a `MOCK_MODE` boolean (default `true`).

When `MOCK_MODE === false`, call placeholder endpoints (do not implement backend):
- `POST /prompt`
- `POST /plan`
- `POST /render`

### Mock audio
Create `src/lib/mockAudio.ts` that generates a small playable WAV tone as a `Blob`. Return an object URL from `createMusicFromPlan()` and use it in `<audio controls>`.

### Types
Define:

```ts
export type CompositionPlan = Record<string, unknown>;
```

In state, store both:
- `compositionPlanObject: CompositionPlan | null`
- `compositionPlanText: string`

Edits to `compositionPlanText` must be parseable/validated.

---

## 8) Step-by-step UI spec (must implement)

### App shell
- Full viewport layout
- Centered content container (`max-w-*`)
- Minimal header: app name (e.g., “Composer Studio”), small subtitle
- Keep the overall aesthetic monochrome with a single accent

### Step 1 — Selections
- Render 3 selection cards (one per required field), using shadcn/ui components:
  - `RadioGroup` or `Select` for options
  - Small helper text (the descriptions above)
- Add `instrumental_only` toggle (`Switch`)
- Primary CTA: **Generate Prompt**
  - Calls `generatePromptFromSelections()`
  - Navigates to Step 2 on success

### Step 2 — Editors
Responsive layout:
- Desktop: two columns
- Mobile: stacked

Left panel: **Prompt Editor**
- Title: “Your Prompt”
- Textarea (editable)
- Button: **Generate Plan**

Right panel: **Composition Plan (JSON)**
- Textarea (editable)
- Buttons:
  - **Format JSON**
  - **Create Music** (disabled unless JSON parses)
- Inline JSON error display beneath textarea

### Step 3 — Player
- Success header + small summary (title from plan if available)
- `<audio controls>` wired to returned `audioUrl`
- **Download** button:
  - uses an `<a download>` link to the object URL and filename
- Decorative GSAP waveform or progress flourish
- **Start Over** button clears state and returns to Step 1

---

## 9) Definition of done

Deliver a working repo that:

- Runs locally via `npm install` + `npm run dev`
- Shows the full 3-step flow end-to-end **without a backend**
- Lets the user:
  - select options → generate **editable** prompt text
  - generate **editable** plan JSON (with format + validation)
  - create “music” → gets playable audio + download link
- Uses shadcn/ui components throughout
- Uses Motion and GSAP meaningfully
- Has clear TODO markers for swapping mocks with FastAPI calls

---

## 10) Output format

Output the full codebase and include a `README.md` with:

- Setup instructions
- Where to update Step 1 options and the prompt template placeholder `{{PROMPT_TEMPLATE}}`
- Where to define/replace the plan JSON placeholders
- Where to connect FastAPI endpoints later (the `MOCK_MODE` switch)

Do **not** include backend code.