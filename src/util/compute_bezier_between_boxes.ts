import { Vector2 } from "./Vector2";

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const BoundingBox = {
    position: (box: BoundingBox): Vector2 => ({ x: box.x, y: box.y }),
    size: (box: BoundingBox): Vector2 => ({ x: box.width, y: box.height }),
    center: (box: BoundingBox): Vector2 => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 }),
}


export function compute_bezier_between_boxes(box_a: BoundingBox, box_b: BoundingBox): { start: Vector2; control_1: Vector2; control_2: Vector2; end: Vector2 } {
    const center_a: Vector2 = BoundingBox.center(box_a);
    const center_b: Vector2 = BoundingBox.center(box_b);
    
    // Compute the direction vector
    const dir: Vector2 = Vector2.unit(Vector2.sub(center_b, center_a));
    
    // Determine which face the line exits each box
    function get_exit_point(box: BoundingBox, direction: Vector2): Vector2 {
        const half_size: Vector2 = Vector2.scale(BoundingBox.size(box), 0.5);
        const center: Vector2 = Vector2.add(BoundingBox.position(box), half_size);
        
        const t_x = direction.x !== 0 ? half_size.x / Math.abs(direction.x) : Infinity;
        const t_y = direction.y !== 0 ? half_size.y / Math.abs(direction.y) : Infinity;
        const t = Math.min(t_x, t_y);
        
        return Vector2.add(center, Vector2.scale(direction, t));
    }
    
    const start: Vector2 = get_exit_point(box_a, dir);
    const end: Vector2 = get_exit_point(box_b, Vector2.neg(dir));
    
    // // Compute control points to ensure smooth curve
    // const control_1: Vector2 = Vector2.add(start, Vector2.scale(dir, 50));
     const control_2: Vector2 = Vector2.add(end, Vector2.scale(Vector2.neg(dir), 50));

    const normal: Vector2 = Math.abs(dir.x) > Math.abs(dir.y) ? { x: 0, y: Math.sign(dir.y) } : { x: Math.sign(dir.x), y: 0 };
    const control_1: Vector2 = Vector2.add(start, Vector2.scale(normal, 50));
    //const control_2: Vector2 = Vector2.add(end, Vector2.scale(normal, -50));
    
    return { start, control_1, control_2, end };
}
