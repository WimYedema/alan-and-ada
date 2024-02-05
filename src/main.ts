import * as ex from "excalibur";
import { loader } from "./core/resources";
import { Example } from "./scenes/example";
import { GameOver } from "./scenes/gameover";
import { stats } from "./core/stats";
import { PlayerSelect } from "./scenes/playerSelect";
import { Level1 } from "./scenes/level1";
import {
  BeforeLevel1,
  BeforeLevel2,
  BeforeLevel3,
} from "./scenes/beforeScenes";
import { iSceneNode } from "./core/cutScene";
import { Level2 } from "./scenes/level2";
import { Finish } from "./scenes/finish";
import { Level3 } from "./scenes/level3";
import { sceneStack } from "./core/sceneStack";

const engine = new ex.Engine({
  backgroundColor: ex.Color.fromHex("#5fcde4"),
  width: 900,
  height: 700,
  fixedUpdateFps: 60,
  // Turn off anti-aliasing for pixel art graphics
  antialiasing: false,
});

// Create collision groups for the game
ex.CollisionGroupManager.create("player");
ex.CollisionGroupManager.create("enemy");
ex.CollisionGroupManager.create("floor");

// Set global gravity, 800 pixels/sec^2
ex.Physics.acc = new ex.Vector(0, 800);

let nodes: { [name: string]: iSceneNode & ex.Scene } = {};

function addNode(node: iSceneNode & ex.Scene) {
  console.log("Adding scene ", node.thisScene);
  engine.add(node.thisScene, node);
  nodes[node.thisScene] = node;
}

const playerSelect = new PlayerSelect();
addNode(playerSelect);

addNode(new BeforeLevel1());
addNode(new Level1());
addNode(new BeforeLevel2());
addNode(new Level2());
addNode(new BeforeLevel3());
addNode(new Level3());
addNode(new Example());
addNode(new Finish());
addNode(new GameOver());

class NodeGates {
  [gate: string]: { scene: string; gate?: string };
}

const passages: { [node: string]: NodeGates } = {
  playerSelect: {
    startGame: { scene: "level1", gate: "startGate" },
    next: { scene: "level1", gate: "startGate" },
  },
  level1: {
    startGate: { scene: "level1", gate: "startGate" },
    toLevel2: { scene: "level2", gate: "toLevel1" },
    next: { scene: "level2" },
  },
  level2: {
    toLevel3: { scene: "level3", gate: "toLevel2" },
    toLevel1: { scene: "level1", gate: "toLevel2" },
    next: { scene: "level3" },
  },
  level3: {
    toExample: { scene: "example", gate: "ExampleToLevel3" },
    toLevel2: { scene: "level2", gate: "toLevel3" },
    next: { scene: "example", gate: "ExampleToLevel3" },
  },
  example: {
    ExampleToLevel3: { scene: "level3", gate: "toExample" },
    ExampleToFinish: { scene: "finish" },
    next: { scene: "finish" },
  },
};

const st = JSON.parse(window.localStorage.getItem("stats") || "{}");
stats.load(st);
sceneStack.resetTo(engine, stats.currentNode);
let showDebug = false;

// Game events to handle
engine.on("preupdate", () => {
  if (engine.input.keyboard.wasPressed(ex.Input.Keys.Escape)) {
    showDebug = !showDebug;
    engine.showDebug(showDebug);
  } else if (showDebug) {
    if (engine.input.keyboard.wasPressed(ex.Input.Keys.KeyN)) {
      stats.inGate = "next";
    } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.Key1)) {
      stats.scaleTarget = 1;
      engine.currentScene.camera.zoomOverTime(1 / stats.scaleTarget, 2000);
    } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.Key2)) {
      stats.scaleTarget = 0.5;
      engine.currentScene.camera.zoomOverTime(1 / stats.scaleTarget, 2000);
    } else if (engine.input.keyboard.wasPressed(ex.Input.Keys.KeyR)) {
      stats.reset();
      sceneStack.resetTo(engine, "playerSelect");
      window.localStorage.setItem("stats", JSON.stringify(stats));
    }
  }

  if (stats.inGate !== null && stats.currentNode in passages) {
    console.log("entered gate", stats.inGate);
    const passage = passages[stats.currentNode][stats.inGate];
    stats.currentNode = passage.scene;
    sceneStack.goto(engine, passage.scene, passage.gate ?? "");
    stats.inGate = null;
    window.localStorage.setItem("stats", JSON.stringify(stats));
  } else if (stats.gameOver) {
    stats.currentNode = "gameover";
    sceneStack.resetTo(engine, "gameover");
  }
});
engine.on("gameover", () => {
  console.log("Game over reset");
  stats.reset();
  sceneStack.resetTo(engine, "playerSelect");
});
// Start the engine
engine.start(loader).then(() => {
  console.log("game start");
  // Detect hidden and visible outside of excalibur: it blocks events when the
  // engine is stopped so we cannot detect when to resume.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      console.log("Window hidden");
      engine.stop();
    } else if (document.visibilityState === "visible") {
      console.log("Window visible");
      engine.start();
    }
  });
});

// For test hook
(window as any).engine = engine;
(window as any).level = playerSelect;
