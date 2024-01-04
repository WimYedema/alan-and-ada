import * as ex from "excalibur";
import {
  gateOpenSpriteSheet,
  gateClosedSpriteSheet,
  tileSize,
} from "../core/resources";
import { Player } from "./player";
import { stats } from "../core/stats";
import { iLocation } from "../core/location";
import { iArtifact } from "../core/iartifact";
import { GameActor } from "../core/actor";

export interface GateArgs extends iLocation {
  goal: number;
}

export class GateState {
  isOpen: boolean = false;
  goal: number = 0;
}

export class Gate extends GameActor<GateState> implements iArtifact {
  protected _state = new GateState();
  goal: number = 0;
  constructor(args: GateArgs) {
    super({
      name: "Gate",
      pos: new ex.Vector(args.x * tileSize, args.y * tileSize),
      scale: new ex.Vector(0.5, 0.5),
      anchor: ex.Vector.Down,
      collider: ex.Shape.Box(
        tileSize * 4,
        tileSize * 4,
        ex.Vector.Down,
        new ex.Vector((228 - tileSize * 4) / 2, 0),
      ),
      collisionType: ex.CollisionType.Passive,
      collisionGroup: ex.CollisionGroupManager.groupByName("floor"),
    });
    // Set the z-index to be behind everything
    this.z = -2;
    this.goal = args.goal;
    const closed = ex.Animation.fromSpriteSheet(
      gateClosedSpriteSheet,
      [0],
      800,
    );
    const opened = ex.Animation.fromSpriteSheet(gateOpenSpriteSheet, [0], 800);
    this.graphics.add("closed", closed);
    this.graphics.add("opened", opened);
    this.graphics.use("closed");

    this.on("collisionstart", (evt) => this.onCollisionStart(evt));
    this.on("collisionend", (evt) => this.onCollisionEnd(evt));

    this.graphics.onPostDraw = () => {
      this.onPostDraw();
    };
  }
  onActivate() {
    this._state.goal = stats.score + this.goal;
  }
  onPostDraw() {
    if (stats.score == this._state.goal) {
      this._state.isOpen = true;
    }
    if (this._state.isOpen) {
      this.graphics.use("opened");
    } else {
      this.graphics.use("closed");
    }
  }
  activateArtifact(player: Player) {
    if (this._state.isOpen) {
      stats.nextScene = true;
    }
  }
  onCollisionStart(evt: ex.CollisionStartEvent) {
    if (evt.other instanceof Player) {
      evt.other.atArtifact = this;
    }
  }

  onCollisionEnd(evt: ex.CollisionEndEvent) {
    if (evt.other instanceof Player) {
      evt.other.atArtifact = null;
    }
  }
}
