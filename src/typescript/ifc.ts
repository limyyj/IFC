import * as gs from "gs-json";
import * as threex from "./libs/threex/threex"

const header: string =
`ISO-10303-21;
HEADER;
FILE_DESCRIPTION(
    ( 'ViewDefinition [model1]'
     ,'Comment [test file]'
    )
    ,'2;1');
FILE_NAME(
    '_test.ifc',
    '2018-02-21T09:00:00',
    ('Undefinrf'),
    ('NUS'),
    'gsjsonIFC',
    'gsjsonIFC',
    'test');
FILE_SCHEMA(('IFC4'));
ENDSEC;

`;

const project: string =
`#100=IFCPROJECT ('00ZhrqZYLBcgy$rVVaiu2A', $, 'IFC Export', $, $, $, $, $, #300);

`;

const owner: string =
`#110= IFCOWNERHISTORY(#111,#115,$,.ADDED.,1320688800,$,$,1320688800);
#111= IFCPERSONANDORGANIZATION(#112,#113,$);
#112= IFCPERSON($,'Lim','Joie',$,$,$,$,$);
#113= IFCORGANIZATION($,'NUS',$,$,$);
#115= IFCAPPLICATION(#113,'1.0','gs-JSON to IFC for Mobius','gsjsonIFC');

`;

const proj_rep: string =
`#201= IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0E-5,#210,$);
#202= IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,#201,$,.MODEL_VIEW.,$);
#203= IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Axis','Model',*,*,*,*,#201,$,.MODEL_VIEW.,$);
#210= IFCAXIS2PLACEMENT3D(#901,$,$);

`;

const units: string =
`#300= IFCUNITASSIGNMENT ((#310, #311, #312, #313));
#310= IFCSIUNIT (*, .LENGTHUNIT., .MILLI., .METRE.);
#311= IFCSIUNIT (*, .AREAUNIT., $, .SQUARE_METRE.);
#312= IFCSIUNIT (*, .VOLUMEUNIT., $, .CUBIC_METRE.);
#313= IFCSIUNIT (*, .TIMEUNIT., $, .SECOND.);

`;

const building: string =
`#500= IFCBUILDING('2FCZDorxHDT8NI01kdXi8P',$,'Test Building',$,$,#511,$,$,.ELEMENT.,$,$,$);
#511= IFCLOCALPLACEMENT($,#512);
#512= IFCAXIS2PLACEMENT3D(#901,$,$);
#519= IFCRELAGGREGATES('2YBqaV_8L15eWJ9DA1sGmT',$,$,$,#100,(#500));

`;

