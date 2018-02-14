import * as gs from "gs-json";

// const header: string = "...";

// const project: string =
// `#100=IFCPROJECT ("00ZhrqZYLBcgy$rVVaiu2A", $, "IFC Export", $, $, $, $, $, #300);`;

// const owner: string =
// `#110= IFCOWNERHISTORY(#111,#115,$,.ADDED.,1320688800,$,$,1320688800);
// #111= IFCPERSONANDORGANIZATION(#112,#113,$);
// #112= IFCPERSON($,'Lim','Joie',$,$,$,$,$);
// #113= IFCORGANIZATION($,'NUS',$,$,$);
// #115= IFCAPPLICATION(#113,'1.0','gs-JSON to IFC for Mobius','gsjsonIFC');`;

// const proj_rep: string =
// `#201= IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0E-5,#210,$);
// #202= IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,#201,$,.MODEL_VIEW.,$);
// #210= IFCAXIS2PLACEMENT3D(#901,$,$);`;

// const units: string =
// `#300=IFCUNITASSIGNMENT ((#310, #311, #312, #313));
// #310=IFCSIUNIT (*, .LENGTHUNIT., .MILLI., .METRE.);
// #311=IFCSIUNIT (*, .AREAUNIT., $, .SQUARE_METRE.);
// #312=IFCSIUNIT (*, .VOLUMEUNIT., $, .CUBIC_METRE.);
// #313=IFCSIUNIT (*, .TIMEUNIT., $, .SECOND.);`;

export function gsjson2ifc(model: gs.IModel): string {
    // const eattribs: gs.IEntAttrib[] = model.getAllEntAttribs();
    // const tattribs: gs.ITopoAttrib[] = model.getAllTopoAttribs();
    // const groups: gs.IGroup[] = model.getAllGroups();
    // const objs: gs.IObj[] = model.getGeom().getAllObjs();
    // for (const obj of objs) {
    //     obj.getFaces();
    //     const points: gs.IPoint[][][] = obj.getPoints();
    //     const f_points: gs.IPoint[][] = points[1];
    //     const f_positions: gs.XYZ[][] = f_points.map((f) => f.map((p) => p.getPosition()));
    //     const value = obj.getAttribValue(eattribs[0]);
    // }
    return "empty";
}
