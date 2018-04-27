import {writeStrToFile} from "../libs/filesys/filesys";
import * as gs from "gs-json";
import * as ifc from "../ifc";
import * as models_ifc from "./models_ifc";

/**
 * Execute using NPM, models get saved in the /src/assets/ folder.
 * 1) "npm run build_three_models" OR
 * 2) "npm run build_models" (which builds both three and gs)
 */

const path: string = "../IFC/src/assets/ifc/";

if(require.main === module)  {
    console.log("IFC files...");
    const model: gs.IModel = models_ifc.genModelTestWall();
    const ifc_str: string = ifc.gsjson2ifc(model);
    writeStrToFile(ifc_str, path + "_testWall.ifc");
}

if(require.main === module)  {
    console.log("IFC files...");
    const model: gs.IModel = models_ifc.genModelTestSlab();
    const ifc_str: string = ifc.gsjson2ifc(model);
    writeStrToFile(ifc_str, path + "_testSlab.ifc");
}

if(require.main === module)  {
    console.log("IFC files...");
    const model: gs.IModel = models_ifc.genModelTestWallSlab();
    const ifc_str: string = ifc.gsjson2ifc(model);
    writeStrToFile(ifc_str, path + "_testWallSlab.ifc");
}

if(require.main === module)  {
    console.log("IFC files...");
    const model: gs.IModel = models_ifc.genModelTestWall2();
    const ifc_str: string = ifc.gsjson2ifc(model);
    writeStrToFile(ifc_str, path + "_testWallSlab2.ifc");
}

if(require.main === module)  {
    console.log("IFC files...");
    const model: gs.IModel = models_ifc.genModelTestObj();
    const ifc_str: string = ifc.gsjson2ifc(model);
    writeStrToFile(ifc_str, path + "_test.ifc");
}