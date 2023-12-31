import * as ex from "excalibur";
import { sandHalfSprite, tileSize } from "../core/resources";
import { iLocation } from "../core/location";

export interface LiftArgs {
  startPos: iLocation;
  endPos: iLocation;
}

/**
 * A Lift is a platform that moves around, not just up and down.
 */
export class Lift extends ex.Actor implements LiftArgs {
  startPos: iLocation;
  endPos: iLocation;

  constructor(args: LiftArgs) {
    super({
      pos: new ex.Vector(
        args.startPos.x * tileSize,
        args.startPos.y * tileSize + 3,
      ),
      scale: new ex.Vector(0.25, 0.25),
      anchor: ex.Vector.Down,
      collisionType: ex.CollisionType.Fixed,
      collisionGroup: ex.CollisionGroupManager.groupByName("floor"),
      collider: ex.Shape.Box(tileSize * 4, tileSize * 2, ex.Vector.Down),
    });
    this.startPos = args.startPos;
    this.endPos = args.endPos;
    this.graphics.show(sandHalfSprite);
  }

  // OnInitialize is called before the 1st actor update
  onInitialize(engine: ex.Engine) {
    // For the test harness to be predicable
    if (!(window as any).__TESTING) {
      this.actions.repeatForever((ctx) =>
        ctx
          .moveTo(this.endPos.x * tileSize, this.endPos.y * tileSize, 100)
          .moveTo(this.startPos.x * tileSize, this.startPos.y * tileSize, 100),
      );
    }
  }
}
