import * as gs from "gs-json";
import * as threex from "./libs/threex/threex";

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
    '` + new Date().getTime() + `',
    ('Undefined'),
    ('NUS'),
    'gsjsonIFC',
    'gsjsonIFC',
    'test');
FILE_SCHEMA(('IFC2X3'));
ENDSEC;

`;

const project: string =
`#100=IFCPROJECT ('` + AddGUID() + `', $, 'IFC Export', $, $, $, $, $, #300);

`;

const owner: string =
`#110= IFCOWNERHISTORY(#111,#115,$,.ADDED.,1320688800,$,$,1320688800);
#111= IFCPERSONANDORGANIZATION(#112,#113,$);
#112= IFCPERSON($,'Undefined','Undefined',$,$,$,$,$);
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
`#500= IFCBUILDING('` + AddGUID() + `',$,'Test Building',$,$,#511,$,$,.ELEMENT.,$,$,$);
#511= IFCLOCALPLACEMENT($,#512);
#512= IFCAXIS2PLACEMENT3D(#901,$,$);
#519= IFCRELAGGREGATES('` + AddGUID() + `',$,$,$,#100,(#500));

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

export function AddGUID(): string {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function AddHeader(): string {
    let file: string = "";
    file += header + "DATA;\n" + project + owner + proj_rep + units + building + WCS;
    return file;
}

export function sortlowerupper(obj: gs.IObj, lowerpts: gs.IPoint[], upperpts: gs.IPoint[]): void {
    // Get unique points
    const points: gs.IPoint[] = obj.getPointsSet();

    // Get lowerpts and upperpts
    const pts1: gs.IPoint[] = [];
    const pts2: gs.IPoint[] = [];
    pts1.push(points[0]);
    for (let i = 1 ; i < points.length ; i ++) {
        if (points[i].getPosition()[2] === pts1[0].getPosition()[2]) {
            pts1.push(points[i]);
        } else {
            pts2.push(points[i]);
        }
    }

    if (pts1[0].getPosition()[2] < pts2[0].getPosition()[2]) {
        lowerpts.push(...pts1);
        upperpts.push(...pts2);
    } else {
        lowerpts.push(...pts2);
        upperpts.push(...pts1);
    }
}

export function writePoints2D(lowerpts: gs.IPoint[], pointshash: number[], nums: number[]): string {
    let file: string = "";
    for (const pt of lowerpts) {
        const coord: number[] = pt.getPosition();
        file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + coord[0] + ".," + coord[1] + ".));\n";
        pointshash.push(nums[0]);
        nums[0]++;
    }
    file += "\n";
    return file;
}

export function writePoints3D(lowerpts: gs.IPoint[], pointshash: number[], nums: number[]): string {
    let file: string = "";
    for (const pt of lowerpts) {
        const coord: number[] = pt.getPosition();
        file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + coord[0] + ".," + coord[1] + ".," + coord[2] + ".));\n";
        pointshash.push(nums[0]);
        nums[0]++;
    }
    file += "\n";
    return file;
}

export function checkPointsSame(pt1: number[], pt2: number[]): number {
    for (let i = 0 ; i < 3 ; i++) {
        if (pt1[i] !== pt2[i]) {
            return 0;
        }
    }
    return 1;
}

export function getPointHash(pt1: gs.IPoint, ptlist: gs.IPoint[], pointshash: number[]): number {
    let hash: number = 0;

    const pt1xyz: number[] = pt1.getPosition();
    for (let p = 0 ; p < ptlist.length ; p++) {
        const lpxyz: number[] = ptlist[p].getPosition();
        if (checkPointsSame(pt1xyz,lpxyz)) {
            hash = pointshash[p];
            return hash;
        }
    }
}

export function writeSweptSolid(pointcount: number[], extrude_dist: number, nums: number[]): string {
    let file: string = "";
    // Add a polyline to IFC file, using # no. from above
    file += "#" + nums[1] + "= IFCPOLYLINE" + "((";
    for (const p of pointcount) {
            file += "#" + p + ",";
    }
    file += "#" + pointcount[0] + "));\n";
    // Convert to area and extrude
    file += "#" + nums[2] + "= IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,'face" + nums[2] + "',#" + nums[1] +");\n";
    file += "#" + nums[3] + "= IFCEXTRUDEDAREASOLID(#" + nums[2] + ",#" + (nums[4]-1) +",#904," + extrude_dist + ".);\n";
    nums[1]++;
    nums[2]++;
    nums[3]++;
    // Shape representation for Body
    file += "#" + nums[3] + "= IFCSHAPEREPRESENTATION(#202,'Body','SweptSolid',(#" + (nums[3] - 1) + "));\n";
    nums[3]++;
    return file;
}

export function writeCentreline(points: gs.IPoint[], nums: number[]): string {
    let file: string = "";
    // Get pair with shortest dist
    let shortpair: gs.IPoint[] = [points[0],points[1]];
    for (let i = 0 ; i < points.length ; i++) {
        for (let j = i + 1 ; j < points.length ; j++) {
            if (threex.vectorFromPointsAtoB(points[i], points[j]).length() <= threex.vectorFromPointsAtoB(shortpair[0],shortpair[1]).length()) {
                shortpair = [points[i], points[j]];
            }
        }
    }
   
    let otherpair: gs.IPoint[] = [];
    // Get other pair
    for (const pt of points) {
        if ((pt !== shortpair[0]) && (pt !== shortpair[1])) {
            otherpair.push(pt);
        }
    }

    // Get coordinates of midpoints and construct line
    const x1: number = ((shortpair[0].getPosition()[0] + shortpair[1].getPosition()[0])/2);
    const y1: number = ((shortpair[0].getPosition()[1] + shortpair[1].getPosition()[1])/2);
    const x2: number = ((otherpair[0].getPosition()[0] + otherpair[1].getPosition()[0])/2);
    const y2: number = ((otherpair[0].getPosition()[1] + otherpair[1].getPosition()[1])/2);
    file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + x1 +".," + y1 + ".));\n";
    nums[0]++;
    file += "#" + nums[0] + "= IFCCARTESIANPOINT" + "((" + x2 +".," + y2 + ".));\n";
    nums[0]++;
    file += "#" + nums[1] + "= IFCPOLYLINE" + "((#" + (nums[0]-2) + ",#" + (nums[0]-1) + "));\n";
    nums[1]++;
    // Shape representation for Axis
    file += "#" + nums[3] + "= IFCSHAPEREPRESENTATION(#203,'Axis','Curve2D',(#" + (nums[1] - 1) + "));\n";
    nums[3]++;
    return file;
}
