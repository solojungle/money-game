/**
 * Shared caustics GLSL — dual scrolling layers + min blend (Alan Zucconi / GPU Gems style).
 * @see https://www.alanzucconi.com/2019/09/13/believable-caustics-reflections/
 * @see https://discourse.threejs.org/t/ocean-floor-reflection-with-texture/67446
 */
export const CAUSTICS_GLSL = /* glsl */ `
float causticsTexLuma(sampler2D map, vec2 uv) {
  vec3 rgb = texture2D(map, uv).rgb;
  return max(max(rgb.r, rgb.g), rgb.b);
}

vec3 causticsSampleChrom(sampler2D map, vec2 uv, float split) {
  if (split <= 0.00001) {
    float c = causticsTexLuma(map, uv);
    return vec3(c);
  }
  float r = causticsTexLuma(map, uv + vec2(split, split));
  float g = causticsTexLuma(map, uv + vec2(split, -split));
  float b = causticsTexLuma(map, uv + vec2(-split, -split));
  return vec3(r, g, b);
}

vec2 causticsWorldUv(vec3 worldPos, mat4 uCausticProj) {
  return (uCausticProj * vec4(worldPos, 1.0)).xy;
}

vec2 causticsDistort(vec2 uv, float time) {
  return uv + vec2(
    sin(uv.y * 6.5 + time * 0.85) * 0.01,
    sin(uv.x * 5.8 - time * 0.7) * 0.01
  );
}

vec3 causticsDualLayer(
  sampler2D map,
  vec2 baseUv,
  float time,
  vec2 scroll,
  float split,
  float scale,
  float speed
) {
  float t = time * speed;
  vec2 uv1 = causticsDistort(baseUv * scale * 0.88 + scroll * t * 0.42, time);
  vec2 uv2 = causticsDistort(
    baseUv * scale * 1.14 - vec2(scroll.y, scroll.x) * t * 0.34,
    time + 9.3
  );
  vec3 layer1 = causticsSampleChrom(map, uv1, split);
  vec3 layer2 = causticsSampleChrom(map, uv2, split);
  return min(layer1, layer2);
}

float causticsLuminance(vec3 rgb) {
  return pow(max(dot(rgb, vec3(0.299, 0.587, 0.114)), 0.0), 1.1);
}

float causticsSoftDissolve(float intensity) {
  return smoothstep(0.04, 0.55, intensity);
}
`;
