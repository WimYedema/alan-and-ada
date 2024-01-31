import * as ex from "excalibur";
import {
  Resources,
  tileSize,
  playerCharacters,
  gridSpace,
} from "../core/resources";
import { Baddie } from "./baddie";
import { stats } from "../core/stats";
import { iArtifact } from "../core/iartifact";
import { Lift } from "./lift";
import { GameActor } from "../core/actor";

export class PlayerState {
  charName: string = "alan";
  onGround: boolean = true;
  atArtifact: iArtifact | null = null;
  hurt = false;
  hurtTime: number = 0;
  scaleTarget: number = 1;
  groundVel: ex.Vector = ex.Vector.Zero;
}

/**
 * The actor controlled by the player.
 */
export class Player extends GameActor<PlayerState> {
  protected _state = new PlayerState();

  set hurt(hurt: boolean) {
    this._state.hurt = hurt;
  }
  get hurt(): boolean {
    return this._state.hurt;
  }
  set scaleTarget(target: number) {
    stats.scaleTarget = target;
  }
  get scaleTarget(): number {
    return stats.scaleTarget;
  }
  set atArtifact(artifact: iArtifact | null) {
    this._state.atArtifact = artifact;
  }
  get atArtifact(): iArtifact | null {
    return this._state.atArtifact;
  }
  constructor(x: number, y: number) {
    super({
      name: "Player",
      pos: gridSpace({ x: x, y: y }),
      anchor: new ex.Vector(0.5, 1),
      collisionType: ex.CollisionType.Active,
      collisionGroup: ex.CollisionGroupManager.groupByName("player"),
      collider: ex.Shape.Box(32, 50, new ex.Vector(0.5, 1)),
    });
  }
  onActivate(engine: ex.Engine) {
    if (this._state.charName != stats.charName) {
      this.reinitialize(engine);
    }
    this.scale = ex.vec(stats.scaleTarget, stats.scaleTarget);
  }
  initializeActor(engine: ex.Engine) {
    // Initialize actor
    this._state.charName = stats.charName;
    const hurt_sprite = playerCharacters[stats.charName].hurt;
    const idle_sprite = playerCharacters[stats.charName].idle;
    const jump_sprite = playerCharacters[stats.charName].jump;
    const run_sprite = playerCharacters[stats.charName].run;

    // Setup visuals
    const scale = new ex.Vector(0.125, 0.125);
    const hurtleft = ex.Animation.fromSpriteSheet(hurt_sprite, [0], 80);
    hurtleft.scale = scale;
    hurtleft.flipHorizontal = true;

    const hurtright = ex.Animation.fromSpriteSheet(hurt_sprite, [0], 80);
    hurtright.scale = scale;

    const idle = ex.Animation.fromSpriteSheet(
      idle_sprite,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      80,
    );
    idle.scale = scale;

    const jumpleft = ex.Animation.fromSpriteSheet(
      jump_sprite,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      80,
    );
    jumpleft.scale = scale;
    jumpleft.flipHorizontal = true;

    const jumpright = ex.Animation.fromSpriteSheet(
      jump_sprite,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      80,
    );
    jumpright.scale = scale;

    const left = ex.Animation.fromSpriteSheet(
      run_sprite,
      [0, 1, 2, 3, 4, 5, 6, 7],
      40,
    );
    left.scale = scale;
    left.flipHorizontal = true;

    const right = ex.Animation.fromSpriteSheet(
      run_sprite,
      [0, 1, 2, 3, 4, 5, 6, 7],
      40,
    );
    right.scale = scale;

    // Register animations with actor
    this.graphics.add("hurtleft", hurtleft);
    this.graphics.add("hurtright", hurtright);
    this.graphics.add("jumpleft", jumpleft);
    this.graphics.add("jumpright", jumpright);
    this.graphics.add("idle", idle);
    this.graphics.add("left", left);
    this.graphics.add("right", right);

    // onPostCollision is an event, not a lifecycle meaning it can be subscribed to by other things
    this.on("postcollision", (evt) => this.onPostCollision(evt));
    this.on("exitviewport", (evt) => this.onExitViewport(evt));
  }
  onExitViewport(evt: ex.ExitViewPortEvent) {
    stats.gameOver = true;
  }

