import { bezier_distance, bezier_sample } from "./bezier";
import { bisection_solver } from "./bisection_solver";
import { Vector2 } from "./Vector2";


const estimate_end_tangent = (p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, H: number): Vector2 => {
    

    const distance_func = (t: number) => H - bezier_distance(p3, p2, p1, p0, Math.floor(t * 100));
    const t_H = bisection_solver(distance_func, 0.1, 0.1, [0.0, 1.0]);

    const point_end = bezier_sample(p0, p1, p2, p3, 1);
    const point_H = bezier_sample(p0, p1, p2, p3, t_H);

    return Vector2.unit(Vector2.sub(point_end, point_H));
}


const arrow_head = (ctx: CanvasRenderingContext2D, position: Vector2, direction: Vector2) => {
    const backset = Vector2.scale(direction, -10);
    const sideset = Vector2.scale(Vector2.right(direction), 4);
    const left: Vector2  = Vector2.sum([
        position,
        backset,
        sideset
    ]);
    const right: Vector2 = Vector2.sum([
        position,
        backset,
        Vector2.neg(sideset),
    ]);
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(position.x, position.y);
    ctx.lineTo(right.x, right.y);
}

export function draw_bezier_with_arrow(
    ctx: CanvasRenderingContext2D,
    start: Vector2,
    control_1: Vector2,
    control_2: Vector2,
    end: Vector2
) {
    const tangent = estimate_end_tangent(start, control_1, control_2, end, 10);
    
    ctx.save();
        arrow_head(ctx, end, tangent);
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clip("evenodd")
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(control_1.x, control_1.y, control_2.x, control_2.y, end.x, end.y);
        ctx.stroke();
    ctx.restore();
    ctx.save();
        ctx.fillStyle = ctx.strokeStyle;
        arrow_head(ctx, end, tangent);
        ctx.fill();
    ctx.restore();
}