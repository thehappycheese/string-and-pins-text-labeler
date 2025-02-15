export const bisection_solver = (func: (t: number) => number, estimate: number, threshold: number, range: [number, number] = [0, 1]): number => {
    let [low, high] = range;
    let mid = estimate;
    while (high - low > threshold) {
        mid = (low + high) / 2;
        const value = func(mid);
        if (value > 0) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return mid;
};
