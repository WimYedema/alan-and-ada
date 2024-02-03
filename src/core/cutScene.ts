import * as ex from "excalibur";
import { stats } from "./stats";
import { TextBubble } from "./textBubble";
import { playerCharacters } from "./resources";
import { SceneActor } from "./actor";
import { iLocation } from "./location";
import { sceneStack } from "./sceneStack";

/**
 * A SceneNode provides the links between scenes.
 */
export interface iSceneNode {
  /**
   * The (unique) name of this scene.
   */
  thisScene: string;
}

export class Speaker extends SceneActor<null> {
  _state = null;
  constructor(args: iLocation) {
    super({ x: args.x, y: args.y, anchor: ex.vec(0.5, 1) });
  }
  initializeActor() {
    const idle = ex.Animation.fromSpriteSheet(
      playerCharacters[stats.charName].idle,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      80,
    );
    idle.scale = new ex.Vector(1, 1);
    this.graphics.use(idle);
  }
  onActivate(): void {
    this.reinitialize(this.scene.engine);
    super.onActivate();
  }
}

export abstract class CutScene extends ex.Scene {
  abstract text: string[];

  onInitialize(engine: ex.Engine) {
    const actor = new Speaker({ x: 250, y: 500 });
    engine.add(actor);
    const bubble = new TextBubble(
      {
        x: 10,
        y: engine.drawHeight - 80,
        right: engine.drawWidth - 20,
        down: 80,
      },
      this.text,
    );
    bubble.on(`sequence-${bubble.id}`, () => {
      sceneStack.pop(this.engine);
    });
    engine.add(bubble);
  }
}
