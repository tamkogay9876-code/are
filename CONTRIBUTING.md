# Contributing

## Development setup

1. Install Node.js 20 or newer.
2. Clone the repository.
3. Run `npm install`.
4. Run `npm run dev` to start Vite.
5. Run `npm test` and `npm run build` before opening a pull request.

## Guidelines

- Keep gameplay rules separate from DOM rendering.
- Prefer small typed functions and deterministic tests for random mechanics.
- Do not add runtime dependencies without documenting the reason.
- Keep resident data fictional.
- Describe the player-visible effect in each pull request.

## Pull requests

Include a summary, test results, and any controls or balance changes. Screenshots are helpful for visual updates.