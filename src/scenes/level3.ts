import * as ex from "excalibur";
import { Baddie } from "../actors/baddie";
import { Floor, Ground, Wall } from "../actors/ground";
import { Gate } from "../actors/gate";
import { LevelLayout } from "../core/levelLayout";
import { iSceneNode } from "../core/cutScene";
import { Potion } from "../actors/potion";
import { Lift } from "../actors/lift";

export class Level3 extends LevelLayout implements iSceneNode {
  thisScene = "level3";
  nextScene = "example";

  // Dit is de grootte van je level in (Breedte, Hoogte). Aanpassen mag!
  levelSize = new ex.Vector(22, 22);

  layoutLevel(engine: ex.Engine) {
    this.playerStartsAt({ x: 2, y: 0 });
    engine.add(new Gate({ x: 20, y: 0, goal: 0 }));

    // -----
    // Hier zijn een paar voorbeelden van dingen die je aan je level kan toevoegen.
    //
    // engine.add(new Floor({ x: 2, y: 3, right: 2 }));
    // engine.add(new Wall({ x: 5, y: 5, up: 5 }));
    // engine.add(new Potion({ x: 7, y: 0, potionColor: "purple" }));
    // engine.add(new Potion({ x: 9, y: 0, potionColor: "yellow" }));
    // engine.add(new Ground({ x: 8, y: 5, down: 3, right: 2 }));
    // engine.add(new Lift({ startPos: { x: 11, y: 1 }, endPos: { x: 11, y: 5 } }));
    // engine.add(new Baddie({ x: 21, y: 0 }));
  }
}
