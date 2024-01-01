import * as ex from 'excalibur';
import { iSceneNode } from '../core/cutScene';
import { stats } from '../core/stats';

export class Finish extends ex.Scene implements iSceneNode {
    thisScene = "finish";
    nextScene = "playerSelect";

    onInitialize(engine: ex.Engine) {
        const congrats = new ex.Label({
            text: "Gefeliciteerd!\nDit is het",
            pos: ex.vec(engine.drawWidth/2, engine.drawHeight/4),
            font: new ex.Font({
                quality:4, 
                size: 20, 
                unit: ex.FontUnit.Px, 
                textAlign: ex.TextAlign.Center
            }),
            color: ex.Color.White
        });
        congrats.transform.coordPlane = ex.CoordPlane.Screen;
        engine.add(congrats);

        const theEnd = new ex.Label({
            text: "Einde",
            pos: ex.vec(engine.drawWidth/2, engine.drawHeight/4+100),
            font: new ex.Font({
                quality:4, 
                size: 80, 
                unit: ex.FontUnit.Px, 
                bold: true, 
                textAlign: ex.TextAlign.Center
            }),
            color: ex.Color.White
        });
        theEnd.transform.coordPlane = ex.CoordPlane.Screen;
        engine.add(theEnd);

        const credits = new ex.Label({
            text: "Created by Wim Yedema\nTiles by @CamTatz\nAlan and Ada by Game Art 2D\nOther sprites by Excalibur",
            pos: ex.vec(engine.drawWidth/2, 2*engine.drawHeight/3),
            font: new ex.Font({
                quality:4, 
                size: 20, 
                unit: ex.FontUnit.Px, 
                textAlign: ex.TextAlign.Center
            }),
            color: ex.Color.White
        });
        credits.transform.coordPlane = ex.CoordPlane.Screen;
        engine.add(credits);

        // For the test harness to be predicable
        // if (!(window as any).__TESTING) {
        //     // Create camera strategy
        //     this.camera.clearAllStrategies();
        //     this.camera.strategy.elasticToActor(actor, 0.05, 0.1);
        // }
    }
    onPostUpdate(engine: ex.Engine, _delta: number): void {
        if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
            engine.emit("gameover");
            stats.reset();
        }
    }
}