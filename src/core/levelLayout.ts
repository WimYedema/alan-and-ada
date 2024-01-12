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
  onInitialize(engine: ex.Engine) {
    this.layoutLevel(engine);

    this.player = new Player(this.playerStart.x, this.playerStart.y);

    engine.add(this.player);
    let assignment = "src/scenes/" + this.thisScene + ".ts";

    const scoreLabel = new ex.Label({
      text:
        "H" + stats.health + " S" + stats.score + " Opdracht: " + assignment,
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
      scoreLabel.text =
        "H" + stats.health + " S" + stats.score + " Opdracht: " + assignment;
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

    // For the test harness to be predicable
    if (!(window as any).__TESTING) {
      this.initCamera(this.player);
      if (this.levelSize !== undefined) {
        this.camera.strategy.lockToActor(this.player);
        this.camera.strategy.limitCameraBounds(
          new ex.BoundingBox(
            0,
            0,
            this.levelSize.x * tileSize,
            this.levelSize.y * tileSize,
          ),
        );
        engine.add(new Floor({ x: -1, y: -1, right: this.levelSize.x + 2 }));
        engine.add(
          new Floor({
            x: -1,
            y: this.levelSize.y,
            right: this.levelSize.x + 2,
          }),
        );
        engine.add(new Wall({ x: -1, y: 0, down: this.levelSize.y }));
        engine.add(
          new Wall({ x: this.levelSize.x, y: 0, down: this.levelSize.y }),
        );
      }
    }
  }
}
