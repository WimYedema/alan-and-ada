import * as ex from "excalibur";

interface PushSceneActivationData {
  method: "push";
}
interface PopSceneActivationData {
  method: "pop";
}
interface GotoSceneActivationData {
  method: "goto";
  gate: string;
}
type SceneActivationData =
  | PushSceneActivationData
  | PopSceneActivationData
  | GotoSceneActivationData;

export abstract class Scene extends ex.Scene {
  onActivatePush(): void {}
  onActivatePop(): void {}
  onEnterThroughGate(entryPos: ex.Vector | null): void {}

  getGatePos(name: string): ex.Vector | null {
    const matches: ex.Entity[] = this.world.entityManager.getByName(name);
    if (matches.length != 1) {
      return null;
    }
    const gate = matches[0];
    return gate.get(ex.TransformComponent)!.pos;
  }
  onActivate(context: ex.SceneActivationContext<SceneActivationData>): void {
    switch (context.data?.method) {
      case "push":
        this.onActivatePush();
        break;
      case "pop":
        this.onActivatePop();
        break;
      case "goto":
        const entryPos = this.getGatePos(context.data?.gate);
        this.onEnterThroughGate(entryPos);
        break;
      default:
        console.error("unexpected activation method in:", context.data);
    }
  }
}

export class SceneStack {
  stack: string[] = [];

  resetTo(engine: ex.Engine, name: string) {
    this.stack = [name];
    engine.goToScene(name, { method: "push" });
  }
  push(engine: ex.Engine, name: string) {
    this.stack.push(name);
    engine.goToScene(name, { method: "push" });
  }
  pop(engine: ex.Engine) {
    if (this.stack.length <= 1) {
      console.error("Cannot pop the last scene.");
    } else {
      const name = this.stack.pop();
      engine.goToScene(name!, { method: "pop" });
    }
  }
  goto(engine: ex.Engine, name: string, gate: string) {
    this.stack[-1] = name;
    engine.goToScene(name, { method: "goto", gate: gate });
  }
}

export const sceneStack = new SceneStack();