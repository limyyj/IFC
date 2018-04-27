import * as gs from "gs-json";
import * as threex from "../libs/threex/threex";

export function genModelTestWall(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,150,0],    // 0
            [3000,150,0],    // 1
            [3000,-150,0],    // 2
            [0,-150,0],    // 3
            [0,150,4000],    // 4
            [3000,150,4000],    // 5
            [3000,-150,4000],    // 6
            [0,-150,4000],    // 7
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

    const points2: gs.IPoint[] = m.getGeom().addPoints([
            [-150,0,0],    // 0
            [150,0,0],    // 1
            [150,3000,0],    // 2
            [-150,3000,0],   // 3
            [-150,0,4000],   // 4
            [150,0,4000],    // 5
            [150,3000,4000],    // 6
            [-150,3000,4000],    // 7
        ]);
    const wall2: gs.IObj = m.getGeom().addPolymesh([
            [points2[0],points2[1],points2[2],points2[3]],
            [points2[0],points2[4],points2[5],points2[1]],
            [points2[1],points2[5],points2[6],points2[2]],
            [points2[2],points2[6],points2[7],points2[3]],
            [points2[3],points2[7],points2[4],points2[0]],
            [points2[7],points2[4],points2[5],points2[6]],
        ]);
    wall2.setAttribValue(b, "Wall");
    return m;
}

export function genModelTestSlab(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,0,0],    // 0
            [0,1000,0],   // 1
            [1000,1000,0],  // 2
            [500,500,0],    // 3
            [1000,0,0],   // 4
            [0,0,100],   // 5
            [0,1000,100],  // 6
            [1000,1000,100], // 7
            [500,500,100],    // 8
            [1000,0,100],  // 9

        ]);
    const slab: gs.IObj = m.getGeom().addPolymesh([
            [points[0],points[1],points[2],points[3],points[4]],
            [points[0],points[5],points[6],points[1]],
            [points[1],points[6],points[7],points[2]],
            [points[2],points[7],points[8],points[3]],
            [points[3],points[8],points[9],points[4]],
            [points[4],points[9],points[5],points[0]],
            [points[5],points[6],points[7],points[8],points[9]],
        ]);
    slab.setAttribValue(b, "Slab");
    return m;
}

export function genModelTestWallSlab(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,150,0],    // 0
            [3000,150,0],    // 1
            [3000,-150,0],    // 2
            [0,-150,0],    // 3
            [0,150,4000],    // 4
            [3000,150,4000],    // 5
            [3000,-150,4000],    // 6
            [0,-150,4000],    // 7
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

    const points2: gs.IPoint[] = m.getGeom().addPoints([
            [-150,0,0],    // 0
            [150,0,0],    // 1
            [150,3000,0],    // 2
            [-150,3000,0],   // 3
            [-150,0,4000],   // 4
            [150,0,4000],    // 5
            [150,3000,4000],    // 6
            [-150,3000,4000],    // 7
        ]);
    const wall2: gs.IObj = m.getGeom().addPolymesh([
            [points2[0],points2[1],points2[2],points2[3]],
            [points2[0],points2[4],points2[5],points2[1]],
            [points2[1],points2[5],points2[6],points2[2]],
            [points2[2],points2[6],points2[7],points2[3]],
            [points2[3],points2[7],points2[4],points2[0]],
            [points2[7],points2[4],points2[5],points2[6]],
        ]);
    wall2.setAttribValue(b, "Wall");

    const points3: gs.IPoint[] = m.getGeom().addPoints([
            [0,3150,0],    // 0
            [3000,3150,0],    // 1
            [3000,2850,0],    // 2
            [0,2850,0],    // 3
            [0,3150,4000],    // 4
            [3000,3150,4000],    // 5
            [3000,2850,4000],    // 6
            [0,2850,4000],    // 7
        ]);
    const wall3: gs.IObj = m.getGeom().addPolymesh([
            [points3[0],points3[1],points3[2],points3[3]],
            [points3[0],points3[4],points3[5],points3[1]],
            [points3[1],points3[5],points3[6],points3[2]],
            [points3[2],points3[6],points3[7],points3[3]],
            [points3[3],points3[7],points3[4],points3[0]],
            [points3[7],points3[4],points3[5],points3[6]],
        ]);
    wall3.setAttribValue(b, "Wall");

    const points4: gs.IPoint[] = m.getGeom().addPoints([
            [2850,0,0],    // 0
            [3150,0,0],    // 1
            [3150,3000,0],    // 2
            [2850,3000,0],   // 3
            [2850,0,4000],   // 4
            [3150,0,4000],    // 5
            [3150,3000,4000],    // 6
            [2850,3000,4000],    // 7
        ]);
    const wall4: gs.IObj = m.getGeom().addPolymesh([
            [points4[0],points4[1],points4[2],points4[3]],
            [points4[0],points4[4],points4[5],points4[1]],
            [points4[1],points4[5],points4[6],points4[2]],
            [points4[2],points4[6],points4[7],points4[3]],
            [points4[3],points4[7],points4[4],points4[0]],
            [points4[7],points4[4],points4[5],points4[6]],
        ]);
    wall4.setAttribValue(b, "Wall");

    const points5: gs.IPoint[] = m.getGeom().addPoints([
            [0,0,0],    // 0
            [0,3000,0],   // 1
            [3000,3000,0],  // 2
            [3000,0,0],   // 3
            [0,0,100],   // 4
            [0,3000,100],  // 5
            [3000,3000,100], // 6
            [3000,0,100],    // 7

        ]);
    const slab: gs.IObj = m.getGeom().addPolymesh([
            [points5[0],points5[1],points5[2],points5[3]],
            [points5[0],points5[4],points5[5],points5[1]],
            [points5[1],points5[5],points5[6],points5[2]],
            [points5[2],points5[6],points5[7],points5[3]],
            [points5[3],points5[7],points5[4],points5[0]],
            [points5[7],points5[4],points5[5],points5[6]],
        ]);
    slab.setAttribValue(b, "Slab");
    return m;
}

