export type SwimProfile = {
  swimSpeed: number;
  sprintMult: number;
  capsuleHalfHeight: number;
  capsuleRadius: number;
  eyeHeight: number;
};

export const DIVER_PROFILE: SwimProfile = {
  swimSpeed: 6.5,
  sprintMult: 1.55,
  capsuleHalfHeight: 0.45,
  capsuleRadius: 0.32,
  eyeHeight: 0.62,
};

export function getSwimProfile(): SwimProfile {
  return DIVER_PROFILE;
}
