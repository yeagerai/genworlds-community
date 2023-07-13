import { AiAgent, SpeechMessage, Tilemap } from '@yeager/common-types';
import { sleep } from '@/modules/utils/sleep';
import {
  JasonCalacanis,
  ChamathPalihapitiya,
  DavidFriedberg,
  DavidSacks,
  // collision,
} from '@/assets';

import { GameAiAgent } from '@/modules/game/infra/Sprites/GameAiAgent';
import { WebFontFile } from '@/modules/game/infra/Loaders/WebFontFile';
import { AbstractAgentsScene } from './AbstractAgentsScene';

interface MessageBufferItem {
  message: SpeechMessage;
  name: string;
}

enum MessageSpeeds {
  NORMAL = 50,
  FAST = 50,
  FASTER = 50,
  INSANE = 50,
}

enum TimeWaitingForNextMessage {
  LONG = 2500,
  MEDIUM = 2000,
  LOW = 1500,
  MINIMAL = 1000,
}

export class PokerScene extends AbstractAgentsScene {
  private map!: Phaser.Tilemaps.Tilemap;
  private worldLayers: Phaser.Tilemaps.TilemapLayer[];
  private messageSpeed: number = MessageSpeeds.NORMAL;

  // GameObjects
  private agents: GameAiAgent[];
  // private speakSound!: Phaser.Sound.BaseSound;
  private speakingAgent!: AiAgent;
  private floatingDialog!: Phaser.GameObjects.Rectangle;
  private dialogText!: Phaser.GameObjects.Text;

  spawnPoints: Phaser.Types.Tilemaps.TiledObject[];

  // # Message Buffer ##########################################################

  private messageBuffer: MessageBufferItem[] = [];
  private playingMessage: MessageBufferItem | undefined = undefined;
  private lastPlayedMessage: MessageBufferItem | undefined = undefined;
  private messageBufferEnabled: boolean = false;

  // ###########################################################################

  constructor(tilemap: Tilemap) {
    super(tilemap);

    this.worldLayers = [];
    this.agents = [];
    this.spawnPoints = [];
  }

  // # Preload & Create helper functions #######################################

  private loadTilesets() {
    const { tilesets: mapTilesets } = this.map;
    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    mapTilesets.forEach((ts) => {
      const tileset = this.map.addTilesetImage(
        ts.name,
        ts.name,
        ts.tileWidth,
        ts.tileHeight,
      );

      if (tileset === null) return;

      tilesets.push(tileset);
    });
  }

  private collectSpawnPoints() {
    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    this.spawnPoints =
      this.map.filterObjects('Objects', (obj) =>
        obj.name.toLowerCase().includes('spawnpoint'),
      ) || [];
  }

  private addLayersToMap() {
    const layerNames = this.map.getTileLayerNames();
    const layers: Phaser.Tilemaps.TilemapLayer[] = [];
    const { tilesets } = this.map;

    // Create Layers (getTileLayerNames is returning layers of type tilelayer)
    layerNames.forEach((layerName) => {
      const layer = this.map.getLayer(layerName);

      if (layer && layer.visible) {
        const newLayer = this.map.createLayer(layerName, tilesets);

        if (newLayer) {
          layers.push(newLayer);
        }
      }
    });

    // Create Layers (getTileLayerNames is returning layers of type tilelayer)
    const worldLayers = layers.filter((layer) =>
      layer.layer.name.includes('World'),
    );
    worldLayers.forEach((layer) => {
      if (layer && layer.visible) {
        // TODO: Change collision type
        layer.setCollisionByProperty({ collides: true });
      }
    });
    this.worldLayers = worldLayers;

    const aboveLayers = layers.filter((layer) =>
      layer.layer.name.includes('Above Player'),
    );

    aboveLayers.forEach((layer) => {
      if (layer && layer.visible) {
        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        layer.setDepth(10);
      }
    });
  }

  // # Overrides funcions ######################################################

  preload() {
    const { tilesets } = this.tilemap;

    tilesets.forEach((ts) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const tileset = require(`@/assets/tilesets/${ts.image}`);
      this.load.image(ts.name, tileset);
    });

