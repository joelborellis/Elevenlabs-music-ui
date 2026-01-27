# API Documentation

This document describes all backend API endpoints used by the Elevenlabs Music UI application.

**Base URL:** `http://localhost:8000`

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/prompt` | Generate a prompt from user selections |
| POST | `/plan` | Generate a composition plan from prompt text |
| POST | `/render` | Create music from a composition plan |
| GET | `/render/stream/{filename}` | Stream audio file for playback |
| GET | `/render/download/{filename}` | Download audio file |

---

## POST `/prompt`

Generate a natural language prompt from user selections. This is the first step in the music creation workflow.

### Request

```json
{
  "project_blueprint": "standalone_song_mini",
  "sound_profile": "bright_pop_electro",
  "delivery_and_control": "balanced_studio",
  "instrumental_only": false,
  "user_narrative": "I want an upbeat summer track..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_blueprint` | string | Yes | One of: `ad_brand_fast_hook`, `podcast_voiceover_loop`, `video_game_action_loop`, `meditation_sleep`, `standalone_song_mini` |
| `sound_profile` | string | Yes | One of: `bright_pop_electro`, `dark_trap_night`, `lofi_cozy`, `epic_cinematic`, `indie_live_band` |
| `delivery_and_control` | string | Yes | One of: `exploratory_iterate`, `balanced_studio`, `blueprint_plan_first`, `live_one_take`, `isolation_stems` |
| `instrumental_only` | boolean | Yes | Whether the track should be instrumental only |
| `user_narrative` | string | Yes | Free-form text describing what the user wants |

### Response

```json
{
  "prompt": "Create a 90-second mini-song with full structure featuring uplifting electronic/EDM...",
  "title": "Summer Vibes",
  "description": "An upbeat summer track with bright pop sensibilities",
  "request_id": "abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "input_parameters": {
    "project_blueprint": "standalone_song_mini",
    "sound_profile": "bright_pop_electro",
    "delivery_and_control": "balanced_studio",
    "instrumental_only": false,
    "user_narrative": "I want an upbeat summer track...",
    "title": "Summer Vibes",
    "description": "An upbeat summer track with bright pop sensibilities"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `prompt` | string | Generated prompt text for the composition |
| `title` | string | Suggested title for the music |
| `description` | string | Brief description of the composition |
| `request_id` | string | Unique identifier for this request |
| `timestamp` | string | ISO 8601 timestamp |
| `input_parameters` | object | Echo of the input parameters |

---

## POST `/plan`

Generate a structured composition plan from prompt text. The user can edit the prompt before calling this endpoint.

### Request

```json
{
  "prompt": "Create a 90-second mini-song with full structure featuring uplifting electronic/EDM..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | The prompt text (may be user-edited) |

### Response

```json
{
  "composition_plan": {
    "positive_global_styles": [
      "electronic",
      "uplifting",
      "95 bpm"
    ],
    "negative_global_styles": [
      "heavy reverb",
      "distorted"
    ],
    "sections": [
      {
        "section_name": "Intro",
        "positive_local_styles": ["clean electric guitar riff"],
        "negative_local_styles": ["full band", "vocals"],
        "duration_ms": 4000,
        "lines": [],
        "source_from": null
      },
      {
        "section_name": "Verse 1",
        "positive_local_styles": ["soft vocals", "light percussion"],
        "negative_local_styles": ["heavy bass"],
        "duration_ms": 15000,
        "lines": ["Walking down the sunny street", "Feeling the summer heat"],
        "source_from": null
      }
    ]
  },
  "song_metadata": {
    "title": "Summer Vibes",
    "description": "An upbeat summer track",
    "genres": ["pop", "electronic"],
    "moods": ["happy", "energetic"],
    "tags": ["summer", "upbeat"]
  },
  "words_timestamps": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `composition_plan` | object | The structured composition plan |
| `composition_plan.positive_global_styles` | string[] | Styles to include globally |
| `composition_plan.negative_global_styles` | string[] | Styles to avoid globally |
| `composition_plan.sections` | Section[] | Array of section definitions |
| `song_metadata` | object | Metadata about the song |
| `words_timestamps` | object \| null | Optional timing data |

#### Section Object

| Field | Type | Description |
|-------|------|-------------|
| `section_name` | string | Name of the section (e.g., "Intro", "Verse 1") |
| `positive_local_styles` | string[] | Styles to include in this section |
| `negative_local_styles` | string[] | Styles to avoid in this section |
| `duration_ms` | number | Duration in milliseconds |
| `lines` | string[] | Lyrics/vocal lines for this section |
| `source_from` | string \| null | Optional source reference |

---

## POST `/render`

Create the final audio from a composition plan. This endpoint can take 30-120 seconds depending on complexity.

### Request

```json
{
  "title": "Summer Vibes",
  "positive_global_styles": [
    "electronic",
    "uplifting",
    "95 bpm"
  ],
  "negative_global_styles": [
    "heavy reverb",
    "distorted"
  ],
  "sections": [
    {
      "section_name": "Intro",
      "positive_local_styles": ["clean electric guitar riff"],
      "negative_local_styles": ["full band", "vocals"],
      "duration_ms": 4000,
      "lines": [],
      "source_from": null
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Title for the music (used for filename) |
| `positive_global_styles` | string[] | Yes | Styles to include globally |
| `negative_global_styles` | string[] | No | Styles to avoid globally |
| `sections` | Section[] | Yes | Array of section definitions |

> **Note:** The render endpoint expects a flat structure with `title` at the top level, not nested inside `composition_plan`.

### Response

```json
{
  "filename": "summer-vibes.mp3",
  "file_path": "/path/to/summer-vibes.mp3",
  "download_url": "/render/download/summer-vibes.mp3",
  "content_type": "audio/mpeg",
  "file_size_bytes": 2458624,
  "composition_plan": { ... },
  "song_metadata": { ... },
  "request_id": "xyz789",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `filename` | string | Name of the generated audio file |
| `file_path` | string | Server path to the file |
| `download_url` | string | Relative URL for downloading |
| `content_type` | string | MIME type (typically `audio/mpeg`) |
| `file_size_bytes` | number | Size of the file in bytes |
| `composition_plan` | object \| null | Echo of the composition plan used |
| `song_metadata` | object \| null | Echo of the song metadata |
| `request_id` | string | Unique identifier for this request |
| `timestamp` | string | ISO 8601 timestamp |

---

## GET `/render/stream/{filename}`

Stream an audio file for playback in the browser. Used as the `src` for the `<audio>` element.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filename` | string | The filename returned from `/render` |

### Response

Audio stream with appropriate headers for browser playback.

---

## GET `/render/download/{filename}`

Download an audio file as an attachment.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filename` | string | The filename returned from `/render` |

### Response

Audio file download with `Content-Disposition: attachment` header.

---

## Error Handling

All endpoints return standard HTTP error codes:

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

Error responses include a `detail` field with a human-readable message:

```json
{
  "detail": "Invalid project_blueprint value"
}
```

---

## Mock Mode

The application supports mock mode for development without a backend. Toggle these flags in `src/services/api.ts`:

```typescript
export const MOCK_MODE_PROMPT = false;  // Use real /prompt endpoint
export const MOCK_MODE_PLAN = false;    // Use real /plan endpoint
export const MOCK_MODE_RENDER = false;  // Use real /render endpoint
```

When mock mode is enabled, the app returns simulated responses with artificial latency (600-1200ms).
