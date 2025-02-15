
export interface Vector2 {
    x: number;
    y: number;
}

export const Vector2 = {
    toString(v: Vector2): string {
        return `{${v.x.toFixed(1)}, ${v.y.toFixed(1)}}`;
    },
    add(a: Vector2, b: Vector2): Vector2 {
        return { x: a.x + b.x, y: a.y + b.y };
    },
    sub(a: Vector2, b: Vector2): Vector2 {
        return { x: a.x - b.x, y: a.y - b.y };
    },
    neg(a: Vector2): Vector2 {
        return { x: -a.x, y: -a.y };
    },
    scale(a: Vector2, multiplier: number): Vector2 {
        return { x: a.x * multiplier, y: a.y * multiplier };
    },
    descale(a: Vector2, divisor: number): Vector2 {
        return { x: a.x / divisor, y: a.y / divisor };
    },
    left(a: Vector2): Vector2 {
        return { x: -a.y, y: a.x };
    },
    right(a: Vector2): Vector2 {
        return { x: a.y, y: -a.x };
    },
    unit(a: Vector2): Vector2 {
        const mag = Math.sqrt(a.x * a.x + a.y * a.y);
        return {
            x: a.x / mag,
            y: a.y / mag,
        }
    },
    eq(a:Vector2, b:Vector2){
        return a.x===b.x && a.y===b.y;
    },
    is_rounded(a:Vector2){
        return Vector2.eq(a, Vector2.round(a));
    },
    from(arr:[number,number]):Vector2{
        return {
            x:arr[0],
            y:arr[1],
        }
    },
    cross(a: Vector2, b: Vector2): number {
        return a.x * b.y - a.y * b.x;
    },
    mag_squared(a: Vector2): number {
        return a.x * a.x + a.y * a.y;
    },
    mag(a: Vector2): number {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    },
    lerp(a: Vector2, b: Vector2, t: number): Vector2 {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
        }
    },
    sum(items: Vector2[]) {
        return items.reduce((cur, acc) => ({ x: acc.x + cur.x, y: acc.y + cur.y }));
    },
    round(a:Vector2) {
        return {
            x:Math.round(a.x),
            y:Math.round(a.y),
        }
    },
    inside_rect: (test_position: Vector2) => (rect_position: Vector2, rect_size: Vector2) => {
        const relative_test_position = Vector2.sub(test_position, rect_position);
        return (
            relative_test_position.x >= 0
            && relative_test_position.y >= 0
            && relative_test_position.x < rect_size.x
            && relative_test_position.y < rect_size.y
        )
    },
    line_segments_intersect (a: Vector2, b: Vector2) {
        const ab = Vector2.sub(b, a);
        return (c: Vector2, d: Vector2) => {
            const cd = Vector2.sub(d, c);
            const ac = Vector2.sub(c, a);
            const cabcd = Vector2.cross(ab, cd)
            const t1 = Vector2.cross(ac, cd) / cabcd;
            const t2 = -Vector2.cross(ac, ab) / cabcd;
            return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
        }
    },
    to_string:(v:Vector2)=>{
        return (
            `┌${v.x}┐\n`
           +`└${v.y}┘`
       )
    },
    log(v:Vector2){
        console.log(Vector2.to_string(v))
    }
}
