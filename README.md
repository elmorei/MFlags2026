# MFlags 2026 - Phaser 3 Strategy Prototype

Proof-of-concept 2D browser game setup for desktop + mobile, deployable to GitHub Pages.

## Stack
- Phaser 3 (loaded from CDN at runtime)
- TypeScript
- Vite

## Prototype behavior
- 10x viewport-sized world map.
- Vector green field with randomly distributed tent markers.
- Camera movement: WASD, mouse drag, or touch drag.
- Zoom range: 0.2x to 5x via mouse wheel or pinch.

## Run locally
```bash
npm install
npm run dev
```

## Build for GitHub Pages
```bash
npm run build
```

The Vite `base` path automatically switches to `/MFlags2026/` in GitHub Actions.

## Deployment (branch deployment)
Push to `main` and GitHub Actions builds and publishes the `/dist` output to the `gh-pages` branch.
