export class Stats {
  public charName: string = "alan";
  public health: number = 100;
  public assignment: string = "";
  public gameOver: boolean = false;
  public nextScene: boolean = false;
  public currentNode: string = "playerSelect";
  public score: number = 0;
  load(d: any) {
    this.charName = d["charName"] ?? this.charName;
    this.health = d["health"] ?? this.health;
    this.assignment = d["assignment"] ?? this.assignment;
    this.gameOver = d["gameOver"] ?? this.gameOver;
    this.nextScene = d["nextScene"] ?? this.nextScene;
    this.currentNode = d["currentNode"] ?? this.currentNode;
    this.score = d["score"] ?? this.score;
  }
  public reset() {
    this.health = 100;
    this.gameOver = false;
    this.score = 0;
    this.assignment = "";
    this.nextScene = true;
  }
}

const stats = new Stats();

export { stats };
