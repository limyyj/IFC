import * as gs from "gs-json";
import * as threex from "../libs/threex/threex";

export function genModelTest1(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,0,0],    // 0
            [100,0,0],   // 1
            [100,1000,0],  // 2
            [0,1000,0],   // 3
            [0,0,1000],   // 4
            [100,0,1000],  // 5
            [100,1000,1000], // 6
            [0,1000,1000],  // 7
        ]);
    const wall: gs.IObj = m.getGeom().addPolymesh([
            [points[0],points[1],points[2],points[3]],
            [points[0],points[4],points[5],points[1]],
            [points[1],points[5],points[6],points[2]],
            [points[2],points[6],points[7],points[3]],
            [points[3],points[7],points[4],points[0]],
            [points[7],points[4],points[5],points[6]],
        ]);
    wall.setAttribValue(b, "Wall");
    return m;
}
