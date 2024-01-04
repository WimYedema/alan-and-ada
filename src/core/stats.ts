class Stats {
  public charName: string = "alan";
  public health: number = 100;
  public assignment: string = "";
  public gameOver: boolean = false;
  public nextScene: boolean = false;
  public currentNode: string = "playerSelect";
  public score: number = 0;
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
