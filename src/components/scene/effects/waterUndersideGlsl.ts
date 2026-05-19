/**
 * Underside when viewed from below the surface.
 * Normal points toward air (+Y); Snell disk is bright only when looking up through the plane.
 */
export const WATER_UNDERSIDE_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uNormalScale;
uniform sampler2D tNormalMap;
uniform vec3 uSunDir;
uniform float uOpacity;
uniform vec3 uSurfaceGlow;
uniform vec3 uUnderSnellColor;
uniform vec3 uUnderTirColor;
uniform float uUnderSunStrength;
uniform float uUnderSnellOpacity;
uniform float uUnderRimOpacity;
uniform float uWaterSurfaceY;

varying vec3 vWorldPos;
varying vec2 vWorldXZ;

vec4 waterNormalNoise(vec2 xz) {
  vec2 uv0 = xz / 103.0 + vec2(uTime / 17.0, uTime / 29.0);
  vec2 uv1 = xz / 107.0 - vec2(uTime / -19.0, uTime / 31.0);
  vec2 uv2 = xz / vec2(8907.0, 9803.0) + vec2(uTime / 101.0, uTime / 97.0);
  vec2 uv3 = xz / vec2(1091.0, 1027.0) - vec2(uTime / 109.0, uTime / -113.0);
  return texture2D(tNormalMap, uv0)
    + texture2D(tNormalMap, uv1)
    + texture2D(tNormalMap, uv2)
    + texture2D(tNormalMap, uv3);
}

void main() {
  if (cameraPosition.y > uWaterSurfaceY + 0.15) discard;

  vec3 toCamera = normalize(cameraPosition - vWorldPos);
  vec3 lookUp = normalize(vWorldPos - cameraPosition);

  vec4 noise = waterNormalNoise(vWorldXZ * uNormalScale);
  vec3 ripple = noise.xzy * vec3(1.2, 0.7, 1.2);
  vec3 surfaceNormal = normalize(vec3(ripple.x * 0.32, 1.0, ripple.z * 0.32));

  float snell = pow(max(dot(surfaceNormal, lookUp), 0.0), 2.8);
  float rim = 1.0 - snell;

  vec3 color = uUnderTirColor * 0.35;
  color = mix(color, uUnderSnellColor, snell * 0.7);
  color = mix(color, uSurfaceGlow, snell * snell * 0.5);

  vec3 halfDir = normalize(uSunDir + toCamera);
  float spec = pow(max(dot(surfaceNormal, halfDir), 0.0), 220.0);
  color += vec3(0.92, 0.98, 1.0) * spec * uUnderSunStrength * 0.22 * (0.25 + snell);

  vec3 sunReflect = reflect(-lookUp, surfaceNormal);
  float sunDisk = pow(max(dot(sunReflect, uSunDir), 0.0), 320.0) * snell;
  color += vec3(1.0, 0.97, 0.88) * sunDisk * uUnderSunStrength;

  float shimmer = smoothstep(0.95, 1.4, max(noise.r, max(noise.g, noise.b)));
  color += uSurfaceGlow * shimmer * 0.06 * snell;

  float alpha =
    (0.06 + snell * 0.48) *
    mix(uUnderRimOpacity, uUnderSnellOpacity, snell) *
    uOpacity;

  if (alpha < 0.004) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

export const WATER_UNDERSIDE_VERTEX = /* glsl */ `
varying vec3 vWorldPos;
varying vec2 vWorldXZ;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  vWorldXZ = world.xz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
