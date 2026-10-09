# Architecture

## Runtime

The prototype is a Vite single-page application written in TypeScript. It renders its interface with standard DOM APIs and CSS; it does not require a heavy game engine.

## Folders

- `src/data/`: resident records, anomaly definitions, and night events.
- `src/core/`: rules and shared constants.
- `src/game/`: game-state types and pure mechanics such as scoring, identity checks, evidence, drive simulation, and endings.
- `src/audio/`: short Web Audio effects.
- `src/storage/`: guarded localStorage access.
- `src/utils/`: formatting, DOM, and random helpers.
- `src/assets/`: small vector UI assets.
- `tests/`: deterministic tests of the rules.

## State flow

The game state lives in `src/game.ts`. The entrypoint in `src/main.ts` renders the screen that matches the current phase. Actions update state, append evidence, save locally, and trigger a render.

## Persistence

Only game progress and fictional game evidence are stored in localStorage. There is no server-side persistence in this prototype.