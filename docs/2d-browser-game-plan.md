# 2D Browser Game on GitHub Pages: Options, Plan, and Folder Structure

## Goals and constraints
- Deploy as static files on GitHub Pages (no required backend).
- Support both PC and mobile users from the start.
- Keep first release simple, with room to grow.

## Best implementation options

### Option A (recommended): Phaser 3 + TypeScript + Vite
**Why this is the best default**
- Mature 2D-focused engine with strong docs and many examples.
- Great fit for sprite-based, arcade-style, and tilemap games.
- Easy to host as static assets on GitHub Pages.
- TypeScript + Vite provides fast iteration and clean project structure.

**Tradeoffs**
- Less ideal if you later need heavy 3D features.
- You still need to design your own architecture conventions.

### Option B: Godot 4 Web export (engine-first workflow)
**Why choose it**
- Excellent editor workflow for scenes, animation, and content authoring.
- Good option if your team prefers visual tooling over coding-first setup.

**Tradeoffs**
- Web export bundle size can be larger.
- GitHub Pages support is possible, but the deployment workflow differs from JS-native stacks.

### Option C: PixiJS + custom game loop (max flexibility)
**Why choose it**
- Very lightweight rendering-focused stack.
- Good for teams that want full control over architecture.

**Tradeoffs**
- You must implement many gameplay systems yourself (scene lifecycle, collisions, etc.).

## Recommendation summary
Start with **Phaser 3 + TypeScript + Vite** for fastest path to a polished, cross-device 2D web game on GitHub Pages.

## Delivery plan (no code yet)

### Phase 0: Product definition (1–2 days)
- Define core loop (example: move, avoid, collect, survive).
- Set hard scope for v1 (single game mode, one map/theme, basic progression).
- Define supported device matrix:
  - Desktop: latest Chrome/Edge/Firefox/Safari.
  - Mobile: recent iOS Safari and Android Chrome.

### Phase 1: Technical foundation (1–2 days)
- Project setup with Phaser + TS + Vite.
- CI build workflow for static deploy to GitHub Pages.
- Runtime settings baseline:
  - Responsive canvas scaling.
  - Safe-area handling for notched phones.
  - Asset loading pipeline and cache strategy.

### Phase 2: Input and UX parity (2–3 days)
- Desktop controls: keyboard + optional mouse.
- Mobile controls: on-screen touch controls and gestures.
- Unified input abstraction layer so gameplay code is device-agnostic.
- Pause/resume behavior and focus handling (tab switching, phone backgrounding).

### Phase 3: Gameplay vertical slice (3–5 days)
- One playable scene with complete loop.
- Camera behavior, collisions, win/lose states.
- HUD and minimal menu flow (start, retry, settings).

### Phase 4: Performance and compatibility hardening (2–4 days)
- FPS and frame-time profiling on low/mid mobile devices.
- Texture atlas optimization and sprite compression.
- Audio policy handling for mobile autoplay restrictions.
- Lighthouse/mobile-friendly sanity checks.

### Phase 5: Launch prep (1–2 days)
- Add social preview image and README docs.
- Add analytics (privacy-conscious) and error reporting.
- Final regression pass across target browsers.

## Suggested folder structure

```text
/
├─ public/
│  ├─ assets/
│  │  ├─ images/
│  │  ├─ audio/
│  │  ├─ fonts/
│  │  └─ tilemaps/
│  └─ icons/
├─ src/
│  ├─ core/
│  │  ├─ config/          # game config, scaling, constants
│  │  ├─ engine/          # scene manager wrappers, bootstrap
│  │  └─ utils/
│  ├─ input/
│  │  ├─ desktop/         # keyboard/mouse adapters
│  │  ├─ mobile/          # touch controls/gestures
│  │  └─ InputController.ts
│  ├─ scenes/
│  │  ├─ BootScene.ts
│  │  ├─ MenuScene.ts
│  │  ├─ GameScene.ts
│  │  └─ UIScene.ts
│  ├─ entities/
│  │  ├─ player/
│  │  ├─ enemies/
│  │  └─ pickups/
│  ├─ systems/
│  │  ├─ physics/
│  │  ├─ combat/
│  │  ├─ progression/
│  │  └─ audio/
│  ├─ ui/
│  │  ├─ components/
│  │  └─ hud/
│  ├─ data/
│  │  ├─ balance/
│  │  └─ localization/
│  ├─ styles/
│  └─ main.ts
├─ tests/
│  ├─ unit/
│  └─ integration/
├─ scripts/
│  ├─ optimize-assets/
│  └─ build-metadata/
├─ .github/
│  └─ workflows/
│     ├─ ci.yml
│     └─ deploy-pages.yml
├─ docs/
│  ├─ game-design/
│  ├─ technical/
│  └─ 2d-browser-game-plan.md
├─ index.html
├─ package.json
├─ vite.config.ts
└─ README.md
```

## Architecture notes for PC + mobile
- Use a fixed internal game resolution with scale-to-fit strategy.
- Keep UI touch targets large enough for mobile thumbs.
- Prefer deterministic update loops and avoid logic tied to variable frame rates.
- Separate simulation from rendering where practical.
- Build all player actions through a unified command/input API.

## GitHub Pages deployment notes
- Use GitHub Actions to build and deploy to `gh-pages` or Pages artifact workflow.
- Repository workflow file: `.github/workflows/deploy-pages.yml` (manual run via `workflow_dispatch` or push to `main`).
- Ensure asset paths work for repository subpath hosting.
- Add cache-busting via hashed bundles.

## What to decide next
1. Pick engine stack (recommended: Phaser).
2. Choose game genre/core loop.
3. Decide art direction (pixel art vs vector vs hand-drawn).
4. Set target minimum device performance tier.
