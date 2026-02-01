# Copilot Instructions for Composer Studio

## Build & Development Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint for all .ts/.tsx files
npm run preview  # Preview production build
```

## Architecture Overview

This is a **front-end only** React wizard (4 steps) for AI music composition. It expects a FastAPI backend at `http://localhost:8000`.

### Wizard Flow

1. **Step 0 (Selections)** → User picks blueprint, sound profile, delivery mode
2. **Step 1 (Narrative)** → User describes their music intent in free-form text
3. **Step 2 (Compose)** → Edit generated prompt and composition plan JSON
4. **Step 3 (Play)** → Listen to and download the rendered audio

### State Management

- **Zustand store** at `src/state/wizardStore.ts` holds all wizard state
- Use `useWizardStore` hook for state access
- Selector helpers: `useSelectionsComplete()`, `usePlanValid()`

### API Layer

`src/services/api.ts` controls backend communication:
- Toggle `MOCK_MODE_*` constants to switch between mock and real endpoints
- Three main endpoints: `POST /prompt`, `POST /plan`, `POST /render`
- WebSocket support for render progress at `ws://localhost:8000/render/ws`

### Component Structure

- **Step components**: `Step0UserNarrative.tsx`, `Step1Selections.tsx`, `Step2Editors.tsx`, `Step3Player.tsx`
- **UI primitives**: `src/components/ui/` (shadcn/ui + Radix)
- **Animations**: Motion for transitions, GSAP for stepper/waveform/background

## Key Conventions

### Imports

Use `@/` path alias for all src imports:
```typescript
import { useWizardStore } from '@/state/wizardStore';
import type { CompositionPlan } from '@/types';
```

### Styling

- Tailwind CSS with shadcn/ui conventions
- `cn()` utility from `@/lib/utils` for conditional classes
- CSS variables in `src/styles/globals.css` define the dark theme
- Primary accent: purple (`hsl(262 83% 58%)`)

### Types

All TypeScript types live in `src/types/index.ts`:
- Selection options: `PROJECT_BLUEPRINT_OPTIONS`, `SOUND_PROFILE_OPTIONS`, `DELIVERY_AND_CONTROL_OPTIONS`
- Composition plan structure: `CompositionPlanData`, `Section`, `SongMetadata`
- Wizard state: `WizardState`, `WizardActions`

### Adding Selection Options

Edit the `ExtendedSelectionOption` arrays in `src/types/index.ts`. Each option needs:
- `value`, `label`, `description` (required)
- `shortDescription`, `details`, `whenToChoose`, `specs` (for full UI support)
