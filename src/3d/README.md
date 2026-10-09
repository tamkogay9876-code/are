# ARE YOU LYING? — Northgate 2.5D prototype

A browser-playable, fixed-camera 2.5D horror-investigation prototype. The room and desk props are built from real Three.js geometry; visitors are original pixel-art billboard sprites placed inside the 3D scene. The scene renders at reduced internal resolution and is enlarged with nearest-neighbour sampling for a chunky pixel look.

## Run locally
```bash
npm install
npm run dev
```
Open the Vite URL, usually http://localhost:5173/. The default page opens the 2.5D scene. You can also open `/northgate-3d.html`.

## Controls
- Start the shift from the title panel.
- **Allow**, **Deny**, or **Call 998 / F.A.F.E.** processes a visitor.
- Click **Inspect ID** or press `I` to toggle the magnifier.
- Press `A` to allow, `D` to deny, and `F` to call 998 or use an emergency flare at night.
- The camera remains fixed, with point-and-click inspection rather than first-person walking.

## Current 2.5D assets
- Low-poly 3D security booth, framed visitor window, desk, monitor, keyboard, telephone, files, ID card, magnifier, desk lamp, calendar, plant and warning button.
- Original low-resolution pixel portraits generated on a small canvas and used as billboard sprites in the 3D window.
- A limited mauve/gray/brown palette, flat-shaded geometry, dark ink-like edges, chunky low-resolution rendering and a fixed camera.
- Resident verification, randomized record discrepancies, evidence log, trust meter, 998 dispatch and a basic night-investigation continuation.

## Project layout
- `src/3d/main.ts`: scene, camera, clickable props, UI actions and game flow.
- `src/3d/pixel-character.ts`: original pixel portrait texture and sprite builder.
- `src/3d/style.css`: pixel-art HUD and responsive layout.
- `src/data/residents.ts`: canonical fictional resident records.

## Verification
```bash
npm test
npm run build
```
GitHub Actions runs unit tests and a production build after pushes. Build/test success should be confirmed by the workflow before treating the prototype as stable.

## Art status
This is an early procedural art pass. Props are real 3D meshes, while visitor artwork is pixel-art sprite texture. Polished third-party models, animated character rigs, authored texture maps and a complete night-driving level remain future asset work.
