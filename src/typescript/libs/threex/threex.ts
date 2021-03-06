import * as gs from "gs-json";
import * as three from "three";
import {Arr} from "../arr/arr";

/**
 * Utility functions for threejs.
 */

const EPS: number = 1e-6;

 // Matrices ======================================================================================================

export function multVectorMatrix(v: three.Vector3, m: three.Matrix4): three.Vector3 {
    const v2: three.Vector3 = v.clone();
    v2.applyMatrix4(m);
    return v2;
}

export function xformMatrixPointXYZs(o: gs.IPoint, vecs: gs.XYZ[]): three.Matrix4 {
    return xformMatrix(new three.Vector3(...o.getPosition()),
        new three.Vector3(...vecs[0]), new three.Vector3(...vecs[1]));
    // return xformMatrix(new three.Vector3(...o.getPosition()),
    //     new three.Vector3(...vecs[0]), new three.Vector3(...vecs[1]), new three.Vector3(...vecs[2]));
}

// export function xformMatrix(o: three.Vector3, x: three.Vector3, y: three.Vector3, z: three.Vector3): three.Matrix4 {
export function xformMatrix(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
    const m1: three.Matrix4 = new three.Matrix4();
    const o_neg: three.Vector3 = o.clone().negate();
    m1.setPosition(o_neg);
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x.normalize(), y.normalize(), crossVectors(x,y,true));
    //m2.makeBasis(x, y, z);
    m2.getInverse(m2);
    const m3: three.Matrix4 = new three.Matrix4();
    m3.multiplyMatrices(m2, m1);
    return m3;
}

// get the inverse of a matrix
export function matrixInverse(m: three.Matrix4): three.Matrix4 {
    const m_inv: three.Matrix4 = new three.Matrix4();
    return m_inv.getInverse(m);
}

//  Vectors =======================================================================================================

export function orthoVectors(vector1: three.Vector3, vector2: three.Vector3): three.Vector3 {
    return crossVectors(vector1, vector2).cross(vector1);
}

export function vectorNegate(vector: three.Vector3): three.Vector3 {
    return vector.clone().negate();
}

export function vectorFromVertex(vertex: gs.IVertex): three.Vector3 {
    return new three.Vector3(...vertex.getPoint().getPosition());
}

export function vectorFromPoint(point: gs.IPoint): three.Vector3 {
    return new three.Vector3(...point.getPosition());
}

export function vectorsFromVertices(vertices: gs.IVertex[]): three.Vector3[] {
    return vertices.map((v) => new three.Vector3(...v.getPoint().getPosition()));
}

export function vectorsFromPoints(points: gs.IPoint[]): three.Vector3[] {
    return points.map((p) => new three.Vector3(...p.getPosition()));
}

export function subVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.subVectors(v1, v2);
    if (norm) {v3.normalize();}
    return v3;
}

export function addVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.addVectors(v1, v2);
    if (norm) {v3.normalize();}
    return v3;
}

export function crossVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.crossVectors(v1, v2);
    if (norm) {v3.normalize();}
    return v3;
}

export function dotVectors(v1: three.Vector3, v2: three.Vector3): number {
    return v1.dot(v2);
}

export function vectorFromPointsAtoB(a: gs.IPoint, b: gs.IPoint, norm: boolean = false): three.Vector3 {
    const v: three.Vector3 = subVectors(new three.Vector3(...b.getPosition()),
        new three.Vector3(...a.getPosition()));
    if (norm) {v.normalize();}
    return v;
}

export function vectorFromVerticesAtoB(a: gs.IVertex, b: gs.IVertex, norm: boolean = false): three.Vector3 {
    const v: three.Vector3 = subVectors(new three.Vector3(...b.getPoint().getPosition()),
        new three.Vector3(...a.getPoint().getPosition()));
    if (norm) {v.normalize();}
    return v;
}

//  XYZ ===========================================================================================================

export function subXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ, norm: boolean = false): gs.XYZ {
    return subVectors(new three.Vector3(...xyz1), new three.Vector3(...xyz2), norm).toArray() as gs.XYZ;
}

export function addXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ, norm: boolean = false): gs.XYZ {
    return addVectors(new three.Vector3(...xyz1), new three.Vector3(...xyz2), norm).toArray() as gs.XYZ;
}

export function crossXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ, norm: boolean = false): gs.XYZ {
    return crossVectors(new three.Vector3(...xyz1), new three.Vector3(...xyz2), norm).toArray() as gs.XYZ;
}

export function dotXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ): number {
    return new three.Vector3(...xyz1).dot(new three.Vector3(...xyz2));
}

export function normalizeXYZ(xyz: gs.XYZ): gs.XYZ {
    return new three.Vector3(...xyz).normalize().toArray() as gs.XYZ;
}

export function lengthXYZ(xyz: gs.XYZ): number {
    return new three.Vector3(...xyz).length();
}

//  Points ========================================================================================================

export function subPoints(p1: gs.IPoint, p2: gs.IPoint, norm: boolean = false): gs.XYZ  {
    return subVectors(new three.Vector3(...p1.getPosition()),
        new three.Vector3(...p2.getPosition()), norm).toArray() as gs.XYZ;
}

export function addPoints(p1: gs.IPoint, p2: gs.IPoint, norm: boolean = false): gs.XYZ  {
    return addVectors(new three.Vector3(...p1.getPosition()),
        new three.Vector3(...p2.getPosition()), norm).toArray() as gs.XYZ;
}

