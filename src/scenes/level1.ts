import * as ex from "excalibur";
import { LevelLayout } from "../core/levelLayout";
import { Floor, Wall } from "../actors/ground";
import { Gate } from "../actors/gate";
import { iSceneNode } from "../core/cutScene";
import { GateLocation } from "../core/gateLocation";

export class Level1 extends LevelLayout implements iSceneNode {
  thisScene = "level1";
  nextScene = new GateLocation("level2", "entry");

  layoutLevel(engine: ex.Engine) {
    engine.add(
      new Gate({
        x: 1,
        y: 0,
        name: "startGate",
        to: "level1/startGate",
        triggerOnExit: "beforeLevel1",
      }),
    );
    engine.add(new Wall({ x: 0, y: 0, up: 6 }));
    engine.add(new Floor({ x: 1, y: 0, right: 2 }));

    // // ---
    // // Deze vloer staat te hoog. Zorg dat hij lager staat.
    engine.add(
      new Floor({
        x: 3,
        y: 3,
        right: 6,
      }),
    );
    // // LET OP: Na de aanpassing moet je het spel herladen!
    // // ---

    engine.add(new Floor({ x: 9, y: 0, right: 2 }));
    engine.add(new Gate({ x: 9, y: 0, name: "exit", to: "level2/entry" }));
    engine.add(new Wall({ x: 11, y: 0, up: 6 }));
  }
}
