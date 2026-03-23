# Awal Cineco Player

Awal Cineco Player is a theater playback control application built for cinema-style screening operations. It provides a simple operator-facing interface for managing DCP halves, advertisement playback, trailer playback, theater lighting, exit lights, and screen status from a single dashboard.

This project is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- Electron for desktop playback integration
- VLC integration through the Electron bridge

## Version 1 Release Scope

Version 1 includes the core controls needed for a basic movie-show workflow:

- First-half and second-half DCP loading
- Intermission-aware second-half unlock flow
- Separate advertisement upload and playback
- Separate trailer upload and playback
- Theater lights controls:
  - Lights On
  - Lights Dim
  - Lights Off
- Exit lights controls:
  - Exit Lights On
  - Exit Lights Off
- Theater seat visual preview with ambient top lighting and exit-light indicators
- Theater screen status panel for idle, playback, intermission, and end-of-show states

## Main Features

### 1. DCP Injector

The DCP Injector allows operators to load:

- First half of the movie
- Second half of the movie

The second half remains locked until the first half is completed and the application moves into intermission mode.

### 2. Advertisement Injector

The Advertisement section includes a separate upload area for:

- Advertisement injection
- Trailer upload

Each one can be selected independently, and both have their own playback action so pre-show content can be managed separately.

### 3. Theater Screen View

The screen panel provides the current screen status and playback phase, including:

- Screen ready
- Advertisement playback
- Trailer playback
- First-half playback
- Intermission
- Second-half playback
- End-of-show / close screen state

### 4. Theater Seat View

The seat preview gives a simple visual representation of the auditorium:

- Seating rows
- Left and right exit-light indicators
- Top ambient theater lights

The ambient lights react to the selected theater light mode:

- **Lights On**: bright yellow glow
- **Lights Dim**: softer yellow glow
- **Lights Off**: no ambient glow

The exit lights react to the exit-light toggle and light up red when enabled.

### 5. Lighting Controls

Operators can control two kinds of lighting from the same section:

#### Theater Lights

- Lights On
- Lights Dim
- Lights Off

#### Exit Lights

- Exit Lights On
- Exit Lights Off

## Playback Workflow

Recommended operational flow for a movie show:

1. Upload the **Advertisement** if required.
2. Upload the **Trailer** if required.
3. Upload the **First Half** DCP.
4. Upload the **Second Half** DCP.
5. Play the advertisement and/or trailer as needed.
6. Start the **First Half**.
7. When the first half is complete, the app enters **Intermission**.
8. Turn on theater lights if needed during intermission.
9. Start the **Second Half**.
10. After the movie finishes, close the application for the next show.

## Desktop Requirement

For real playback, this app is intended to run through the Electron desktop shell.

The VLC playback workflow depends on the Electron bridge:

- file selection support
- VLC launch support
- app close action

If the app is run only in a browser, the interface will still render, but playback actions that rely on the Electron bridge will not complete as intended.

## Project Scripts

Available scripts from `package.json`:

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run test
npm run test:watch
npm run lint
npm run desktop:dev
npm run desktop:build
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the web app in development mode:

```bash
npm run dev
```

Run the Electron desktop version in development mode:

```bash
npm run desktop:dev
```

Build the production web bundle:

```bash
npm run build
```

Build the Electron desktop application:

```bash
npm run desktop:build
```

## Testing

Run the automated test suite:

```bash
npm test
```

## Intended Users

This application is designed for:

- theater projection operators
- cinema technicians
- screening room staff
- internal playback/control operators

## Notes for Future Versions

Possible future enhancements may include:

- playlist automation
- show scheduling
- better playback logs
- auditorium presets
- multi-screen management
- richer intermission controls
- trailer/advertisement queue support

## Release Status

This README documents the **Version 1 release** of Awal Cineco Player.
