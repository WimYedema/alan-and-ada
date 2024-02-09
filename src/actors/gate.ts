import * as ex from "excalibur";
import {
  gateOpenSpriteSheet,
  gateClosedSpriteSheet,
  tileSize,
  gridSpace,
} from "../core/resources";
import { Player } from "./player";
import { stats } from "../core/stats";
import { iLocation } from "../core/location";
import { iArtifact } from "../core/iartifact";
import { GameActor } from "../core/actor";
import { sceneStack } from "../core/sceneStack";

export interface GateArgs extends iLocation {
  name: string;
  to: string;
  goal?: number;
  triggerOnExit?: string;
}

export class GateState {
  isOpen: boolean = false;
  goal: number = 0;
}

/**
 * With a Gate the player can move to another Scene
 */
export class Gate extends GameActor<GateState> implements iArtifact {
  protected _state = new GateState();
  goal: number = 0;
  to: string;
  protected triggerOnExit: string | null = null;
  constructor(args: GateArgs) {
    super({
      name: args.name ?? "Gate",
      pos: gridSpace(args),
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
    this.goal = args.goal ?? 0;
    this.to = args.to;
    this.triggerOnExit = args.triggerOnExit ?? null;

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
    this.on("exitGate", (evt) => this.onExitGate());

    this.graphics.onPostDraw = () => {
      this.onPostDraw();
    };
  }
  onExitGate() {
    console.log("exit gate", this.name);
    stats.lastGate = this.name;
    if (this.triggerOnExit !== null) {
      sceneStack.push(this.scene.engine, this.triggerOnExit);
    }
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
      const [scene, gate] = this.to.split("/", 2);
      sceneStack.goto(this.scene.engine, scene, gate);
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
