export class Stats {
  public charName: string = "alan";
  public health: number = 5;
  public assignment: string = "";
  public gameOver: boolean = false;
  public nextScene: boolean = false;
  public currentNode: string = "playerSelect";
  public score: number = 0;
  public scaleTarget: number = 1;

  load(d: any) {
    this.charName = d["charName"] ?? this.charName;
    this.health = d["health"] ?? this.health;
    this.assignment = d["assignment"] ?? this.assignment;
    this.gameOver = d["gameOver"] ?? this.gameOver;
    this.nextScene = d["nextScene"] ?? this.nextScene;
    this.currentNode = d["currentNode"] ?? this.currentNode;
    this.score = d["score"] ?? this.score;
    this.scaleTarget = d["scaleTarget"] ?? this.scaleTarget;
  }
  public reset() {
    this.health = 5;
    this.gameOver = false;
    this.score = 0;
    this.assignment = "";
    this.nextScene = true;
    this.scaleTarget = 1;
  }
}

const stats = new Stats();

export { stats };
