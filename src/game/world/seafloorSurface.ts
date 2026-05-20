import type { Mesh, Object3D } from "three";
import { Raycaster, Vector3 } from "three";
import { seafloorHeightAt } from "./seafloorHeight";
import { SEAFLOOR_BODY_Y } from "./waterLevel";

/** Rapier cuboid half-height on PlayLevel seafloor collider. */
export const SEAFLOOR_COLLIDER_HALF_Y = 0.2;

/** Matches `SeafloorGlbMesh` — keep in sync when retuning dunes. */
export const DUNES_MESH_SCALE = 2.8;

/** Vertical bias so procedural fallback roughly matches scaled `waterdunes.glb`. */
const DUNES_MESH_Y_BIAS = 0.22;

const _raycaster = new Raycaster();
const _rayOrigin = new Vector3();
const _rayDir = new Vector3(0, -1, 0);

let _dunesMeshes: Mesh[] = [];

/** Register sand meshes for world-space height sampling (PlayLevel seafloor). */
export function registerSeafloorDunesMeshes(root: Object3D): void {
  const meshes: Mesh[] = [];
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (mesh.isMesh) meshes.push(mesh);
  });
  _dunesMeshes = meshes;
}

export function clearSeafloorDunesMeshes(): void {
  _dunesMeshes = [];
}

/** Procedural mesh height before collider clamp (scaled dunes approximation). */
export function seafloorMeshSurfaceY(x: number, z: number): number {
  return (
    SEAFLOOR_BODY_Y +
    seafloorHeightAt(x, z) * DUNES_MESH_SCALE +
    DUNES_MESH_Y_BIAS
  );
}

/**
 * World Y on the sand surface at XZ. Raycasts loaded dunes when available.
 * @param offset — lift above the hit point (ore rest height, coral base, etc.)
 */
export function sampleSeafloorWorldY(x: number, z: number, offset = 0): number {
  if (_dunesMeshes.length > 0) {
    rootUpdateMatrixWorld(_dunesMeshes);
    _rayOrigin.set(x, 50, z);
    _raycaster.set(_rayOrigin, _rayDir);
    const hits = _raycaster.intersectObjects(_dunesMeshes, false);
    if (hits.length > 0) {
      return hits[0]!.point.y + offset;
    }
  }
  return seafloorMeshSurfaceY(x, z) + offset;
}

/** Walkable / placement surface — max of physics collider top and sand mesh. */
export function seabedSurfaceY(x: number, z: number): number {
  const colliderTop = SEAFLOOR_BODY_Y + SEAFLOOR_COLLIDER_HALF_Y;
  return Math.max(colliderTop, sampleSeafloorWorldY(x, z, 0));
}

function rootUpdateMatrixWorld(meshes: Mesh[]): void {
  const root = meshes[0]?.parent;
  if (root) root.updateMatrixWorld(true);
}
