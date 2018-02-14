import * as gs from "gs-json";
import * as test from "./xform";

export function test_transfromXYZ() {
    const xyz_list: gs.XYZ[] = [[1,2,3],[4,5,6]];
    const from_origin: gs.XYZ = [1,1,1];
    const from_vectors: gs.XYZ[] = [[1,1,0], [-1,1,0]];
    const to_origin: gs.XYZ = [8,7,6];
    const to_vectors: gs.XYZ[] = [[1,0,1], [-1,0,1]];
    test.xfromXYZ(xyz_list, from_origin, from_vectors, to_origin, to_vectors);
    return true;
}
