import * as gs from "gs-json";
import * as threex from "./libs/threex/threex";
import * as func from "./ifcfunc";

export function createObj(obj: gs.IObj, nums: number[]): string {
    let file: string = "";

    const points: gs.IPoint[] = obj.getPointsSet();
    let pointshash: number[] = [];
    file += func.writePoints3D(points, pointshash, nums);

    const facecount: number[] = [];
    // Get points for each face
    const allpoints: gs.IPoint[][][] = obj.getPoints();
    const f_points: gs.IPoint[][] = allpoints[1];
    for (const face of f_points) {
        // Check for same point in lowerpts and take its # number
        const pointcount: number[] = []; // # no. counter
        for (const pt of face) {
            pointcount.push(func.getPointHash(pt, points, pointshash));
        }
        
        // Add a polyline to IFC file, using # no. from above
        file += "#" + nums[1] + "= IFCPOLYLOOP" + "((";
        for (let p = 0; p < pointcount.length; p++) {
            if (p !== pointcount.length - 1) {
                file += "#" + pointcount[p] + ",";
            } else {
                file += "#" + pointcount[p];
            }
        }
        file += "));\n";

        // Add face from polyline, keep track of # no. of the faces
        file += "#" + (nums[1] + 1) + "= IFCFACEOUTERBOUND" + "(#" + nums[1] + ",.T.);\n";
        file += "#" + nums[2] + "= IFCFACE" + "((#" + (nums[1] + 1) + "));\n\n";
        facecount.push(nums[2]);

        nums[1] += 2;
        nums[2] ++;
     }

    // Add brep to IFC file, using # no. from above (facecount), keep track of # no. (counter)
    file += "#" + nums[3] + "= IFCCLOSEDSHELL ((";
    nums[3] ++;
    for (let f = 0; f < facecount.length; f++) {
        if (f !== facecount.length - 1) {
            file += "#" + facecount[f] + ",";
        } else {
            file += "#" + facecount[f];
        }
    }
    file += "));\n";
    file += "#" + nums[3] + "= IFCFACETEDBREP (#" + (nums[3]-1) +");\n";
    nums[3] ++;
    file += "#" + nums[3] + "= IFCSHAPEREPRESENTATION(#202,'Body','Brep',(#" + (nums[3]-1) + "));\n";
    nums[3] ++;
    file += "#" + nums[3] + "= IFCPRODUCTDEFINITIONSHAPE($,$,(#" + (nums[3]-1) + "));\n";
    let counter = nums[3];
    nums[3] ++;

    // Add proxy element to IFC file, using # no. from above (counter), keep track of # no. (objcount)
    file += "#" + nums[3] + "= IFCAXIS2PLACEMENT3D(#901,$,$);\n";
    nums[3] ++;
    file += "#" + nums[3] + "= IFCLOCALPLACEMENT(#511,#" + (nums[3]-1) + ");\n";
    nums[3] ++;
    file += "#" + nums[3] + "= IFCBUILDINGELEMENTPROXY('" + func.AddGUID() + "',$,'obj_" + nums[3]
    + "','obj_" + nums[3] + "',$,#"+ (nums[3] - 1) + ",#" + counter + ",$,$);\n\n";
    file += "#" + nums[4] + "= IFCRELCONTAINEDINSPATIALSTRUCTURE('assign_" + nums[4] +
            "',$,'Physical model',$,(#" + nums[3] + "),#500);\n\n";
    nums[3] ++;
    nums[4] ++;
    return file;
}

