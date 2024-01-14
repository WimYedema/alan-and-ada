import * as ex from "excalibur";
import {
  grassFlatSprite,
  grassBelowSprite,
  tileSize,
  gridSpace,
} from "../core/resources";
import { iBox, iFloor, iWall } from "../core/location";

/**
 * Floor and Walls
 */
export class Ground extends ex.Actor {
  constructor(args: iBox) {
    const scale = args.scale !== undefined ? args.scale : 1;
    super({
      name: "Ground",
      pos: gridSpace(args),
      scale: new ex.Vector(
        (scale * tileSize) / grassFlatSprite.width,
        (scale * tileSize) / grassFlatSprite.width,
      ),
      anchor: ex.Vector.Zero,
      collider: ex.Shape.Box(
        (4 * tileSize * args.right) / scale,
        (4 * tileSize * args.down) / scale,
        ex.Vector.Zero,
      ),
      collisionType: ex.CollisionType.Fixed,
      collisionGroup: ex.CollisionGroupManager.groupByName("floor"),
    });

    for (let i = 0; i < args.right / scale; i++) {
      let sprite = grassFlatSprite;
      for (let j = 0; j < args.down / scale; j++) {
        this.graphics.show(sprite, {
          anchor: ex.Vector.Zero,
          offset: ex.vec(i * sprite.width, j * sprite.height),
        });
        sprite = grassBelowSprite;
      }
    }
  }
}

export class Floor extends Ground {
  constructor(args: iFloor) {
    super({ down: 1, ...args });
  }
}

export class Wall extends Ground {
  constructor(args: iWall) {
    super({ x: args.x, y: args.y + args.up - 1, right: 1, down: args.up });
  }
}
