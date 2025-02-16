import { createElementSize } from "@solid-primitives/resize-observer";
import { Component, createEffect, onMount, onCleanup, Signal, Accessor, VoidProps, For, createSignal } from "solid-js";
import { compute_bezier_between_boxes } from "../util/compute_bezier_between_boxes";
import { draw_bezier_with_arrow } from "../util/draw_bezier_with_arrow";
import { range_to_canvas_rect as range_to_canvas_rects } from "../util/range";
import { offset_within_top_node } from "../util/offset_within_top_node";
import { Entity, Relationship } from "../state";
import { css } from "solid-styled-components";
import { createScrollPosition } from "@solid-primitives/scroll";


export const TextHost: Component<
    VoidProps &
    {
        text_content: Accessor<string>;
        selected_ranges: Accessor<Entity[]>;
        connected_ranges: Accessor<Relationship[]>;
        add_selected_range: (range: { start: number; end: number; }) => void;
    }
> = props => {

    const [all_mounted, set_all_mounted] = createSignal(false);

    let host_ref!: HTMLDivElement;

    const text_with_selections = <div
        style={{
            "overflow-y": "scroll",
            "flex-grow": 1,
            "padding": "0.5em",
            "z-index": "0",
            "line-height": "2.5em",
        }}
        innerHTML={props.text_content()}
    ></div> as HTMLDivElement;

    const scroll_position = createScrollPosition(text_with_selections);

    const canvas_showing_relationships = <canvas
        style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            "z-index": "-2",
        }}
    ></canvas> as HTMLCanvasElement;


    const canvas_size = createElementSize(canvas_showing_relationships);


    


    const update_canvas = () => {
        console.log("canvas update");
        canvas_showing_relationships.width = canvas_size.width;
        canvas_showing_relationships.height = canvas_size.height;
        const ctx = canvas_showing_relationships.getContext("2d")!;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // lets draw the selected ranges
        // ctx.fillStyle = "rgba(255,0,0,0.5)";
        // for (const range of props.selected_ranges()) {
        //     const range_rects = range_to_canvas_rects(
        //         text_with_selections,
        //         canvas_showing_relationships,
        //         range
        //     );
        //     for (const range_rect of range_rects) {
        //         //ctx.fillRect(range_rect.x, range_rect.y, range_rect.width, range_rect.height);
        //         ctx.beginPath();
        //         ctx.roundRect(range_rect.x, range_rect.y, range_rect.width, range_rect.height, 5);
        //         ctx.fill();
        //     }
        // }

        for (const connection of props.connected_ranges()) {

            const from_rects = range_to_canvas_rects(
                text_with_selections,
                canvas_showing_relationships, 
                {
                    start: props.selected_ranges()[connection.from].start,
                    end  : props.selected_ranges()[connection.from].end,
                }
            );

            const to_rects = range_to_canvas_rects(
                text_with_selections,
                canvas_showing_relationships, 
                {
                    start: props.selected_ranges()[connection.to].start,
                    end  : props.selected_ranges()[connection.to].end,
                }
            );

            const from_rect = from_rects[0];
            const to_rect = to_rects[0];
            const { start, control_1, control_2, end } = compute_bezier_between_boxes(from_rect, to_rect);

            ctx.strokeStyle = "rgba(255,0,225,0.8)";
            ctx.lineWidth = 2;

            draw_bezier_with_arrow(ctx, start, control_1, control_2, end);

        }
    };

    const handel_pointer_up = (e: PointerEvent) => {
        // get the selection and see if we need to update the selected ranges
        const selection = window.getSelection();
        if (!selection) return;
        if (selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        const start = offset_within_top_node(text_with_selections, range.startContainer, range.startOffset);
        const end = offset_within_top_node(text_with_selections,   range.endContainer, range.endOffset);
        console.log("selection", selection);
        console.log("range", range);
        console.log("start", start);
        console.log("end", end);
        
            
        props.add_selected_range({ start, end });
        selection.removeAllRanges();
    };

    createEffect(() => {
        update_canvas();
    });

    onMount(() => {
        update_canvas();
        text_with_selections.addEventListener("pointerup", handel_pointer_up);
        set_all_mounted(true);
    });

    text_with_selections.addEventListener("scroll", update_canvas);

    onCleanup(() => {
        console.log("cleanup");
        text_with_selections.removeEventListener("scroll", update_canvas);
        text_with_selections.removeEventListener("pointerup", handel_pointer_up);
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
        <div
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                "z-index": "-1",
            }}
        >{
            all_mounted() && <For each={props.selected_ranges()}>{selected_range => {
                debugger
                const range_rects = range_to_canvas_rects(
                    text_with_selections,
                    canvas_showing_relationships,
                    selected_range
                );
                debugger
                return <>{
                        range_rects.map(range_rect => <div
                            class={css`
                                position: absolute;
                                top:    ${range_rect.y - scroll_position.y}px;
                                left:   ${range_rect.x - scroll_position.x}px;
                                width:  ${range_rect.width}px;
                                height: ${range_rect.height}px;
                                background-color: rgba(128,128,0,0.5);
                                border-radius: 5px;
                            `}></div>)
                }</>;
            }}</For>
        }</div>
        
    </div>;
};