export function createWall(obj: gs.IObj, nums: number[]): string {
    let file: string = "";

    // Get and sort unique points
    let lowerpts: gs.IPoint[] = [];
    let upperpts: gs.IPoint[] = [];
    func.sortlowerupper(obj, lowerpts, upperpts);

    // Calc extrude_dist
    const baseheight: number = lowerpts[0].getPosition()[2];
    const extrude_dist: number = upperpts[0].getPosition()[2] - baseheight;

    // Set local placement origin at [0,0,baseheight]
    file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((0.,0.," + baseheight + ".));\n";
    file += "#" + nums[4] + "= IFCAXIS2PLACEMENT3D(#" + nums[0] + ",#904,#902);\n";
    file += "#" + (nums[4] + 1) + "= IFCLOCALPLACEMENT(#511,#" + nums[4] + ");\n\n";
    nums[0]++;
    nums[4]++;

    // Add points and store # in order
    const pointshash: number[] = []; // # no. counter
    file += func.writePoints2D(lowerpts, pointshash, nums);

    // Get points for each face
    const allpts: gs.IPoint[][][] = obj.getPoints();
    const f_points: gs.IPoint[][] = allpts[1];
    for (const face of f_points) {
        // If not all points' z coord == baseheight, its a higher face, skip curr face
        let lower: number = 1;
        for (const pt of face) {
            if (pt.getPosition()[2] !== baseheight) {
                lower = 0;
                break;
            }
        }
        if (lower === 0) {
            continue;
        }

        if (face.length == 4) {
            // Check for same point in lowerpts and take its # number
            const pointcount: number[] = [];
            for (const pt of face) {
                pointcount.push(func.getPointHash(pt, lowerpts, pointshash));
            }

            // Created extruded shape and centre line
            file += func.writeSweptSolid(pointcount, extrude_dist, nums);
            file += func.writeCentreline(face, nums);

            // Define wall
            file += "#" + nums[3] + "= IFCPRODUCTDEFINITIONSHAPE($,$,(#" + (nums[3]-2) + ",#" + (nums[3]-1) + "));\n";
            nums[3]++;
            file += "#" + nums[3] + "= IFCWALLSTANDARDCASE('" + func.AddGUID() + "',$,'wall" + nums[3] + "',$,$,#" + nums[4] + ",#" + (nums[3]-1) + ",'wall" + nums[3] + "');\n";
            nums[4]++;

            file += "#" + nums[4] + "= IFCRELCONTAINEDINSPATIALSTRUCTURE('assign_" + nums[4] +
                    "',$,'Physical model',$,(#" + nums[3] + "),#500);\n\n";
            nums[3] ++;
            nums[4] ++;
        } else if (face.length > 4) {
            // Get pair with shortest dist
            let shortpair: number[] = [0,1];
            for (let i = 0 ; i < face.length ; i++) {
                for (let j = i + 1 ; j < face.length ; j++) {
                    if (threex.vectorFromPointsAtoB(face[i], face[j]).length() <= threex.vectorFromPointsAtoB(face[shortpair[0]],face[shortpair[1]]).length()) {
                        shortpair = [i, j];
                    }
                }
            }

            for (let i = 0 ; i < ((face.length - 2) / 2) ; i ++) {
                // Get new numbers
                let p1 = shortpair[0];
                let p2 = shortpair[0] - 1;
                let p3 = shortpair[1] + 1;
                let p4 = shortpair[1];
                
                // Shift numbers if out of range or overlap with other
                if (p2 < 0) {
                    p2 = face.length - 1;
                }
                if (p2 == p4) {
                    p2 -= 1;
                }
                if (p3 > face.length - 1) {
                    p3 = 0;
                }
                if (p3 == p1) {
                    p3 -= 1;
                }

                // Get points for current wall segment
                let currpoints: gs.IPoint[] = [face[p1], face[p2], face[p3], face[p4]];
                
                // Replace numbers with new numbers
                shortpair[0] = p2;
                shortpair[1] = p3;

                // Check for same point in lowerpts and take its # number
                const pointcount: number[] = [];
                for (const pt of currpoints) {
                    pointcount.push(func.getPointHash(pt, lowerpts, pointshash));
                }

                // Created extruded shape and centre line
                file += func.writeSweptSolid(pointcount, extrude_dist, nums);
                file += func.writeCentreline(currpoints, nums);

                // Define wall
                file += "#" + nums[3] + "= IFCPRODUCTDEFINITIONSHAPE($,$,(#" + (nums[3]-2) + ",#" + (nums[3]-1) + "));\n";
                nums[3]++;
                file += "#" + nums[3] + "= IFCWALLSTANDARDCASE('" + func.AddGUID() + "',$,'wall" + nums[3] + "',$,$,#" + nums[4] + ",#" + (nums[3]-1) + ",'wall" + nums[3] + "');\n";
                nums[4]++;

                file += "#" + nums[4] + "= IFCRELCONTAINEDINSPATIALSTRUCTURE('assign_" + nums[4] +
                        "',$,'Physical model',$,(#" + nums[3] + "),#500);\n\n";
                nums[3] ++;
                nums[4] ++;
            }
        }
    }
    return file;
}

