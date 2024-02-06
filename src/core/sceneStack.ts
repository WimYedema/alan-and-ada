import * as ex from "excalibur";
import { stats } from "./stats";

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
  onEnterThroughGate(entryPos: ex.Vector | null, gate: string): void {}

  gotoGate(
    context: ex.SceneActivationContext<SceneActivationData>,
    name: string,
  ) {
    const matches: ex.Entity[] = this.world.entityManager.getByName(name);
    let entryPos: ex.Vector | null = null;

    console.log("goto gate", name);
    if (matches.length != 1) {
      console.warn("no such gate", name);
    } else {
      const gate = matches[0];
      gate.emit("exitGate");
      entryPos = gate.get(ex.TransformComponent)!.pos;
    }
    this.onEnterThroughGate(entryPos, name);
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
        this.gotoGate(context, context.data?.gate);
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
    stats.currentNode = name;
    engine.goToScene(name, { method: "push" });
  }
  push(engine: ex.Engine, name: string) {
    console.log("pushing", name);
    this.stack.push(name);
    engine.goToScene(name, { method: "push" });
  }
  pop(engine: ex.Engine) {
    console.log("pop scene");
    if (this.stack.length <= 1) {
      console.error("Cannot pop the last scene.");
    } else {
      this.stack.pop();
      const name = this.stack[-1];
      console.log("pop to", name);
      engine.goToScene(name!, { method: "pop" });
    }
  }
  goto(engine: ex.Engine, name: string, gate: string) {
    console.log("goto scene", name, "gate", gate);
    stats.currentNode = name;
    this.stack[-1] = name;
    engine.goToScene(name, { method: "goto", gate: gate });
  }
}

export const sceneStack = new SceneStack();
