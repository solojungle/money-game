/** Procedural caustic RT fragment — ported from manthrax/fish CausticShader.js (k-mouse / David Hoskins). */
export const PROCEDURAL_CAUSTICS_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const PROCEDURAL_CAUSTICS_FRAGMENT = /* glsl */ `
varying vec2 vUv;
uniform float iTime;
uniform vec3 uBaseColor;
uniform float uSpeed;
uniform float uScale;

#define TAU 6.28318530718
#define TILING_FACTOR 1.0
#define MAX_ITER 8

vec2 iResolution = vec2(1.0);

float waterHighlight(vec2 p, float time, float foaminess) {
  vec2 i = vec2(p * 3.0);
  float c = 0.0;
  float foaminess_factor = mix(1.0, 6.0, foaminess);
  float inten = 0.005 * foaminess_factor;

  for (int n = 0; n < MAX_ITER; n++) {
    float t = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t)), p.y / (cos(i.y + t))));
  }
  c = 0.2 + c / (inten * float(MAX_ITER));
  c = 1.17 - pow(c, 1.4);
  c = pow(abs(c), 8.0);
  return c / sqrt(foaminess_factor);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float time = (iTime * uSpeed) + 123.0;
  vec2 uv = fragCoord.xy / iResolution.xy;
  vec2 uv_square = vec2(uv.x * iResolution.x / iResolution.y, uv.y);
  float foaminess = smoothstep(0.4, 1.8, 0.0);
  float clearness = 0.1 + 0.9 * smoothstep(0.1, 0.5, 1.0);

  vec2 p = mod(uv_square * TAU * (TILING_FACTOR * uScale), TAU) - 250.0;
  float c = waterHighlight(p, time, foaminess);

  vec3 color = vec3(c);
  color = clamp(color + uBaseColor, 0.0, 1.0);
  color = mix(uBaseColor, color, clearness);

  fragColor = vec4(color, 1.0);
}

void main() {
  mainImage(gl_FragColor, vUv);
}
`;