export function genModelTestWall2(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,0,0],    // 0
            [3000,0,0],    // 1
            [3000,300,0],    // 2
            [300,300,0],    // 3
            [300,3000,0],    // 4
            [0,3000,0],    // 5
            [0,0,4000],    // 6
            [3000,0,4000],    // 7
            [3000,300,4000],    // 8
            [300,300,4000],    // 9
            [300,3000,4000],    // 10
            [0,3000,4000],    // 11
        ]);
    const wall: gs.IObj = m.getGeom().addPolymesh([
            [points[0],points[1],points[2],points[3],points[4],points[5]],
            [points[0],points[6],points[7],points[1]],
            [points[1],points[7],points[8],points[2]],
            [points[2],points[8],points[9],points[3]],
            [points[3],points[9],points[10],points[4]],
            [points[4],points[10],points[11],points[5]],
            [points[5],points[11],points[6],points[0]],
            [points[6],points[7],points[8],points[9],points[10],points[11]],
        ]);
    wall.setAttribValue(b, "Wall");
    return m;
}

export function genModelTestWall3(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [0,0,0],    // 0
            [3000,0,0],    // 1
            [3000,300,0],    // 2
            [300,300,0],    // 3
            [300,3000,0],    // 4
            [0,3000,0],    // 5
            [0,0,4000],    // 6
            [3000,0,4000],    // 7
            [3000,300,4000],    // 8
            [300,300,4000],    // 9
            [300,3000,4000],    // 10
            [0,3000,4000],    // 11
        ]);
    const wall: gs.IObj = m.getGeom().addPolymesh([
            [points[0],points[1],points[2],points[3]],
            [points[3],points[4],points[5],points[0]],
            [points[0],points[6],points[7],points[1]],
            [points[1],points[7],points[8],points[2]],
            [points[2],points[8],points[9],points[3]],
            [points[3],points[9],points[10],points[4]],
            [points[4],points[10],points[11],points[5]],
            [points[5],points[11],points[6],points[0]],
            [points[6],points[7],points[8],points[9]],
            [points[9],points[10],points[11],points[6]],
        ]);
    wall.setAttribValue(b, "Wall");
    return m;
}

export function genModelTestObj(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const b: gs.IEntAttrib = m.addEntAttrib("Element_Type", gs.EGeomType.objs, gs.EDataType.type_str);
    const points: gs.IPoint[] = m.getGeom().addPoints([
            [-500,-500,0],    // 0
            [500,-500,0],    // 1
            [500,500,0],    // 2
            [-500,500,0],    // 3
            [-500,-500,2000],    // 4
            [500,-500,2000],    // 5
            [500,500,2000],    // 6
            [-500,500,2000],    // 7
        ]);
    const wall: gs.IObj = m.getGeom().addPolymesh([
            [points[0],points[1],points[2],points[3]],
            [points[0],points[4],points[5],points[1]],
            [points[1],points[5],points[6],points[2]],
            [points[2],points[6],points[7],points[3]],
            [points[3],points[7],points[4],points[0]],
            [points[7],points[4],points[5],points[6]],
        ]);

    return m;
}
