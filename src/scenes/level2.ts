import * as ex from "excalibur";
import { LevelLayout } from "../core/levelLayout";
import { Floor, Wall } from "../actors/ground";
import { Gate } from "../actors/gate";
import { iSceneNode } from "../core/cutScene";

export class Level2 extends LevelLayout implements iSceneNode {
  thisScene = "level2";

  layoutLevel(engine: ex.Engine) {
    this.playerStartsAt({ x: 2, y: 3 });
    engine.add(
      new Gate({
        x: 1,
        y: 2,
        goal: 0,
        name: "toLevel1",
        triggerOnExit: "beforeLevel2",
      }),
    );
    engine.add(new Wall({ x: 0, y: 2, up: 6 }));
    engine.add(new Floor({ x: 1, y: 2, right: 2 }));

    // ---
    // Deze vloer is niet lang genoeg. Kan jij het oplossen?
    engine.add(
      new Floor({
        x: 3,
        y: 0,
        right: 5,
      }),
    );
    // LET OP: Na de aanpassing moet je het spel herladen!
    // ---

    engine.add(new Floor({ x: 11, y: 2, right: 2 }));
    engine.add(new Gate({ x: 11, y: 2, goal: 0, name: "toLevel3" }));
    engine.add(new Wall({ x: 13, y: 2, up: 6 }));
  }
}