const WCS: string=
`#901= IFCCARTESIANPOINT((0.,0.,0.));
#902= IFCDIRECTION((1.,0.,0.));
#903= IFCDIRECTION((0.,1.,0.));
#904= IFCDIRECTION((0.,0.,1.));
#905= IFCDIRECTION((-1.,0.,0.));
#906= IFCDIRECTION((0.,-1.,0.));
#907= IFCDIRECTION((0.,0.,-1.));

`;
export function createObj(obj: gs.IObj, nums: number[]): string {
    let file: string = "";

    const facecount: number[] = [];
    // Get points for each face
    const points: gs.IPoint[][][] = obj.getPoints();
    const f_points: gs.IPoint[][] = points[1];
    const f_positions: gs.XYZ[][] = f_points.map((f) => f.map((p) => p.getPosition()));
    for (const facepoints of f_positions) {
        const pointcount: number[] = []; // # no. counter

        // Add a point to IFC file, keep track of the # no. of the points
        for (const point of facepoints) {
            file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + point[0] +".," + point[1] + ".," + point[2] + ".));\n";
            pointcount.push(nums[0]);
            nums[0]++;
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
    file += "#" + nums[3] + "= IFCBUILDINGELEMENTPROXY('obj_" + nums[3] + "',$,'obj_" + nums[3]
    + "','obj_" + nums[3] + "',$,#"+ nums[3] + ",#" + counter + ",$,$);\n\n";
    
    return file;
}

export function createWall(obj: gs.IObj, nums: number[]): string {
    let file: string = "";

    // Get unique points
    const points: gs.IPoint[] = obj.getPointsSet();

    // Get lowerpts and upperpts
    const lowerpts: gs.IPoint[] = [points[0],points[0],points[0],points[0]];
    const upperpts: gs.IPoint[] = [points[0],points[0],points[0],points[0]];
    for (const pt of points) {
        if (pt.getPosition()[2] <= lowerpts[0].getPosition()[2]) {
            lowerpts[3] = lowerpts[2];
            lowerpts[2] = lowerpts[1];
            lowerpts[1] = lowerpts[0];
            lowerpts[0] = pt;
        } else {
            upperpts[3] = upperpts[2];
            upperpts[2] = upperpts[1];
            upperpts[1] = upperpts[0];
            upperpts[0] = pt;
        }
    }
    // Calc extrude_dist
    const extrude_dist: number = upperpts[0].getPosition()[2] - lowerpts[0].getPosition()[2];

    // Add points
    const pointcount: number[] = []; // # no. counter
    for (const pt of lowerpts) {
        const coord: number[] = pt.getPosition();
        file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + coord[0] +".," + coord[1] + ".," + coord[2] + ".));\n";
        pointcount.push(nums[0]);
        nums[0]++;
    }

    // Add a polyline to IFC file, using # no. from above
    file += "#" + nums[1] + "= IFCPOLYLINE" + "((";
    for (const p of pointcount) {
            file += "#" + p + ",";
    }
    file += pointcount[0] + "));\n";
    // Convert to area and extrude *********************************************************!! NEED LOCALPLACEMENT (extrude)
    file += "#" + nums[2] + "= IFCARBITRARYCLOSEDPROFILEDEF(.AREA., 'face" + nums[2] + "', #" + nums[1] +");\n";
    file += "#" + nums[3] + "= IFCEXTRUDEAREASOLID(#" + nums[2] + ",#512, #904," + extrude_dist + ");\n";
    nums[1]++;
    nums[2]++;
    nums[3]++;
    // Shape representation for Body
    file += "#" + nums[3] + "= IFCSHAPEREPRESENTATION(#202,'Body','SweptSolid',(#" + (nums[3] - 1) + "));\n";
    nums[3]++;

    // Get pair with shortest dist
    let shortpair: gs.IPoint[] = [lowerpts[0],lowerpts[1]];
    for (let i = 0 ; i < lowerpts.length ; i++) {
        for (let j = i + 1 ; j < lowerpts.length ; j++) {
            if (threex.vectorFromPointsAtoB(lowerpts[i], lowerpts[j]).length() <= threex.vectorFromPointsAtoB(shortpair[0], shortpair[1]).length()) {
                shortpair = [lowerpts[i], lowerpts[j]];
            }
        }
    }
    // Get other pair
    const otherpair: gs.IPoint[] = [];
    for (const pt of lowerpts) {
        if ((pt !== shortpair[0]) && (pt !== shortpair[1])) {
            otherpair.push(pt);
        }
    }

    // Get coordinates of midpoints and construct line
    const x1: number = (shortpair[0].getPosition()[0] + shortpair[1].getPosition()[0])/2;
    const y1: number = (shortpair[0].getPosition()[1] + shortpair[1].getPosition()[1])/2;
    const z1: number = (shortpair[0].getPosition()[2] + shortpair[1].getPosition()[2])/2;
    const x2: number = (otherpair[0].getPosition()[0] + otherpair[1].getPosition()[0])/2;
    const y2: number = (otherpair[0].getPosition()[1] + otherpair[1].getPosition()[1])/2;
    const z2: number = (otherpair[0].getPosition()[2] + otherpair[1].getPosition()[2])/2;
    file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + x1 +".," + y1 + ".," + z1 + ".));\n";
    nums[0]++;
    file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + x2 +".," + y2 + ".," + z2 + ".));\n";
    nums[0]++;
    file += "#" + nums[1] + "= IFCPOLYLINE" + "((" + (nums[0]-2) + "," + (nums[0]-1) + "));\n";
    nums[1]++;
    // Shape representation for Axis
    file += "#" + nums[3] + "= IFCSHAPEREPRESENTATION(#203,'Axis','Curve2D',(#" + (nums[1] - 1) + "));\n";
    nums[3]++;

    // Define wall
    file += "#" + nums[3] + "= IFCPRODUCTDEFINITIONSHAPE($,$,(#" + (nums[3]-2) + "," + (nums[3]-1) + "));\n";
    nums[3]++;
    file += "#" + nums[3] + "= IFCWALLSTANDARDCASE('0ZSjmOcYr8ww8iEjFQxGMf',$,'wall" + nums[3] + "',$,$,$,#" + "," + (nums[3]-1) + ",'wall" + nums[3] + "');\n\n";

    return file;
}








export function gsjson2ifc(model: gs.IModel): string {
    // Initialise headers and start, initialise counters
    let file: string = header + "DATA;\n" + project + owner + proj_rep + units + building + WCS;
    let nums: number[] = [1000, 2000, 3000, 4000, 10000]
    const objcount: number[] = [];
    // const eattribs: gs.IEntAttrib[] = model.getAllEntAttribs();
    // const tattribs: gs.ITopoAttrib[] = model.getAllTopoAttribs();
    // const groups: gs.IGroup[] = model.getAllGroups();
    
    // Get Element_Type attrib
    const element_type: gs.IEntAttrib = model.getEntAttrib("Element_Type", gs.EGeomType.objs)
    // Get all objects
    const objs: gs.IObj[] = model.getGeom().getAllObjs();
    
    for (const obj of objs) {
        if (obj.getAttribValue(element_type) == "Wall") {
        // Generate string for creating a wall and add to file
            let addobj: string = createWall(obj, nums);
            file += addobj
        } else {
        // Generate string for creating an object and add to file
            let addobj: string = createObj(obj, nums);
            file += addobj;
        }

        // Update objcount and objnum
        objcount.push(nums[3]);
        nums[3] ++;
    }

    // Assign objects to building
    for (const o of objcount) {
         file += "#" + nums[4] + "=IFCRELCONTAINEDINSPATIALSTRUCTURE('assign_" + nums[4] +
         "',$,'Physical model',$,(#" + (nums[3]-1) + "),#500);\n";
         nums[4] ++;
    }

    file += "ENDSEC;\nEND-ISO-10303-21;";
    return file;
}
