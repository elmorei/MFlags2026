# 2D Browser Game Plan (Step 1 Deployment PoC)

## Selected foundation
1. **Engine stack:** Phaser 3 + TypeScript + Vite (Phaser runtime script loaded via CDN in Step 1).
2. **Genre/core loop (prototype):** Strategy sandbox with a large green field and randomly placed tents.
3. **Art direction:** Vector shapes.
4. **Suggested minimum device performance tier:**
   - **Mobile:** Mid-range devices from ~2020 onward (e.g., Snapdragon 730G class or better, iPhone 11 class or better).
   - **Desktop:** 4-core CPU with integrated GPU from ~2018 onward.
   - **Target:** stable 30+ FPS on minimum tier, 60 FPS preferred on mid/high tier.

## Step 1 goal
Validate that the game boots, renders, and deploys correctly on GitHub Pages using a branch-based workflow.

## Implemented PoC features
- Vite + Phaser TypeScript project scaffold (Phaser injected as browser global from CDN).
- 10x viewport world bounds.
- Randomly distributed vector tents on a green field.
- Camera movement:
  - WASD keyboard
  - Mouse drag
  - Touch drag
- Zoom controls:
  - Mouse wheel
  - Pinch (touch)
  - Clamped to 0.2x .. 5x
- GitHub Actions workflow that builds and publishes to `gh-pages` branch.

## Next-step candidates
- Add selectable units and fog-of-war.
- Add biome generation and pathfinding.
- Add mobile-first HUD and command radial menu.
