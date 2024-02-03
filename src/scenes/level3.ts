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
  introScene = "beforeLevel3";

  // Dit is de grootte van je level in (Breedte, Hoogte). Aanpassen mag!
  levelSize = new ex.Vector(22, 22);

  layoutLevel(engine: ex.Engine) {
    // Dit is een voorbeeld van een level, maar hij is nog niet af.
    // Je mag alles veranderen, en dingen toevoegen.
    engine.add(new Floor({ x: 0, y: 1, right: 22 }));
    this.playerStartsAt({ x: 2, y: 1 });

    engine.add(new Floor({ x: 8, y: 5, right: 11 }));
    engine.add(new Wall({ x: 7, y: 5, up: 2 }));
    engine.add(new Wall({ x: 19, y: 5, up: 2 }));
    engine.add(new Ground({ x: 7, y: 8.5, down: 2, right: 1, scale: 0.5 }));
    engine.add(new Baddie({ x: 10, y: 5 }));

    engine.add(new Floor({ x: 3, y: 3, right: 1 }));
    engine.add(new Lift({ startPos: { x: 1, y: 6 }, endPos: { x: 1, y: 10 } }));
    engine.add(new Lift({ startPos: { x: 16, y: 6 }, endPos: { x: 2, y: 6 } }));

    engine.add(new Floor({ x: 5, y: 10, right: 16 }));
    engine.add(new Gate({ x: 13, y: 10, goal: 0, name: "toExample" }));

    // -----
    // Hier zijn nog een paar voorbeelden van dingen die je aan je level kan toevoegen.
    //
    // engine.add(new Floor({ x: 1, y: 1, right: 1 }));
    // engine.add(new Wall({ x: 1, y: 1, up: 1 }));
    // engine.add(new Potion({ x: 1, y: 1, potionType: "shrink" }));
    // engine.add(new Potion({ x: 1, y: 1, potionType: "grow" }));
  }
}
