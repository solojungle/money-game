import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function DemoBox() {
  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <RigidBody
      type="dynamic"
      position={[0, 4, 0]}
      colliders="cuboid"
      restitution={0.4}
    >
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#ff4d9d"
          metalness={0.35}
          roughness={0.45}
        />
      </mesh>
    </RigidBody>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#07060d"]} />
      <fog attach="fog" args={["#07060d", 12, 36]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[8, 12, 6]}
        intensity={1.25}
        shadow-mapSize={[1024, 1024]}
      />
      <Physics gravity={[0, -12, 0]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh receiveShadow position={[0, -0.75, 0]}>
            <boxGeometry args={[14, 0.5, 14]} />
            <meshStandardMaterial
              color="#15131f"
              metalness={0.2}
              roughness={0.85}
            />
          </mesh>
        </RigidBody>
        <DemoBox />
      </Physics>
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2 - 0.08}
      />
    </>
  );
}

export function GameScene() {
  return (
    <div className="game-scene">
      <Canvas shadows camera={{ position: [7, 5, 7], fov: 42 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
