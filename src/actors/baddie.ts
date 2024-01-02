import * as ex from 'excalibur';
import { baddieSpriteSheet, Resources, tileSize } from "../core/resources";
import { Player } from './player';
import { stats } from '../core/stats';
import { Ground } from './ground';
import { iLocation } from '../core/location';
import { ActorState, SceneActor } from '../core/actor';

export interface BaddieState {
    hit: boolean;
    hitTime: number;
}
    
export class Baddie extends SceneActor<BaddieState> {
    protected _state: {
        hit: boolean;
        hitTime: number;
    } = { hit: false, hitTime: 0};
    public direction: ex.Vector = ex.vec(100, 0);

    constructor(args: iLocation) {
        super({
            name: 'Baddie',
            pos: new ex.Vector(args.x * tileSize, args.y * tileSize),
            anchor: new ex.Vector(0.5, 1),
            collisionGroup: ex.CollisionGroupManager.groupByName("enemy"),
            collisionType: ex.CollisionType.Active,
            collider: ex.Shape.Box(32, 50, new ex.Vector(0.5, 1))
        });
    }

    preInitialize(engine: ex.Engine) {
        // Setup visuals
        const idle = ex.Animation.fromSpriteSheet(baddieSpriteSheet, [0, 1], 100);
        idle.scale = new ex.Vector(2, 2);
        const left = ex.Animation.fromSpriteSheet(baddieSpriteSheet, [2, 3, 4, 5], 100);
        left.scale = new ex.Vector(2, 2);
        const right = ex.Animation.fromSpriteSheet(baddieSpriteSheet, [2, 3, 4, 5], 100);
        right.scale = new ex.Vector(2, 2);
        right.flipHorizontal = true;

        // Register animation
        this.graphics.add("idle", idle);
        this.graphics.add("left", left);
        this.graphics.add("right", right);
        this.graphics.use("left");

        if ((window as any).__TESTING) {
            left.pause();
        }

        // Start moving
        this.vel = this.direction;

        // Handle being stomped by the player
        this.on('precollision', (evt) => this.onPreCollision(evt));
        this.on('postcollision', (evt) => this.onPostCollision(evt));
    }
    onPostCollision(evt: ex.PostCollisionEvent) {
        if (evt.other instanceof Player) {
            if (evt.side === ex.Side.Top && !evt.other.hurt) {
                Resources.gotEm.play(.1);
                // Remove ability to collide
                this.body.collisionType = ex.CollisionType.PreventCollision;

                // Launch into air with rotation
                this.vel = new ex.Vector(0, -300);
                this.acc = ex.Physics.acc;
                this.angularVelocity = 2;
                // Update stats
                stats.score += 1;
            } else if (evt.side == ex.Side.Left || evt.side == ex.Side.Right) {
                this._state.hit = true;
                this._state.hitTime = 500;
                this.direction = ex.vec(-this.direction.x, this.direction.y);
                this.vel = ex.Vector.Zero;
            }
        }
    }
    onPreCollision(evt: ex.PreCollisionEvent) {
        if (evt.other instanceof Ground) {
            if (evt.side === ex.Side.Left) {
                this.direction = ex.vec(-this.direction.x, this.direction.y);
                this.vel = this.direction;
            } else if (evt.side === ex.Side.Right) {
                this.direction = ex.vec(-this.direction.x, this.direction.y);
                this.vel = this.direction;
            }
        }
    }

    // Change animation based on velocity 
    onPreUpdate(engine: ex.Engine, delta: number): void {
        if (this._state.hit) {
            this._state.hitTime -= delta;
            if (this._state.hitTime <= 0) {
                this._state.hit = false;
                this.vel = this.direction;
            }
        }
    }
    onPostUpdate() {
        if (this.vel.x < 0) {
            this.graphics.use("left");
        } else if (this.vel.x > 0) {
            this.graphics.use("right");
        } else {
            this.graphics.use("idle");
        }
    }

}