# ARE YOU LYING? — v0.1

A browser-playable prototype for a paranormal identity-checking and night-investigation game.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually http://localhost:5173.

## Checks

```bash
npm test
npm run build
```

GitHub Actions runs the tests and production build after pushes and pull requests.

## Features in this prototype

- Day shift: verify resident IDs, rooms, relatives, neighbors, and phrases.
- Randomized identity anomalies, questioning, and evidence logging.
- Allow / deny / 998 F.A.F.E. dispatch.
- Right-mouse ID magnifier.
- Night drive with fuel, tire damage, road events, and a one-shell defense.
- Class-X interrogation, multiple endings, and localStorage saves.
- CRT-inspired responsive interface, SVG assets, and Web Audio effects.

## Project structure

```text
src/
  assets/       Vector emblems and the CRT overlay
  audio/        Web Audio sound presets
  core/         Shared constants and game rules
  data/         Resident records, anomalies, night events
  game/         Scoring, evidence, identity checks, drive and endings
  storage/      Guarded localStorage adapter
  ui/           Shared application shell
  utils/        Formatting, DOM and random helpers
  data.ts       Public data entrypoint
  game.ts       State and gameplay orchestration
  main.ts       Screen rendering and event handlers
  style.css     Interface styles
tests/          Unit tests for data, formatting, rules and scoring
docs/           Design, architecture, controls, narrative, QA and roadmap
```

This repository contains over 50 purposeful source, test, asset, configuration, and documentation files. The main UI is still a prototype and can be split further as the game grows.

## Tech stack

TypeScript, Vite, Vitest, HTML/CSS, Web Audio, and localStorage. No backend or account system is required.
