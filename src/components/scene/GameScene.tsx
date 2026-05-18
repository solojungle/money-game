import { Canvas } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import { Physics, type RapierRigidBody } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import { CONTROL_MAP } from "../../controls/controlMap";
import { GameInputBridge } from "../../controls/GameInputBridge";
import type { AudioService } from "../../audio/audioService";
import { FirstPersonCamera } from "./FirstPersonCamera";
import { FpsTracker } from "./FpsTracker";
import { GameClock } from "./GameClock";
import { InteractionFocus } from "./InteractionFocus";
import { Level } from "./Level";
import { Player } from "./Player";
import { ZoneOverlapProvider } from "./ZoneOverlapProvider";

function WorldLighting() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        castShadow
        position={[6, 12, 4]}
        intensity={0.85}
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
}

type SceneContentProps = {
  started: boolean;
  audio: AudioService;
};

function SceneContent({
  started,
  paused,
  audio,
}: SceneContentProps & { paused: boolean }) {
  const playerRef = useRef<RapierRigidBody>(null);
  const fogColor = "#0a1628";

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 4, 42]} />
      <WorldLighting />
      <Environment preset="night" environmentIntensity={0.4} />
      <Physics gravity={[0, -1.2, 0]} paused={!started}>
        <ZoneOverlapProvider>
          <Level />
          <Player ref={playerRef} audio={audio} />
        </ZoneOverlapProvider>
      </Physics>
      <GameClock running={started && !paused} />
      {started ? (
        <>
          <FirstPersonCamera target={playerRef} />
          <InteractionFocus playerRef={playerRef} />
        </>
      ) : (
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2 - 0.08}
        />
      )}
    </>
  );
}

type GameSceneProps = {
  started: boolean;
  paused: boolean;
  audio: AudioService;
};

export function GameScene({ started, paused, audio }: GameSceneProps) {
  return (
    <div className="game-scene">
      <Canvas
        shadows="percentage"
        camera={{ position: [7, 5, 7], fov: 72 }}
        dpr={[1, 2]}
      >
        <KeyboardControls map={CONTROL_MAP}>
          <FpsTracker />
          <GameInputBridge audio={audio} />
          <Suspense fallback={null}>
            <SceneContent started={started} paused={paused} audio={audio} />
          </Suspense>
        </KeyboardControls>
      </Canvas>
    </div>
  );
}
