import * as ex from "excalibur";
import { gridSpace, sandHalfSprite, tileSize } from "../core/resources";
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
      pos: gridSpace(args.startPos),
      anchor: ex.Vector.Down,
      collisionType: ex.CollisionType.Fixed,
      collisionGroup: ex.CollisionGroupManager.groupByName("floor"),
      collider: ex.Shape.Box(tileSize, tileSize / 2, ex.Vector.Down),
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
          .moveTo(gridSpace(this.endPos), 100)
          .moveTo(gridSpace(this.startPos), 100),
      );
    }
  }
}
