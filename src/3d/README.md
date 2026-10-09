# Northgate 3D Prototype

This is the first browser-based 3D scene for **Are You Lying?** It uses Three.js and procedural geometry/materials so the scene is real 3D and does not depend on a collection of empty placeholder files.

## Run

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:5173/northgate-3d.html`.

## Current assets

The scene builds a walkable security booth with walls, a secure door, desk, monitor, keyboard, emergency phone, ID card, magnifying glass, lamp, cabinet, chair, plant, security camera, warning beacon and a low-poly visitor character. These are editable Three.js meshes and materials created in code.

## Controls

- Click **Enter Night Shift** to begin.
- Click the scene to lock the mouse; WASD to move and mouse to look.
- Click the phone to call 998, the ID to inspect it, or the monitor to read the terminal.
- Use A to allow, D to deny, F to call 998 and I to toggle the magnifier.
- Press Escape to release the mouse.

## Limitations

This is a playable visual prototype, not the complete final game. Character geometry is low-poly and generated procedurally; final rigged characters, authored texture maps, polished animations and a full night-driving level remain future asset work.