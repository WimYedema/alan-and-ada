import * as ex from 'excalibur';
import { iLocation } from './location';

export class Actor extends ex.Actor {
    kill(respawn?: number): void {
        if (respawn !== undefined) {
            const scene = this.scene;
            this.scene.engine.clock.schedule(() => {
                scene.add(this);
            }, respawn * 1000);
        }
        super.kill();
    }
    killAfter(seconds: number, respawn?: number, cb?: () => void): void {
        this.scene.engine.clock.schedule(() => {
            if (cb !== undefined) cb();
            this.kill(respawn);
        }, seconds * 1000);
    }
}

interface IActorState {
    [index: string]: any;
}

export class ActorState {
    public pos: ex.Vector;
    public vel: ex.Vector;
    public acc: ex.Vector;
    public angularVelocity: number;
    public rotation: number;
    public body: {
        collisionType: ex.CollisionType;
    };

    constructor(args: ex.Actor) 
    {
        // There's no direct way to get the current graphic used.
        this.pos = args.pos.clone();
        this.vel = args.vel.clone();
        this.acc = args.acc.clone();
        this.angularVelocity = args.angularVelocity;
        this.rotation = args.rotation;
        this.body = {
            collisionType: args.body.collisionType
        };
    }
}

export abstract class SceneActor<StateType> extends Actor {
    public initialState?: ActorState;
    protected abstract _state?: any;

    get state() : ActorState&StateType {
        return { ...this._state, ...new ActorState(this)};
    }
    set state(state: ActorState&any) {
        for(let key in this._state) {
            this._state[key] = state[key];
        }
        this.pos = state.pos;
        this.vel = state.vel;
        this.acc = state.acc;
        this.angularVelocity = state.angularVelocity;
        this.rotation = state.rotation;
        this.body.collisionType = state.body.collisionType;

        if (this.isKilled()) {
            this.scene.add(this);
        }
    }
    preInitialize(engine: ex.Engine) {
        
    }
    postInitialize(engine: ex.Engine) {
        this.initialState = this.state;
        this.scene.on('activate', () => this.onActivate());
    }

    onInitialize(engine: ex.Engine) {
        this.preInitialize(engine);
        super.onInitialize(engine);
        this.postInitialize(engine);
    }
    onActivate() {
        if (this.initialState === undefined) return;
        this.state = this.initialState;
    }
}