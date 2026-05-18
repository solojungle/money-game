declare module "yuka" {
  export class Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    squaredLength(): number;
  }
  export class Vehicle {
    name: string;
    position: Vector3;
    velocity: Vector3;
    maxSpeed: number;
    maxForce: number;
    boundingRadius: number;
    steering: { add(b: unknown): void };
    update(delta: number): void;
  }
  export class EntityManager {
    add(entity: unknown): void;
    update(delta: number): void;
  }
  export class WanderBehavior {
    constructor(radius?: number, distance?: number, jitter?: number);
  }
}
