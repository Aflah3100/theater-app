# Awal Cineco Player

Awal Cineco Player is a theater playback control interface built with React, Vite, TypeScript, and Electron. It lets an operator load advertisement, trailer, and two-part feature files from a desktop app, launch playback in VLC, and manage basic auditorium lighting cues from a single screen.

## What the app does

- Loads media for four playback slots: advertisement, trailer, first half, and second half.
- Enforces a simple show-flow where the second half is unlocked only after the first half finishes.
- Launches VLC in fullscreen mode for playback through the Electron desktop shell.
- Shows a theater-style operator dashboard with projection status, auditorium seat view, and lighting controls.
- Provides a close-screen action after the movie finishes.

## Tech stack

- **Frontend:** React 18, TypeScript, Vite
- **Routing and data utilities:** React Router, TanStack Query
- **UI:** Tailwind CSS, Radix UI, shadcn/ui-style components, Lucide icons, Sonner
- **Desktop shell:** Electron
- **Media playback integration:** VLC launched from Electron via child processes
- **Testing:** Vitest and Testing Library

## Project structure

```text
.
├── electron/            # Electron main process and preload bridge
├── public/              # Static assets
├── src/
│   ├── components/      # Theater controls and shared UI components
│   ├── pages/           # Route-level pages
│   ├── test/            # Vitest setup and tests
│   ├── App.tsx          # App providers and routes
│   └── main.tsx         # Frontend entry point
├── package.json
└── vite.config.ts
```

## Key workflows

### Theater playback flow

1. Load the first-half and second-half DCP/video files.
2. Optionally load an advertisement and trailer clip.
3. Start ad or trailer playback independently when needed.
4. Start the first half of the feature.
5. When the first half finishes, the app moves into **Intermission** and enables the second-half action.
6. Start the second half.
7. After playback completes, use the close action to end the session.

### Desktop playback integration

The Electron main process exposes a preload bridge that allows the renderer to:

- open a native file picker for supported video formats,
- ask the desktop shell to launch VLC in fullscreen mode, and
- close the desktop app when the show is over.

The app searches common VLC executable locations for Linux, macOS, and Windows before trying to launch playback.

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm
- VLC Media Player installed and available on your machine

### Install dependencies

```bash
npm install
```

### Run the web app in development

```bash
npm run dev
```

This is useful for UI work, but VLC playback integration requires the Electron desktop shell.

### Run the Electron desktop app in development

```bash
npm run desktop:dev
```

This starts Vite on `127.0.0.1:8080`, waits for the dev server, and then launches Electron.

## Available scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production web build
- `npm run build:dev` - create a development-mode build
- `npm run lint` - run ESLint
- `npm run test` - run the Vitest suite once
- `npm run test:watch` - run Vitest in watch mode
- `npm run preview` - preview the built web app
- `npm run desktop:dev` - run Vite and Electron together for desktop development
- `npm run desktop:build` - build the renderer and package the Electron app

## Packaging notes

The Electron packaging config uses:

- app id: `com.openai.theaterapp`
- product name: `Cinema Hall`
- build resources from `public/`

Production packaging includes the built renderer output, Electron files, and `package.json`.

## Important implementation details

- The app uses `HashRouter`, which makes it suitable for Electron file-based loading.
- Playback is intentionally routed through VLC instead of the browser so projection can remain in a desktop media player.
- If the app is opened outside Electron, the UI stays visible but playback actions warn that the desktop bridge is required.
- Supported file picker formats currently include `mp4`, `mkv`, `avi`, `mov`, `m4v`, `webm`, `mpeg`, and `mpg`.

## Testing

Run:

```bash
npm run test
npm run lint
npm run build
```

## Future improvements

- Add explicit support for DCP-specific ingest or playlist metadata.
- Persist the current show state between restarts.
- Add operational logging for playback and operator actions.
- Add end-to-end Electron tests for the VLC launch flow.
