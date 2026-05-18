import type { IntersectionEnterPayload } from "@react-three/rapier";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Object3D } from "three";
import { useZoneOverlap } from "./useZoneOverlap";

type SensorZoneBase = {
  zoneId: string;
  position: [number, number, number];
};

export type SensorZoneProps = SensorZoneBase &
  (
    | { shape: "ball"; radius: number }
    | { shape: "cuboid"; args: [number, number, number] }
  );

function isPlayerIntersection(
  other: IntersectionEnterPayload["other"],
): boolean {
  let obj: Object3D | null = other.rigidBodyObject ?? null;
  while (obj) {
    if (obj.userData?.role === "player") return true;
    obj = obj.parent;
  }
  return false;
}

export function SensorZone(props: SensorZoneProps) {
  const { zoneId, position, shape } = props;
  const { enter, exit } = useZoneOverlap();

  const onEnter = (e: { other: IntersectionEnterPayload["other"] }) => {
    if (isPlayerIntersection(e.other)) enter(zoneId);
  };
  const onExit = (e: { other: IntersectionEnterPayload["other"] }) => {
    if (isPlayerIntersection(e.other)) exit(zoneId);
  };

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      {shape === "ball" ? (
        <BallCollider
          args={[props.radius]}
          sensor
          onIntersectionEnter={onEnter}
          onIntersectionExit={onExit}
        />
      ) : (
        <CuboidCollider
          args={props.args}
          sensor
          onIntersectionEnter={onEnter}
          onIntersectionExit={onExit}
        />
      )}
    </RigidBody>
  );
}
