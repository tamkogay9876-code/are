# ARE YOU LYING? — v0.1

A browser-playable prototype for a paranormal identity-checking and night-investigation game.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

## Gameplay in this prototype

- Day shift: verify resident IDs, room numbers, relatives, neighbors, phrases, and microcodes.
- Randomly generated identity anomalies with evidence logging.
- Allow, deny, or call 998 to dispatch F.A.F.E.
- Hold the right mouse button over the ID to magnify it.
- Night drive with fuel, tire condition, random road events, and a one-shell shotgun defense.
- Class-X interrogation and multiple possible endings.
- Local save data via localStorage.
- CRT/pixel-inspired UI and simple Web Audio sound effects.

## Tech stack

TypeScript + Vite + HTML/CSS. The current prototype deliberately avoids a heavy game engine so it can be extended easily.
