export const SKY_VERTEX = /* glsl */ `
  varying vec3 vWorldDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldDir = normalize(worldPos.xyz - cameraPosition);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const SKY_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec3 uSunDir;
  uniform float uDayPhase;
  uniform float uStarRotation;
  uniform float uCloudRotation;
  uniform float uCloudCoverage;
  uniform float uCloudOpacity;
  uniform float uVisibility;

  uniform vec3 uZenithDay;
  uniform vec3 uZenithNight;
  uniform vec3 uHorizonDay;
  uniform vec3 uHorizonNight;
  uniform vec3 uHorizonSunset;
  uniform vec3 uSunDisk;
  uniform vec3 uSunHalo;
  uniform vec3 uCloudBright;
  uniform vec3 uCloudShadow;
  uniform vec3 uStarColor;

  uniform float uSunDiskPower;
  uniform float uSunHaloPower;
  uniform float uSunDiskIntensity;
  uniform float uSunHaloIntensity;
  uniform float uStarDensity;
  uniform float uStarThreshold;

  varying vec3 vWorldDir;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  vec3 rotateY(vec3 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }

  float starField(vec3 dir) {
    vec3 p = dir * uStarDensity * 180.0;
    vec3 cell = floor(p);
    float h = hash31(cell);
    float brightness = smoothstep(uStarThreshold, 1.0, h);
    float twinkle = 0.85 + 0.15 * sin(uDayPhase * 62.83 + h * 40.0);
    return brightness * twinkle;
  }

  float valueNoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash31(i);
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float cloudFbm(vec3 p) {
    float v = 0.0;
    float a = 0.55;
    for (int i = 0; i < 4; i++) {
      v += a * valueNoise3(p);
      p = p * 2.12 + vec3(1.7, 2.3, 0.9);
      a *= 0.5;
    }
    return v;
  }

  float cloudLayer(vec3 dir) {
    float aboveHorizon = smoothstep(-0.08, 0.22, dir.y);
    vec3 sampleDir = rotateY(dir, uCloudRotation);
    float n = cloudFbm(sampleDir * 2.6);
    float detail = cloudFbm(sampleDir * 5.4 + vec3(4.1, 1.8, 2.6)) * 0.45;
    n = mix(n, detail, 0.35);
    float softness = 0.18;
    float c = smoothstep(
      uCloudCoverage - softness,
      uCloudCoverage + softness,
      n
    );
    return c * aboveHorizon;
  }

  void main() {
    vec3 dir = normalize(vWorldDir);
    float up = dir.y * 0.5 + 0.5;

    float night = smoothstep(0.05, -0.12, uSunDir.y);
    float day = 1.0 - night;
    float sunset = smoothstep(0.35, 0.0, uSunDir.y) * day;

    vec3 zenith = mix(uZenithDay, uZenithNight, night);
    vec3 horizon = mix(uHorizonDay, uHorizonNight, night);
    horizon = mix(horizon, uHorizonSunset, sunset * 0.85);

    vec3 sky = mix(horizon, zenith, pow(up, 0.65));

    float sunDot = max(dot(dir, uSunDir), 0.0);
    float disk = pow(sunDot, uSunDiskPower) * uSunDiskIntensity * day;
    float halo = pow(sunDot, uSunHaloPower) * uSunHaloIntensity * day;
    sky += uSunDisk * disk + uSunHalo * halo;

    vec3 starDir = rotateY(dir, uStarRotation);
    float stars = starField(starDir) * night;
    sky += uStarColor * stars;

    float clouds = cloudLayer(dir) * uCloudOpacity * mix(0.5, 1.0, day);
    vec3 cloudCol = mix(uCloudShadow, uCloudBright, 0.65 + 0.35 * day);
    sky = mix(sky, cloudCol, clouds * 0.65);

    if (uVisibility < 0.001) discard;
    gl_FragColor = vec4(sky, uVisibility);
  }
`;
