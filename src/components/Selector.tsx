import { Component, ParentProps } from "solid-js";
import { css } from "solid-styled-components";
import { magic_color } from "../util/magic_color";

export const SelectorHost: Component<ParentProps> = (props) => <div
    style={{
        display: "flex",
        "flex-direction": "column",
        gap: "0.2em",
    }}
>
    {props.children}
</div>;
export const SelectorOption: Component<{
    text: string;
    highlighted: boolean;
}> = (props) => {
    return <div
        style={{
            "background-color": magic_color(props.text),
        }}
        class={css`
            padding:0.3em;
            border-radius:0.4em;
            border:1px solid grey;
            &:hover{
                border-color:white;
            }
        `}
    ><div
        style={{
            display: "inline-block",
            background: props.highlighted ? "#DDD" : "#111",
            border: "1px solid grey",
            width: "0.8em",
            height: "0.8em",
        }}
    ></div>{" "}
        {props.text}</div>;
};
