import * as ex from "excalibur";
import { LevelLayout } from "../core/levelLayout";
import { Floor, Wall } from "../actors/ground";
import { Gate } from "../actors/gate";
import { iSceneNode } from "../core/cutScene";
import { GateLocation } from "../core/gateLocation";

export class Level2 extends LevelLayout implements iSceneNode {
  thisScene = "level2";
  nextScene = new GateLocation("level3", "entry");

  layoutLevel(engine: ex.Engine) {
    engine.add(
      new Gate({
        x: 1,
        y: 2,
        name: "entry",
        to: "level1/exit",
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
    engine.add(new Gate({ x: 11, y: 2, name: "exit", to: "level3/entry" }));
    engine.add(new Wall({ x: 13, y: 2, up: 6 }));
  }
}