    // load images, tileMaps and Sprites
    this.load
      .tilemapTiledJSON('tilemap', this.tilemap)
      .spritesheet('JasonCalacanis', JasonCalacanis, {
        frameWidth: 16,
        frameHeight: 48,
        startFrame: 0,
      })
      .spritesheet('ChamathPalihapitiya', ChamathPalihapitiya, {
        frameWidth: 16,
        frameHeight: 48,
        startFrame: 0,
      })
      .spritesheet('DavidFriedberg', DavidFriedberg, {
        frameWidth: 16,
        frameHeight: 48,
        startFrame: 0,
      })
      .spritesheet('DavidSacks', DavidSacks, {
        frameWidth: 16,
        frameHeight: 48,
        startFrame: 0,
      })
      // .audio('ding', ['ding.mp3'])
      .addFile(new WebFontFile(this.load, ['Press Start 2P']));
  }

  create() {
    // create the Tilemap
    this.map = this.make.tilemap({ key: 'tilemap' });

    // create sound
    // this.speakSound = this.sound.add('ding', { loop: false });

    // Load all tilesets
    this.loadTilesets();

    // Create Layers
    this.addLayersToMap();

    // Create Layers
    this.collectSpawnPoints();

    const width = this.map.width * this.map.tileWidth;
    const height = this.map.height * this.map.tileHeight;
    const dialogHeight = height * 0.3;
    const dialogWidth = width * 0.9;

    this.floatingDialog = this.add.rectangle(
      width / 2,
      height - dialogHeight / 1.8,
      dialogWidth,
      dialogHeight,
      0xffffff,
      0.75,
    );

    this.floatingDialog.setDepth(9000).setStrokeStyle(1, 0x000);

    const coordinates = this.floatingDialog.getTopLeft();

    this.dialogText = this.add
      .text(coordinates.x || 0, coordinates.y || 0, '', {
        // font: '18px monospace',
        // fontFamily: '"PKMN RBYGSC"',
        fontFamily: '"Press Start 2P"',
        // fontFamily: '"VCR_OSD_MONO"',
        // resolution: window.devicePixelRatio,
        fontSize: 8,
        color: '#000',
        fixedWidth: dialogWidth,
        fixedHeight: dialogHeight,
        lineSpacing: 5,
        padding: { x: 3, y: 5 },
        wordWrap: { width: dialogWidth },
      })
      .setScrollFactor(0);

    this.dialogText.setDepth(9001);

    this.startMessageBuffer();
  }

  // # Agent Position and Orientation  #########################################

  // eslint-disable-next-line class-methods-use-this
  private getAgentPosition(agentName: string): number {
    let position = -1;

    if (agentName.includes('chamath')) {
      position = 0;
    } else if (agentName.includes('jason')) {
      position = 1;
    } else if (agentName.includes('friedberg')) {
      position = 2;
    } else if (agentName.includes('sacks')) {
      position = 3;
    }

    return position;
  }

  // eslint-disable-next-line class-methods-use-this
  private getAgentLongName(agentName: string): string {
    let longName = '';

    if (agentName.includes('jason')) {
      longName = 'Jason Calacanis';
    } else if (agentName.includes('chamath')) {
      longName = 'Chamath Palihapitiya';
    } else if (agentName.includes('friedberg')) {
      longName = 'David Friedberg';
    } else if (agentName.includes('sacks')) {
      longName = 'David Sacks';
    }

    return longName;
  }

  // eslint-disable-next-line class-methods-use-this
  private getAgentSpriteName(agentName: string): string {
    let spriteName = '';

    if (agentName.includes('jason')) {
      spriteName = 'JasonCalacanis';
    } else if (agentName.includes('chamath')) {
      spriteName = 'ChamathPalihapitiya';
    } else if (agentName.includes('friedberg')) {
      spriteName = 'DavidFriedberg';
    } else if (agentName.includes('sacks')) {
      spriteName = 'DavidSacks';
    }

    return spriteName;
  }

  // eslint-disable-next-line class-methods-use-this
  private getAgentSittingAnimation(agentName: string): string {
    let sittingAnimation = 'sitting_down';

    const position = this.getAgentPosition(agentName);

    if (position === 0) {
      sittingAnimation = 'sitting_right';
    } else if (position === 3) {
      sittingAnimation = 'sitting_left';
    } else {
      sittingAnimation = 'sitting_down';
    }

    return sittingAnimation;
  }

  // eslint-disable-next-line class-methods-use-this
  private getAgentSpeakingAnimation(agentName: string): string {
    let speakingAnimation = 'speaking';

    const position = this.getAgentPosition(agentName);

    if (position === 0) {
      speakingAnimation = 'speaking_right';
    } else if (position === 3) {
      speakingAnimation = 'speaking_left';
    } else {
      speakingAnimation = 'speaking';
    }

    return speakingAnimation;
  }

  // # Message Buffer ##########################################################

  private setPlayingMessage(
    item: MessageBufferItem | undefined,
    keepMessageVisible: boolean = false,
  ) {
    this.lastPlayedMessage = this.playingMessage;
    this.playingMessage = item;

    if (keepMessageVisible || item !== undefined) {
      this.floatingDialog.setVisible(true);
      this.dialogText.setVisible(true);
    } else {
      this.floatingDialog.setVisible(false);
      this.dialogText.setVisible(false);
    }
  }

  private addMessageToBuffer(item: MessageBufferItem) {
    const findIndex = this.messageBuffer.findIndex(
      (m) => m.name === item.name && m.message.text === item.message.text,
    );

    const isSameAsPlaying =
      this.playingMessage &&
      this.playingMessage.name === item.name &&
      this.playingMessage.message.text === item.message.text;

    const isLastMessage =
      this.lastPlayedMessage &&
      this.lastPlayedMessage.name === item.name &&
      this.lastPlayedMessage.message.text === item.message.text;

    if (this.playingMessage === undefined) {
      this.messageBuffer.push(item);
    } else if (
      // message not found
      findIndex === -1 &&
      // message is not the current playing message
      !isSameAsPlaying &&
      // message is not the last playing message
      !isLastMessage
    ) {
      this.messageBuffer.push(item);
    }

    this.playMessageBuffer();
  }

  private startMessageBuffer() {
    this.messageBufferEnabled = true;
    this.setPlayingMessage(undefined);
    this.playMessageBuffer();
  }

  private stopMessageBuffer() {
    this.messageBufferEnabled = false;
    this.setPlayingMessage(undefined);
  }

  private playMessageBuffer() {
    if (this.playingMessage !== undefined || !this.messageBufferEnabled) return;

    this.playNextMessage();
  }

  private async playNextMessage() {
    const item: MessageBufferItem | undefined = this.messageBuffer[0];

    if (item === undefined) return;

    await this.playMessage(item);

    if (this.messageBuffer.length >= 5) {
      await sleep(TimeWaitingForNextMessage.MINIMAL);
    } else if (this.messageBuffer.length >= 3) {
      await sleep(TimeWaitingForNextMessage.LOW);
    } else if (this.messageBuffer.length >= 2) {
      await sleep(TimeWaitingForNextMessage.MEDIUM);
    } else {
      await sleep(TimeWaitingForNextMessage.LONG);
    }

    this.messageBuffer.shift();
    this.setPlayingMessage(undefined, this.messageBuffer.length === 0);
    this.playMessageBuffer();
  }

  private async playMessage(item: MessageBufferItem, stopPlayingOnEnd?: false) {
    if (!this.messageBufferEnabled) return;

    const aiAgent = this.agents.find((aiA) => aiA.id === item.name);

    if (aiAgent === undefined) return;

    this.setPlayingMessage(item);

    this.agents.forEach((aiA) => {
      aiA.anims.stop();
      const sittingAnimation = this.getAgentSittingAnimation(aiA.id);
      aiA.anims.play(sittingAnimation);
    });

    const speakingAnimation = this.getAgentSpeakingAnimation(aiAgent.id);
    aiAgent.anims.play(speakingAnimation);

    await this.showMessage(aiAgent.name, item.message.text);

    if (stopPlayingOnEnd) this.setPlayingMessage(undefined);
  }

  private async showMessage(name: string, text: string) {
    const nameLine = `${name.toUpperCase()}:\n`;
    let baseText = '';
    const textArray = text.split('');

    for (let i = 0; i < textArray.length; i += 1) {
      if (this.messageBuffer.length >= 5) {
        this.messageSpeed = MessageSpeeds.INSANE;
      } else if (this.messageBuffer.length >= 3) {
        this.messageSpeed = MessageSpeeds.FASTER;
      } else {
        this.messageSpeed = MessageSpeeds.NORMAL;
      }

      if (baseText.length >= 135) {
        // const lines = this.dialogText.getWrappedText();
        const lines = this.dialogText.getWrappedText();
        const keepLines = lines.slice(2);
        const words = keepLines
          .join('')
          .replaceAll('  ', ' ')
          .split(' ')
          .join(' ');
        baseText = words;
        // baseText = lines.slice(2).join(' ');
      }

      baseText += textArray[i];
      this.dialogText.setText(nameLine + baseText);
      // this.speakSound.play();
      // eslint-disable-next-line no-await-in-loop
      await sleep(this.messageSpeed);
    }
  }

  // ###########################################################################

  updateAgents(agents: AiAgent[]) {
    // For each agent on the Scene remove if they left
    this.agents.forEach((p) => {
      const pIndex = agents.findIndex((ag) => ag.name === p.id);

      if (pIndex === -1) {
        p.removeAgent();
      }
    });

    // for each new agent, create it
    const newAgents = agents.filter((ag) => {
      const found = this.agents.find((p) => p.id === ag.name);

      return !found;
    });

    this.addAgents(newAgents);

    // sort (new message last)
    const speakingAgents = agents.sort(
      (aiA1, aiA2) =>
        aiA1.bubble.message.timestamp - aiA2.bubble.message.timestamp,
    );
    const speakingAgent = speakingAgents.pop();

    if (speakingAgent) {
      this.addMessageToBuffer({
        name: speakingAgent.name,
        message: speakingAgent.bubble.message,
      });
    }
  }

  private addAgents(aiAs: AiAgent[]) {
    aiAs.forEach((aiA) => {
      const agentPosition = this.getAgentPosition(aiA.name);

      if (agentPosition === -1) return;

      const spriteName = this.getAgentSpriteName(aiA.name);
      const spawnPoint =
        this.spawnPoints[agentPosition % this.spawnPoints.length];

      const ag = new GameAiAgent(
        aiA.name,
        this.getAgentLongName(aiA.name),
        this,
        spawnPoint.x ? spawnPoint.x : 0,
        spawnPoint.y ? spawnPoint.y - GameAiAgent.HEIGHT : 0,
        spriteName,
        // agentPosition === 0 ? 9 : undefined,
      );

      // Watch the agent and worldLayers for collisions, for the duration of the scene:
      // this.physics.add.collider(ag, this.worldLayers);
      this.agents.push(ag);
    });
  }
}