export function createSlab(obj: gs.IObj, nums: number[]): string {
    let file: string = "";

    // Get unique points
    const points: gs.IPoint[] = obj.getPointsSet();

    // Get lowerpts and upperpts
    let lowerpts: gs.IPoint[] = [];
    let upperpts: gs.IPoint[] = [];
    func.sortlowerupper(obj, lowerpts, upperpts);

    // Calc extrude_dist
    const baseheight: number = lowerpts[0].getPosition()[2];
    const extrude_dist: number = upperpts[0].getPosition()[2] - baseheight;

    // Set local placement origin at [0,0,0]
    file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((0.,0.,0.));\n";
    file += "#" + nums[4] + "= IFCAXIS2PLACEMENT3D(#" + nums[0] + ",#904, #902);\n";
    file += "#" + (nums[4] + 1) + "= IFCLOCALPLACEMENT(#511,#" + nums[4] + ");\n";
    nums[0]++;
    nums[4]++;

    // Add points
    const pointshash: number[] = []; // # no. counter
    file += func.writePoints2D(lowerpts, pointshash, nums);

    const allpts: gs.IPoint[][][] = obj.getPoints();
    const f_points: gs.IPoint[][] = allpts[1];
    for (const face of f_points) {
        // If not all points' z coord == baseheight, its a higher face, skip curr face
        let lower: number = 1;
        for (const pt of face) {
            if (pt.getPosition()[2] !== baseheight) {
                lower = 0;
                break;
            }
        }
        if (lower === 0) {
            continue;
        }

        // Check for same point in lowerpts and take its # number
        const pointcount: number[] = [];
        for (const pt of face) {
            pointcount.push(func.getPointHash(pt, lowerpts, pointshash));
        }

        // Created extruded shape and centre line
        file += func.writeSweptSolid(pointcount, extrude_dist, nums);

        // Define wall
        file += "#" + nums[3] + "= IFCPRODUCTDEFINITIONSHAPE($,$,(#" + (nums[3]-2) + ",#" + (nums[3]-1) + "));\n";
        nums[3]++;
        file += "#" + nums[3] + "= IFCSLAB('" + func.AddGUID() + "',$,'slab" + nums[3] + "',$,$,#" + nums[4] + ",#" + (nums[3]-1) + ",'slab" + nums[3] + "',.FLOOR.);\n\n";
        nums[4]++;

        file += "#" + nums[4] + "= IFCRELCONTAINEDINSPATIALSTRUCTURE('assign_" + nums[4] +
                "',$,'Physical model',$,(#" + nums[3] + "),#500);\n\n";
        nums[3] ++;
        nums[4] ++;
    }       
    return file;
}

export function gsjson2ifc(model: gs.IModel): string {
    // Initialise headers and start, initialise counters
    let file: string = func.AddHeader();

    let nums: number[] = [1000, 2000, 3000, 4000, 5000];

    // Get Element_Type attrib
    const element_type: gs.IEntAttrib = model.getEntAttrib("Element_Type", gs.EGeomType.objs);
    // Get all objects
    const objs: gs.IObj[] = model.getGeom().getAllObjs();

    for (const obj of objs) {
        if (obj.getAttribValue(element_type) === "Wall") {
        // Generate string for creating a wall and add to file
            let addobj: string = createWall(obj, nums);
            file += addobj;
        } else if (obj.getAttribValue(element_type) === "Slab") {
            let addobj: string = createSlab(obj, nums);
            file += addobj;
        } else {
        // Generate string for creating an object and add to file
            let addobj: string = createObj(obj, nums);
            file += addobj;
        }
    }

    file += "ENDSEC;\nEND-ISO-10303-21;";
    return file;
}
