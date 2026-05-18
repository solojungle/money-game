import { Path, Shape } from "three";

/** Axis-aligned rounded rectangle centered at origin (XY plane). */
export function roundedRectShape(
  width: number,
  height: number,
  radius: number,
): Shape {
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius, hw, hh);
  const shape = new Shape();

  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  return shape;
}

export function roundedRectWithHole(
  width: number,
  height: number,
  cornerRadius: number,
  holeRadius: number,
): Shape {
  const shape = roundedRectShape(width, height, cornerRadius);
  const hole = new Path();
  hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}
