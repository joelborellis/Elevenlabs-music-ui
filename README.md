# Composer Studio

A **front-end-only** React application that implements a **4-step wizard** for AI-powered music composition. Built with Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Motion, and GSAP.

## Features

- **Step 0 — User Narrative**: Describe your music intent, story, and personal context
- **Step 1 — Selections**: Configure project blueprint, sound profile, and delivery preferences
- **Step 2 — Compose**: Edit the generated prompt and composition plan (JSON)
- **Step 3 — Play**: Listen to and download the generated audio

## Quick Start

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── app/
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Stepper.tsx      # Progress indicator with GSAP animation
│   ├── Step0UserNarrative.tsx # User narrative input
│   ├── Step1Selections.tsx  # Selection cards
│   ├── Step2Editors.tsx     # Prompt and JSON editors
│   ├── Step3Player.tsx      # Audio player with GSAP waveform
│   └── AnimatedBackground.tsx # GSAP background animation
├── lib/
│   ├── utils.ts         # Utility functions (cn)
│   └── mockAudio.ts     # WAV generation for mock audio
├── services/
│   └── api.ts           # API service layer (mock/real)
├── state/
│   └── wizardStore.ts   # Zustand state management
├── styles/
│   └── globals.css      # Global styles and CSS variables
└── types/
    └── index.ts         # TypeScript type definitions
```

## Configuration Points

### User Narrative (Step 0)

The user narrative is a free-form text input where users describe their music intent. This narrative is sent to the backend as `user_narrative` in the `/prompt` request payload:

```json
{
  "project_blueprint": "ad_brand_fast_hook",
  "sound_profile": "bright_pop_electro",
  "delivery_and_control": "balanced_studio",
  "instrumental_only": false,
  "user_narrative": "A love song for my wife Sarah..."
}
```

### Step 1 Options

To update the selection options, edit `src/types/index.ts`:

- `PROJECT_BLUEPRINT_OPTIONS` — Project blueprint choices
- `SOUND_PROFILE_OPTIONS` — Sound profile choices  
- `DELIVERY_AND_CONTROL_OPTIONS` — Delivery preferences

### Prompt Template

The prompt template placeholder `{{PROMPT_TEMPLATE}}` is located in `src/services/api.ts` within the `generateMockPrompt()` function. Replace the logic there to customize how the prompt is generated from selections.

### Composition Plan JSON Schema

The plan JSON schema placeholder `{{COMPOSITION_PLAN_JSON_SCHEMA}}` and sample plan `{{SAMPLE_COMPOSITION_PLAN_JSON}}` are in `src/services/api.ts`. Update the `SAMPLE_PLAN` constant to change the mock response structure.

## Connecting to FastAPI Backend

When ready to connect to your FastAPI backend:

1. Open `src/services/api.ts`
2. Set `MOCK_MODE = false`
3. The following endpoints will be called:
   - `POST /prompt` — Generate prompt from selections
   - `POST /plan` — Generate composition plan from prompt
   - `POST /render` — Create music from plan

Each function has TODO comments indicating where to modify for real API integration.

## Tech Stack

- **Vite** — Build tool and dev server
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Radix-based component library
- **Motion** — React animation library (AnimatePresence, motion components)
- **GSAP** — Advanced animations (stepper, waveform, background)
- **Zustand** — State management
- **Lucide React** — Icons

## Design System

The app uses a dark, high-contrast theme:

- **Background**: Near-black (`hsl(0 0% 3.9%)`)
- **Foreground**: Near-white (`hsl(0 0% 98%)`)
- **Primary Accent**: Purple (`hsl(262 83% 58%)`)
- **Cards/Surfaces**: Dark gray (`hsl(0 0% 7%)`)

CSS variables are defined in `src/styles/globals.css`.

## Animation Details

### Motion (motion/react)
- Step transitions with `AnimatePresence`
- Button micro-interactions (hover/tap scale)
- Entry/exit animations: `opacity` + `y` offset

### GSAP
- Stepper progress bar fill animation
- Step indicator scale animation
- Waveform visualization in Step 3
- Floating background shapes

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## License

MIT
