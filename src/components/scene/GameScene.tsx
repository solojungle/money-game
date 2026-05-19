import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
  useTexture,
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
import { CAUSTICS } from "./effects/causticsConfig";
import { CausticsScreenPass } from "./effects/CausticsScreenPass";
import { CAUSTICS_TEXTURE_URL } from "./effects/causticsTexture";
import { WATER_NORMAL_URL } from "./effects/waterSurfaceTextures";

useTexture.preload(CAUSTICS_TEXTURE_URL);
useTexture.preload(WATER_NORMAL_URL);
import { OceanSky } from "./effects/OceanSky";
import { SunLighting } from "./effects/SunLighting";
import { UnderwaterAtmosphere } from "./effects/UnderwaterAtmosphere";
import { UNDERWATER_FOG } from "./effects/underwaterAtmosphereConfig";
import { UnderwaterParticles } from "./effects/UnderwaterParticles";
import { WaterSurface } from "./effects/WaterSurface";
import { ZoneOverlapProvider } from "./ZoneOverlapProvider";

function WorldLighting() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <hemisphereLight
        args={["#a0ecff", "#c8a050", 0.32]}
        position={[0, 20, 0]}
      />
      <SunLighting />
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

  return (
    <>
      <OceanSky />
      <UnderwaterAtmosphere playerRef={playerRef} />
      <UnderwaterParticles playerRef={playerRef} />
      {CAUSTICS.enableScreenPass ? <CausticsScreenPass /> : null}
      <WorldLighting />
      <Environment preset="dawn" environmentIntensity={0.22} frames={1} />
      <WaterSurface />
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
        onCreated={({ gl }) => {
          gl.setClearColor(new Color(UNDERWATER_FOG.shallowColor));
        }}
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
