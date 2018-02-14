import * as gs from "gs-json";
import * as threex from "../libs/threex/threex";

export function genModelTest1(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,0,0],    // 0
            [10,0,0],   // 1
            [10,10,0],  // 2
            [0,10,0],   // 3
            [0,0,10],   // 4
            [10,0,10],  // 5
            [10,10,10], // 6
            [0,10,10],  // 7
        ]);
    m.getGeom().addPolymesh([
            [points[0],points[1],points[2],points[3]],
            [points[0],points[4],points[5],points[1]],
            [points[1],points[5],points[6],points[2]],
            [points[2],points[6],points[7],points[3]],
            [points[3],points[7],points[4],points[0]],
            [points[7],points[6],points[5],points[4]],
        ]);
    return m;
}
