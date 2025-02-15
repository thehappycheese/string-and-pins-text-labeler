import { createElementSize } from "@solid-primitives/resize-observer";
import { Component, ParentProps, createEffect, onMount, onCleanup } from "solid-js";
import { compute_bezier_between_boxes } from "../util/compute_bezier_between_boxes";
import { draw_bezier_with_arrow } from "../util/draw_bezier_with_arrow";


export const TextHost: Component<
    ParentProps & {
        selected_ranges: { start: number; end: number; }[];
        connected_ranges: { from: number; to: number; }[];
    }
> = props => {

    let host_ref!: HTMLDivElement;


    const text_with_selections = <div
        style={{
            "overflow-y": "scroll",
            "flex-grow": 1,
            "padding": "0.5em",
            "z-index": "0",
            "line-height": "2.5em",
        }}
    >{props.children}</div> as HTMLDivElement;

    const canvas_showing_relationships = <canvas
        style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            "z-index": "-1",
        }}
    ></canvas> as HTMLCanvasElement;

    const canvas_size = createElementSize(canvas_showing_relationships);

    const create_range = (start: number, end: number) => {
        const range = document.createRange();
        const walker = document.createTreeWalker(text_with_selections, NodeFilter.SHOW_TEXT);
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

    const range_to_canvas_rect = (range_in: { start: number; end: number; }) => {
        const range = create_range(range_in.start, range_in.end);
        const range_rects = range.getClientRects();
        const canvas_rect = canvas_showing_relationships.getBoundingClientRect();
        return Array.from(range_rects).map(range_rect => ({
            x: range_rect.x - canvas_rect.x,
            y: range_rect.y - canvas_rect.y,
            width: range_rect.width,
            height: range_rect.height,
        }));
    };

    const update_canvas = () => {
        console.log("canvas update");
        canvas_showing_relationships.width = canvas_size.width;
        canvas_showing_relationships.height = canvas_size.height;
        const ctx = canvas_showing_relationships.getContext("2d")!;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // lets draw the selected ranges
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        for (const range of props.selected_ranges) {
            const range_rects = range_to_canvas_rect(range);
            for (const range_rect of range_rects) {
                //ctx.fillRect(range_rect.x, range_rect.y, range_rect.width, range_rect.height);
                ctx.beginPath();
                ctx.roundRect(range_rect.x, range_rect.y, range_rect.width, range_rect.height, 5);
                ctx.fill();
            }
        }

        for (const connection of props.connected_ranges) {
            const from_rects = range_to_canvas_rect({ start: props.selected_ranges[connection.from].start, end: props.selected_ranges[connection.from].end });
            const to_rects = range_to_canvas_rect({ start: props.selected_ranges[connection.to].start, end: props.selected_ranges[connection.to].end });
            const from_rect = from_rects[0];
            const to_rect = to_rects[0];

            const { start, control_1, control_2, end } = compute_bezier_between_boxes(from_rect, to_rect);
            ctx.strokeStyle = "rgba(255,0,225,0.8)";
            ctx.lineWidth = 2;

            draw_bezier_with_arrow(ctx, start, control_1, control_2, end);

        }

    };

    createEffect(() => {
        update_canvas();
    });

    onMount(() => {
        update_canvas();
    });

    text_with_selections.addEventListener("scroll", update_canvas);

    onCleanup(() => {
        console.log("cleanup");
        text_with_selections.removeEventListener("scroll", update_canvas);
    });

    return <div
        ref={host_ref}
        style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            gap: "0.5em",
        }}
    >
        {canvas_showing_relationships}
        {text_with_selections}
    </div>;
};