  onPostCollision(evt: ex.PostCollisionEvent) {
    // Bot has collided with it's Top of another collider
    this._state.groundVel = ex.Vector.Zero;
    if (evt.side === ex.Side.Bottom && evt.other instanceof Lift) {
      this._state.groundVel = evt.other.vel;
    }

    // Bot has collided on the side, display hurt animation
    if (
      (evt.side === ex.Side.Left || evt.side === ex.Side.Right) &&
      evt.other instanceof Baddie
    ) {
      if (!this._state.hurt) {
        // this.scene.camera.zoomOverTime(2, 500);
        if (this.vel.x < 0) {
          this.graphics.use("hurtleft");
        } else {
          this.graphics.use("hurtright");
        }
        stats.health -= 1;
        if (evt.side === ex.Side.Left) this.vel.x = 100;
        else this.vel.x = -100;
      }
      this._state.hurt = true;
      this._state.hurtTime = 1000;
      this.vel.y = -200;
      Resources.hit.play(0.1);
      if (stats.health == 0) {
        // Remove ability to collide. This will result in gameover when the player leaves the camera
        this.body.collisionType = ex.CollisionType.PreventCollision;

        // Launch into air with rotation
        this.acc = ex.Physics.acc;
        this.angularVelocity = 2;
      }
    }
  }

  // After main update, once per frame execute this code
  onPreUpdate(engine: ex.Engine, delta: number) {
    if (this.scale.x < this.scaleTarget) {
      const new_scale = Math.min(this.scale.x + 0.01, this.scaleTarget);
      this.scale = ex.vec(new_scale, new_scale);
    } else if (this.scaleTarget < this.scale.x) {
      const new_scale = Math.max(this.scale.x - 0.01, this.scaleTarget);
      this.scale = ex.vec(new_scale, new_scale);
    }
    // If hurt, count down
    if (this._state.hurt) {
      this._state.hurtTime -= delta;
      this._state.hurt = this._state.hurtTime > 0;
    } else {
      // Reset x velocity
      this.vel.x = this._state.groundVel.x;
      if (this._state.groundVel.y != 0) {
        this.vel.y = this._state.groundVel.y;
      }
      // Player input
      if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
        this.vel.x -= 200 * this.scaleTarget;
      } else if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
        this.vel.x += 200 * this.scaleTarget;
      }

      if (
        engine.input.keyboard.wasPressed(ex.Input.Keys.Space) &&
        this._state.atArtifact !== null
      ) {
        this._state.atArtifact.activateArtifact(this);
      }
      if (
        engine.input.keyboard.wasPressed(ex.Input.Keys.Up) &&
        this._state.onGround
      ) {
        this.vel.y = -tileSize * 20 * Math.sqrt(this.scaleTarget / 3);
        this.graphics.use("jumpleft");
        Resources.jump.play(0.1);
      }
    }

    // Change animation based on velocity
    if (!this._state.hurt) {
      let relvel = this.vel.sub(this._state.groundVel);
      if (Math.abs(relvel.y) < 0.1) {
        this._state.onGround = true;
        if (relvel.x === 0) {
          this.graphics.use("idle");
        } else if (relvel.x < 0) {
          this.graphics.use("left");
        } else if (relvel.x > 0) {
          this.graphics.use("right");
        }
      } else {
        this._state.onGround = false;
        if (relvel.x < 0) {
          this.graphics.use("jumpleft");
        } else {
          this.graphics.use("jumpright");
        }
      }
    }
    this._state.groundVel.y = 0;
  }
}
