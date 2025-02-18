import { createElementSize } from "@solid-primitives/resize-observer";
import { Component, createEffect, onMount, onCleanup, Accessor, VoidProps, For, createSignal } from "solid-js";
import { compute_bezier_between_boxes } from "../util/compute_bezier_between_boxes";
import { draw_bezier_with_arrow } from "../util/draw_bezier_with_arrow";
import { range_to_canvas_rect as range_to_canvas_rects } from "../util/range";
import { offset_within_top_node } from "../util/offset_within_top_node";
import { Entity, Rectangle, Relationship, State } from "../state";
import { css } from "solid-styled-components";
import { magic_color } from "../util/magic_color";


export const TextHost: Component<
    VoidProps &
    {
        text_content: Accessor<string>;
        selected_ranges: Accessor<Entity[]>;
        connected_ranges: Accessor<Relationship[]>;
        connect_ranges:(new_rel:Relationship)=>void;
        add_selected_range: (range: Entity) => void;
        active_tool: Accessor<State["active_tool"]>;
    }
> = props => {

    const [all_mounted, set_all_mounted] = createSignal(false);
    const [entity_rects, set_entity_rects] = createSignal<Rectangle[][]>([]);

    let host_ref!: HTMLDivElement;

    const text_with_selections = <div
        style={{
            "overflow-y": "scroll",
            "flex-grow": 1,
            "padding": "1em 3em",
            "z-index": "3000",
            "line-height": "2.5em",
        }}
        innerHTML={props.text_content()}
    ></div> as HTMLDivElement;

    createEffect(() => {
        text_with_selections.style.pointerEvents = props.active_tool().type==="create-relationship" ? "none" :"auto";
        text_with_selections.style.userSelect = props.active_tool().type==="create-relationship" ? "none" :"auto";
    });

    const canvas_showing_relationships = <canvas
        style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            "z-index": "1000",
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
        
        // instead update the screen positions of the selected ranges
        const new_positions = [];
        for (const range of props.selected_ranges()) {
            const range_rects = range_to_canvas_rects(
                text_with_selections,
                canvas_showing_relationships,
                range
            );
            new_positions.push(range_rects);
        }
        set_entity_rects(new_positions);

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

            //ctx.strokeStyle = "rgba(255,0,225,0.8)";
            ctx.strokeStyle = magic_color(connection.label);
            ctx.lineWidth = 2;

            draw_bezier_with_arrow(ctx, start, control_1, control_2, end);

        }
    };

    const handel_pointer_up = () => {
        // get the selection and see if we need to update the selected ranges
        const active_tool = props.active_tool();
        if(active_tool.type!=="create-entity") return;
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
        console.log("label", active_tool.label)
        // TODO: can probs compute screen positions here too

        
        props.add_selected_range({
            start,
            end,
            label: active_tool.label,
            screen_positions:[],
            text:range.toString(),
            deleted:false,
            attributes:{}
        });
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
                "z-index": "2000",
            }}
        >{
            all_mounted() && <For each={entity_rects()}>{(rects, index) => {
                return <>{
                    rects.map( rect => <div
                        style={{
                            top:    `${rect.y}px`,
                            left:   `${rect.x}px`,
                            width:  `${rect.w}px`,
                            height: `${rect.h}px`,
                            cursor: props.active_tool().type==="create-relationship"? "grab" : undefined,
                            "background-color":magic_color(props.selected_ranges()[index()].label ?? ""),
                        }}
                        class={css`
                            position: absolute;
                            
                            border-radius: 5px;
                            &:hover {
                                background-color: rgba(128,128,0,0.8);
                            }
                        `}
                        // we are going to allow the user to drag and drop these spans onto each other
                        ondragstart={(e) => {
                            // console.log("drag start", index());
                            e.dataTransfer?.setData("text/plain", `${index()}`);
                        }}
                        ondragover={e=>{
                            e.preventDefault();
                        }}
                        draggable={props.active_tool().type==="create-relationship"? true : undefined}
                        ondrop={e=>{
                            if(!e.dataTransfer) return;
                            let active_tool = props.active_tool();
                            if(active_tool.type !== "create-relationship") return;
                            e.preventDefault();
                            const from = e.dataTransfer?.getData("text/plain");
                            if (from) {
                                // TODO: prevent repeating the same connection
                                props.connect_ranges({
                                    from: Number(from),
                                    to: index(),
                                    label: active_tool.label,
                                    deleted:false,
                                    attributes:[],
                                });
                            }
                        }}

                    ></div>)
                }</>;
            }}</For>
        }</div>
        
    </div>;
};
