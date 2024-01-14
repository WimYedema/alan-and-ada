import * as ex from "excalibur";
import { Baddie } from "../actors/baddie";
import { Floor, Ground, Wall } from "../actors/ground";
import { Gate } from "../actors/gate";
import { LevelLayout } from "../core/levelLayout";
import { iSceneNode } from "../core/cutScene";
import { Potion } from "../actors/potion";
import { Lift } from "../actors/lift";

/**
 * This is an example of how you can make a small but fun level, with things
 * like floors, walls, monsters, potions, and moving platforms.
 */
export class Example extends LevelLayout implements iSceneNode {
  thisScene = "example";
  nextScene = "finish";
  levelSize = new ex.Vector(22, 22);

  layoutLevel(engine: ex.Engine) {
    engine.add(new Floor({ x: 0, y: 3, right: 17 }));

    engine.add(new Floor({ x: 1, y: 5, right: 3 }));
    engine.add(new Floor({ x: 2, y: 7, right: 2 }));
    engine.add(new Floor({ x: 2, y: 9, right: 2 }));
    engine.add(new Floor({ x: 3, y: 11, right: 1 }));
    engine.add(new Floor({ x: 3, y: 13, right: 1 }));
    engine.add(new Floor({ x: 3, y: 15, right: 1 }));
    engine.add(new Potion({ x: 3, y: 15, potionColor: "yellow" }));

    engine.add(new Ground({ x: 4, y: 19, down: 15.5, right: 1, scale: 0.5 }));

    engine.add(new Floor({ x: 5, y: 9, right: 2 }));
    engine.add(new Floor({ x: 5, y: 6, right: 1 }));
    engine.add(new Potion({ x: 5, y: 6, potionColor: "purple" }));
    engine.add(
      new Lift({ startPos: { x: 5, y: 16 }, endPos: { x: 16, y: 22 - 6 } }),
    );

    this.playerStartsAt({ x: 6, y: 10 });
    engine.add(new Baddie({ x: 6, y: 7 }));
    engine.add(new Baddie({ x: 10, y: 7 }));
    engine.add(new Floor({ x: 13, y: 11, right: 4 }));
    engine.add(new Gate({ x: 14, y: 11, goal: 2 }));
    engine.add(new Floor({ x: 16, y: 6, right: 1 }));
    engine.add(new Wall({ x: 17, y: 3, up: 20 }));
  }
}
