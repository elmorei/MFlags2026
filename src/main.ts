import { GameScene } from './scenes/GameScene';
import './styles.css';

declare const Phaser: any;

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#214f2c',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
};

void new Phaser.Game(config);
