declare const Phaser: any;

const TENTS_PER_VIEWPORT = 12;
const CAMERA_SPEED = 800;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 5;

type WasdKeys = {
  up: any;
  down: any;
  left: any;
  right: any;
};

export class GameScene extends Phaser.Scene {
  private worldWidth = 0;
  private worldHeight = 0;
  private dragActive = false;
  private previousDragX = 0;
  private previousDragY = 0;
  private previousPinchDistance: number | null = null;
  private wasd!: WasdKeys;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const viewportWidth = this.scale.width;
    const viewportHeight = this.scale.height;

    this.worldWidth = viewportWidth * 10;
    this.worldHeight = viewportHeight * 10;

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.centerOn(this.worldWidth / 2, this.worldHeight / 2);
    this.cameras.main.setZoom(1);

    this.drawField();
    this.scatterTents(Math.floor((this.worldWidth * this.worldHeight) / (viewportWidth * viewportHeight) * TENTS_PER_VIEWPORT));
    this.addHud();
    this.setupKeyboardControls();
    this.setupPointerControls();
    this.setupWheelZoom();
  }

  update(_: number, delta: number): void {
    const camera = this.cameras.main;
    const dt = delta / 1000;
    const speed = (CAMERA_SPEED * dt) / camera.zoom;

    if (this.wasd.left.isDown) camera.scrollX -= speed;
    if (this.wasd.right.isDown) camera.scrollX += speed;
    if (this.wasd.up.isDown) camera.scrollY -= speed;
    if (this.wasd.down.isDown) camera.scrollY += speed;

    this.handlePinchZoom();
    this.clampCamera();
  }

  private drawField(): void {
    this.add.rectangle(this.worldWidth / 2, this.worldHeight / 2, this.worldWidth, this.worldHeight, 0x4ea863);

    const grid = this.add.graphics();
    grid.lineStyle(1, 0x3d8c52, 0.5);

    const step = 180;
    for (let x = 0; x <= this.worldWidth; x += step) grid.lineBetween(x, 0, x, this.worldHeight);
    for (let y = 0; y <= this.worldHeight; y += step) grid.lineBetween(0, y, this.worldWidth, y);
  }

  private scatterTents(count: number): void {
    for (let i = 0; i < count; i += 1) {
      const x = Phaser.Math.Between(80, this.worldWidth - 80);
      const y = Phaser.Math.Between(80, this.worldHeight - 80);
      this.drawTent(x, y, Phaser.Math.FloatBetween(0.7, 1.25));
    }
  }

  private drawTent(x: number, y: number, scale: number): void {
    const tent = this.add.container(x, y);

    const body = this.add.polygon(0, -8 * scale, [0, -46 * scale, -34 * scale, 16 * scale, 34 * scale, 16 * scale], 0xe4c998, 1);
    const flap = this.add.polygon(0, -1 * scale, [0, -36 * scale, -12 * scale, 16 * scale, 12 * scale, 16 * scale], 0xc58f5f, 1);
    const shadow = this.add.ellipse(0, 25 * scale, 78 * scale, 18 * scale, 0x2e6b3a, 0.35);

    tent.add([shadow, body, flap]);
    tent.setRotation(Phaser.Math.FloatBetween(-0.12, 0.12));
  }

  private addHud(): void {
    const help = ['WASD / mouse drag / touch drag to move', 'Wheel or pinch to zoom (0.2x to 5x)'].join('\n');

    const label = this.add.text(16, 16, help, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 8 },
    });

    label.setScrollFactor(0);
    label.setDepth(100);
  }

  private setupKeyboardControls(): void {
    if (!this.input.keyboard) throw new Error('Keyboard input is unavailable.');

    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as WasdKeys;
  }

  private setupPointerControls(): void {
    this.input.addPointer(3);

    this.input.on('pointerdown', (pointer: any) => {
      this.dragActive = true;
      this.previousDragX = pointer.x;
      this.previousDragY = pointer.y;
    });

    this.input.on('pointermove', (pointer: any) => {
      if (!this.dragActive || !pointer.isDown) return;
      const camera = this.cameras.main;
      const dx = pointer.x - this.previousDragX;
      const dy = pointer.y - this.previousDragY;
      camera.scrollX -= dx / camera.zoom;
      camera.scrollY -= dy / camera.zoom;
      this.previousDragX = pointer.x;
      this.previousDragY = pointer.y;
      this.clampCamera();
    });

    this.input.on('pointerup', () => {
      this.dragActive = false;
      this.previousPinchDistance = null;
    });
  }

  private setupWheelZoom(): void {
    this.input.on('wheel', (_pointer: any, _gameObjects: any[], _deltaX: number, deltaY: number) => {
      this.adjustZoom(deltaY > 0 ? -0.1 : 0.1);
    });
  }

  private handlePinchZoom(): void {
    const activeTouches = this.input.manager.pointers.filter((pointer: any) => pointer.isDown && pointer.wasTouch);
    if (activeTouches.length < 2) {
      this.previousPinchDistance = null;
      return;
    }

    const [p1, p2] = activeTouches;
    const distance = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);

    if (this.previousPinchDistance !== null) {
      const delta = (distance - this.previousPinchDistance) * 0.004;
      this.adjustZoom(delta);
    }

    this.previousPinchDistance = distance;
  }

  private adjustZoom(delta: number): void {
    const camera = this.cameras.main;
    camera.zoom = Phaser.Math.Clamp(camera.zoom + delta, MIN_ZOOM, MAX_ZOOM);
    this.clampCamera();
  }

  private clampCamera(): void {
    const camera = this.cameras.main;
    const maxX = this.worldWidth - camera.width / camera.zoom;
    const maxY = this.worldHeight - camera.height / camera.zoom;
    camera.scrollX = Phaser.Math.Clamp(camera.scrollX, 0, Math.max(0, maxX));
    camera.scrollY = Phaser.Math.Clamp(camera.scrollY, 0, Math.max(0, maxY));
  }
}
