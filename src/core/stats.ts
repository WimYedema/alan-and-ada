export class Stats {
  public charName: string = "alan";
  public health: number = 5;
  public assignment: string = "";
  public gameOver: boolean = false;
  public lastGate: string | null = null;
  public currentNode: string = "playerSelect";
  public score: number = 0;
  public scaleTarget: number = 1;

  save() {
    console.log("saving stats");
    window.localStorage.setItem("stats", JSON.stringify(this));
  }
  load() {
    const d = JSON.parse(window.localStorage.getItem("stats") || "{}");
    this.charName = d["charName"] ?? this.charName;
    this.health = d["health"] ?? this.health;
    this.assignment = d["assignment"] ?? this.assignment;
    this.gameOver = d["gameOver"] ?? this.gameOver;
    this.lastGate = d["lastGate"] ?? this.lastGate;
    this.currentNode = d["currentNode"] ?? this.currentNode;
    this.score = d["score"] ?? this.score;
    this.scaleTarget = d["scaleTarget"] ?? this.scaleTarget;
  }
  public reset() {
    this.health = 5;
    this.gameOver = false;
    this.score = 0;
    this.assignment = "";
    this.scaleTarget = 1;
    this.lastGate = null;
  }
}

const stats = new Stats();

export { stats };
