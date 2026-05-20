import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  Color,
  Mesh,
  OrthographicCamera,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  WebGLRenderTarget,
} from "three";
import { CAUSTICS } from "./causticsConfig";
import {
  PROCEDURAL_CAUSTICS_FRAGMENT,
  PROCEDURAL_CAUSTICS_VERTEX,
} from "./proceduralCausticsGlsl";
import { causticTextureUniform } from "./causticTextureUniform";
import { ProceduralCausticsTextureProvider } from "./ProceduralCausticsContext";

const RT_SIZE = 512;

type ProceduralCausticsPassProps = {
  children: React.ReactNode;
};

/**
 * Renders fish-style procedural caustics into a 512² RT each frame.
 * @see https://github.com/manthrax/fish/blob/main/src/CausticShader.js
 */
export function ProceduralCausticsPass({
  children,
}: ProceduralCausticsPassProps) {
  const gl = useThree((s) => s.gl);

  const renderTarget = useMemo(
    () => new WebGLRenderTarget(RT_SIZE, RT_SIZE),
    [],
  );

  const rtScene = useMemo(() => new Scene(), []);
  const rtCam = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, 0, 10), []);

  const material = useMemo(() => {
    const { procedural } = CAUSTICS;
    return new ShaderMaterial({
      vertexShader: PROCEDURAL_CAUSTICS_VERTEX,
      fragmentShader: PROCEDURAL_CAUSTICS_FRAGMENT,
      uniforms: {
        iTime: { value: 0 },
        uBaseColor: { value: new Color(procedural.baseColor) },
        uSpeed: { value: procedural.speed },
        uScale: { value: procedural.scale },
      },
    });
  }, []);

  const meshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2), material);
    mesh.position.z = -5;
    rtScene.add(mesh);
    meshRef.current = mesh;

    const tex = renderTarget.texture;
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;

    return () => {
      rtScene.remove(mesh);
      mesh.geometry.dispose();
      material.dispose();
      renderTarget.dispose();
    };
  }, [material, renderTarget, rtScene]);

  useFrame((state) => {
    material.uniforms.iTime.value = state.clock.elapsedTime;
    const prev = gl.getRenderTarget();
    gl.setRenderTarget(renderTarget);
    gl.render(rtScene, rtCam);
    gl.setRenderTarget(prev);
    causticTextureUniform.value = renderTarget.texture;
  });

  return (
    <ProceduralCausticsTextureProvider texture={renderTarget.texture}>
      {children}
    </ProceduralCausticsTextureProvider>
  );
}
