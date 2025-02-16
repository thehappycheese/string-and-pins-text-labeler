const create_range = (host: HTMLDivElement, start: number, end: number) => {
    const range = document.createRange();
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    let current_node = walker.nextNode();
    let current_offset = 0;
    let start_node = null;
    let end_node = null;
    let start_offset = 0;
    let end_offset = 0;
    while (current_node) {
        const text = current_node.textContent!;
        if (start >= current_offset && start <= current_offset + text.length) {
            start_node = current_node;
            start_offset = start - current_offset;
        }
        if (end >= current_offset && end <= current_offset + text.length) {
            end_node = current_node;
            end_offset = end - current_offset;
        }
        current_offset += text.length;
        current_node = walker.nextNode();
    }
    if (!start_node || !end_node) {
        throw new Error("start or end node not found");
    }
    range.setStart(start_node, start_offset);
    range.setEnd(end_node, end_offset);
    return range;
};

export const range_to_canvas_rect = (
    host: HTMLDivElement,
    canvas: HTMLCanvasElement,
    range_in: { start: number; end: number; },
):{ x:number, y:number, w:number, h:number }[] => {
    //if(range_in.start === 675) debugger;
    const range       = create_range(host, range_in.start, range_in.end);
    //if(range_in.start === 675) debugger;
    const range_rects = range.getClientRects();
    const canvas_rect = canvas.getBoundingClientRect();
    return Array.from(range_rects).map(range_rect => ({
        x : range_rect.x - canvas_rect.x,
        y : range_rect.y - canvas_rect.y,
        w : range_rect.width,
        h : range_rect.height,
    }));
};
