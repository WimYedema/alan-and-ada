import { CutScene, iSceneNode } from "../core/cutScene";

export class BeforeLevel1 extends CutScene implements iSceneNode {
  nextScene = "level1";
  thisScene = "beforeLevel1";

  public text = [
    "De code voor het eerste level vind je in src/scenes/level1.ts\n" +
      "Kijk eerst maar eens of je dat kan vinden in de EDITOR.",
    "Als je het level probeert zie je dat ik niet bij de volgende vloer\n" +
      "kan komen.\n" +
      "Kan jij ervoor zorgen dat hij lager staat?",
  ];
}

export class BeforeLevel2 extends CutScene {
  nextScene = "level2";
  thisScene = "beforeLevel2";

  public text = [
    "Goed gedaan!\n" +
      "In het volgende level is een vloer niet lang genoeg.\n" +
      "De code voor dit level vind je in src/scenes/level2.ts\n" +
      "Kan jij ervoor zorgen dat hij langer wordt?",
  ];
}

export class BeforeLevel3 extends CutScene {
  nextScene = "level3";
  thisScene = "beforeLevel3";

  public text = [
    "Mooi. Je bent klaar voor het echte werk.",
    "Het volgende level, src/scenes/level3.ts, mag je helemaal zelf bedenken.",
  ];
}