export function addPointXYZ(p1: gs.IPoint, xyz_vec: gs.XYZ): gs.XYZ {
    return (new three.Vector3(...p1.getPosition()).add(new three.Vector3(...xyz_vec))).toArray() as gs.XYZ;
}

export function subPointXYZ(p1: gs.IPoint, xyz_vec: gs.XYZ): gs.XYZ {
    return (new three.Vector3(...p1.getPosition()).sub(new three.Vector3(...xyz_vec))).toArray() as gs.XYZ;
}

export function movePointsAddXYZ(points: gs.IPoint[]|gs.IPoint[][], xyz_vec: gs.XYZ): void {
    const vec: three.Vector3 = new three.Vector3(...xyz_vec);
    const points_flat: gs.IPoint[] = Arr.flatten(points);
    const point_ids: number[] = [];
    const points_no_dups: gs.IPoint[] = [];
    for (const point of points_flat) {
        if (point_ids.indexOf(point.getID()) === -1) {
            points_no_dups.push(point);
            point_ids.push(point.getID());
        }
    }
    for (const point of points_no_dups) {
        const xyz_point: gs.XYZ = (new three.Vector3(...point.getPosition()).add(vec)).toArray() as gs.XYZ;
        point.setPosition(xyz_point);
    }
}

//  Vertices ======================================================================================================

export function subVertices(v1: gs.IVertex, v2: gs.IVertex, norm: boolean = false): gs.XYZ  {
    return subVectors(new three.Vector3(...v1.getPoint().getPosition()),
        new three.Vector3(...v2.getPoint().getPosition()), norm).toArray() as gs.XYZ;
}

export function addVertices(v1: gs.IVertex, v2: gs.IVertex, norm: boolean = false): gs.XYZ  {
    return addVectors(new three.Vector3(...v1.getPoint().getPosition()),
        new three.Vector3(...v2.getPoint().getPosition()), norm).toArray() as gs.XYZ;
}

//  3D to 2D ======================================================================================================

/**
 * Transform a set of vertices in 3d space onto the xy plane. This function assumes that the vertices
 * are co-planar. Returns a set of three Vectors that represent points on the xy plane.
 */
export function makeVertices2D(vertices: gs.IVertex[]): three.Vector3[] {
    const points: three.Vector3[] = vectorsFromVertices(vertices);
    const o: three.Vector3 = new three.Vector3();
    for (const v of points) {
        o.add(v);
    }
    o.divideScalar(points.length);
    let vx: three.Vector3;
    let vz: three.Vector3;
    let got_vx = false;
    for (let i=0;i<vertices.length;i++) {
        if (!got_vx) {
            vx =  subVectors(points[i], o).normalize();
            if (vx.lengthSq() !== 0) {got_vx = true;}
        } else {
            vz = crossVectors(vx, subVectors(points[i],o).normalize()).normalize();
            if (vz.lengthSq() !== 0) {break;}
        }
        if (i === vertices.length - 1) {throw new Error("Trinagulation found bad face.");}
    }
    const vy: three.Vector3 =  crossVectors(vz, vx);
    const m: three.Matrix4 = xformMatrix(o, vx, vy);
    // const m: three.Matrix4 = xformMatrix(o, vx, vy, vz);
    const points_2d: three.Vector3[] = points.map((v) => multVectorMatrix(v,m));
    // console.log(o, vx, vy, vz);
    // console.log(points_2d);
    return points_2d;
}

//  Query ======================================================================================================

/**
 * Check a point is on a plane.
 * The plane is represented by an origin and a normal.
 */
export function planesAreCoplanar(origin1: gs.IPoint, normal1: gs.XYZ,
                                  origin2: gs.IPoint, normal2: gs.XYZ): boolean {
    // Check if point is on plane
    const origin1_v  = new three.Vector3(...origin1.getPosition());
    const normal1_v  = new three.Vector3(...normal1).normalize();
    const origin2_v  = new three.Vector3(...origin2.getPosition());
    const normal2_v  = new three.Vector3(...normal2).normalize();
    if (Math.abs(dotVectors(subVectors(origin1_v, origin2_v), normal2_v)) > EPS) {return false;}
    // check is vectors are same
    if (Math.abs(1- normal1_v.dot(normal2_v)) > EPS) {return false; }
    return true;
}

/**
 * Check a point is on a plane.
 * The plane is represented by an origin and a normal.
 */
export function pointIsOnPlane(origin: gs.IPoint, normal: gs.XYZ, point: gs.IPoint): boolean {
    const origin_v  = new three.Vector3(...origin.getPosition());
    const normal_v  = new three.Vector3(...normal).normalize();
    const point_v  = new three.Vector3(...point.getPosition());
    if(dotVectors(subVectors(point_v, origin_v), normal_v) === 0) {return true;}
    return false;
}

/**
 * Check if vectors are same dir.
 */
export function vectorsAreCodir(xyz1: gs.XYZ, xyz2: gs.XYZ): boolean {
    // Check if point is on plane
    const v1  = new three.Vector3(...xyz1).normalize();
    const v2  = new three.Vector3(...xyz2).normalize();
    if (Math.abs(1- v1.dot(v2)) > EPS) {return false; }
    return true;
}
