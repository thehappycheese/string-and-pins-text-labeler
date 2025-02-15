import { Vector2 } from "./Vector2";



export const bezier_sample = (p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number): Vector2 => {
    const abx = { x: Math.abs(p3.x - p0.x) * 0.5, y: 0 };

    const q0 = Vector2.lerp(p0, p1, t);
    const q1 = Vector2.lerp(p1, p2, t);
    const q2 = Vector2.lerp(p2, p3, t);

    const r0 = Vector2.lerp(q0, q1, t);
    const r1 = Vector2.lerp(q1, q2, t);

    return Vector2.lerp(r0, r1, t);
};
export const bezier_distance = (p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, segments: number): number => {
    let distance = 0;
    let prev_point = p0;
    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const point = bezier_sample(p0, p1, p2, p3, t);
        distance += Vector2.mag(Vector2.sub(prev_point, point));
        prev_point = point;
    }
    return distance;
};
