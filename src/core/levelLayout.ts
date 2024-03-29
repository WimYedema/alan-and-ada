import * as ex from "excalibur";
import { Player } from "../actors/player";
import { stats } from "./stats";
import { iSceneNode } from "./cutScene";
import { iLocation } from "./location";
import { tileSize } from "./resources";
import { Floor, Wall } from "../actors/ground";

/**
 * The LevelLayout is the foundation for all *playable* levels. It set the
 * general screen layout, configures the camera, and provides some convenience
 * functions for level construction.
 *
 * The sub-classes only need to implement {@link layoutLevel} to create the actors
 * and artifacts of the level.
 *
 * @noInheritDoc
 */
export abstract class LevelLayout extends ex.Scene implements iSceneNode {
  abstract thisScene: string;
  abstract nextScene: string;
  protected levelSize?: ex.Vector;

  protected playerStart: ex.Vector = ex.vec(2, 2);
  protected player?: Player;
  protected assignment: string = "";

  /**
   * Populate the level with actors, creating the walls, floors, monsters,
   * etc. The level should at least position the player, an exit gate, and
   * probably something for the player to stand on.
   *
   * @param engine The excalibur engine.
   */
  abstract layoutLevel(engine: ex.Engine): void;

  /**
   * Set the start location of the player.
   *
   * @param args The location where the player will start.
   */
  playerStartsAt(args: iLocation) {
    this.playerStart = ex.vec(args.x, args.y);
  }
  /**
   * @experimental
   *
   * Initialize the camera for this level. Defaults to an elastic focus on the
   * player.
   *
   * @param player The player actor
   */
  initCamera(player: ex.Actor) {
    this.camera.clearAllStrategies();
    this.camera.strategy.elasticToActor(player, 0.05, 0.1);
  }
  statsLine() {
    let x = 0;
    let y = 0;
    let h = stats.health;
    if (this.player !== undefined) {
      x = Math.floor(this.player.pos.x / tileSize);
      y = -Math.floor(this.player.pos.y / tileSize);
    }
    h = Math.max(0, Math.min(stats.health, 5));
    return (
      "♥".repeat(h) +
      "♡".repeat(5 - h) +
      " x:" +
      x +
      " y:" +
      y +
      " Opdracht: " +
      this.assignment
    );
  }
  onInitialize(engine: ex.Engine) {
    this.layoutLevel(engine);

    this.player = new Player(this.playerStart.x, this.playerStart.y);

    engine.add(this.player);
    this.assignment = "src/scenes/" + this.thisScene + ".ts";

    const scoreLabel = new ex.Label({
      text: this.statsLine(),
      pos: ex.vec(10, 20),
      z: 2,
    });
    scoreLabel.font.quality = 4;
    scoreLabel.font.size = 15;
    scoreLabel.font.unit = ex.FontUnit.Px;
    //scoreLabel.font.family = "Open Sans";
    scoreLabel.transform.coordPlane = ex.CoordPlane.Screen;
    scoreLabel.color = ex.Color.Black;
    scoreLabel.on("preupdate", (evt) => {
      scoreLabel.text = this.statsLine();
    });
    engine.add(scoreLabel);

    const background = new ex.Actor({
      x: 0,
      y: 0,
      z: 1,
      anchor: ex.Vector.Zero,
    });
    background.transform.coordPlane = ex.CoordPlane.Screen;
    const poly = new ex.Rectangle({
      width: engine.drawWidth,
      height: 30,
      color: ex.Color.White,
    });
    background.graphics.add("poly", poly);
    background.graphics.show("poly");
    engine.add(background);

    this.camera.pos = this.player.pos.clone();

    // For the test harness to be predicable
    if (!(window as any).__TESTING) {
      this.initCamera(this.player);
      if (this.levelSize !== undefined) {
        this.camera.strategy.lockToActor(this.player);
        this.camera.strategy.limitCameraBounds(
          new ex.BoundingBox(
            0,
            -this.levelSize.y * tileSize,
            this.levelSize.x * tileSize,
            0,
          ),
        );
        engine.add(new Floor({ x: -1, y: 0, right: this.levelSize.x + 2 }));
        engine.add(
          new Floor({
            x: -1,
            y: this.levelSize.y + 1,
            right: this.levelSize.x + 2,
          }),
        );
        engine.add(new Wall({ x: -1, y: 0, up: this.levelSize.y + 1 }));
        engine.add(
          new Wall({ x: this.levelSize.x, y: 0, up: this.levelSize.y + 1 }),
        );
      }
    }
  }
}
