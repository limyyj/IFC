import * as gs from "gs-json";

const header: string =
`
ISO-10303-21;

HEADER;
FILE_DESCRIPTION(
    ( 'ViewDefinition [model1]'
     ,'Comment [test file]'
    )
    ,'2;1');
FILE_NAME(
    '_test.ifc',
    '2018-02-21T09:00:00',
    ('Joie Lim'),
    ('NUS'),
    'gsjsonIFC',
    'gsjsonIFC',
    'test');
FILE_SCHEMA(('IFC4'));
ENDSEC;

`;

const project: string =
`#100=IFCPROJECT ("00ZhrqZYLBcgy$rVVaiu2A", $, "IFC Export", $, $, $, $, $, #300);

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

export function gsjson2ifc(model: gs.IModel): string {
    let file: string = header + "DATA;\n" + project + owner + proj_rep + units + building + WCS;
    let pointnum: number = 1000;
    let wirenum: number = 2000;
    let facenum: number = 3000;
    let objnum: number = 4000;
    let assignnum: number = 10000;
    const objcount: number[] = [];
    file += String(model);
    const eattribs: gs.IEntAttrib[] = model.getAllEntAttribs();
    const tattribs: gs.ITopoAttrib[] = model.getAllTopoAttribs();
    const groups: gs.IGroup[] = model.getAllGroups();
    const objs: gs.IObj[] = model.getGeom().getAllObjs();
    for (const obj of objs) {
        const facecount: number[] = [];
        // Get points for each face
        const points: gs.IPoint[][][] = obj.getPoints();
        const f_points: gs.IPoint[][] = points[1];
        const f_positions: gs.XYZ[][] = f_points.map((f) => f.map((p) => p.getPosition()));
        for (const facepoints of f_positions) {
            const pointcount: number[] = []; // # no. counter

            // Add a point to IFC file, keep track of the # no. of the points
            for (const point of facepoints) {
                file += "#" + pointnum + "= IFCCARTESIANPOINT" + "((" + point[0] +".," + point[1] + ".," + point[2] + ".));\n";
                pointcount.push(pointnum);
                pointnum++;
            }
            // Add a polyline to IFC file, using # no. from above
            file += "#" + wirenum + "= IFCPOLYLOOP" + "((";
            for (let p = 0; p < pointcount.length; p++) {
                if (p !== pointcount.length - 1) {
                    file += "#" + pointcount[p] + ",";
                } else {
                    file += "#" + pointcount[p];
                }
            }
            file += "));\n";

            // Add face from polyline, keep track of # no. of the faces
            file += "#" + (wirenum + 1) + "= IFCFACEOUTERBOUND" + "(#" + wirenum + ".,T.);\n";
            file += "#" + facenum + "= IFCFACE" + "(#" + (wirenum + 1) + ".,T.);\n\n";
            facecount.push(facenum);

            wirenum += 2;
            facenum ++;
         }
         
        // Add brep to IFC file, using # no. from above (facecount), keep track of # no. (counter)
        file += "#" + objnum + "= IFCCLOSEDSHELL ((";
        objnum ++;
        for (let f = 0; f < facecount.length; f++) {
            if (f !== facecount.length - 1) {
                file += "#" + facecount[f] + ",";
            } else {
                file += "#" + facecount[f];
            }
        }
        file += "));\n";
        file += "#" + objnum + "= IFCFACETEDBREP (#" + (objnum-1) +");\n";
        objnum ++;
        file += "#" + objnum + "= IFCSHAPEREPRESENTATION(#202,'Body','Brep',(#" + (objnum-1) + "));\n";
        objnum ++;
        file += "#" + objnum + "= IFCPRODUCTDEFINITIONSHAPE($,$,(#" + (objnum-1) + "));\n";
        let counter = objnum;
        objnum ++;

        // Add proxy element to IFC file, using # no. from above (counter), keep track of # no. (objcount)
        file += "#" + objnum + "= IFCAXIS2PLACEMENT3D(#901,$,$);\n";
        objnum ++;
        file += "#" + objnum + "= IFCLOCALPLACEMENT(#511,#" + (objnum-1) + ");\n";
        objnum ++;
        file += "#" + objnum + "= IFCBUILDINGELEMENTPROXY('obj_" + objnum + "',$,'obj_" + objnum
        + "','obj_" + objnum + "',$,#"+ objnum + ",#" + counter + ",$,$);\n\n";
        objcount.push(objnum);
        objnum ++;

        // const value = obj.getAttribValue(eattribs[0]);
    }

    // Assign objects to building
    for (const o of objcount) {
         file += "#" + assignnum + "=IFCRELCONTAINEDINSPATIALSTRUCTURE('assign_" + assignnum +
         "',$,'Physical model',$,(#" + o + "),#500);\n";
         assignnum ++;
    }
    file += "ENDSEC;\n\nEND-ISO-10303-21;";
    return file;
}
