import { Component, ParentProps, createSignal, createContext, useContext, Accessor, Signal, Setter } from "solid-js";
import { css } from "solid-styled-components";
import { magic_color } from "../util/magic_color";

const SelectorContext = createContext<{
    selected: Accessor<string | null>;
    setSelected: (val: string) => void;
} | null>(null);

// export type SelectorHostProps<T> = ParentProps<{
//     sharedValue: [Accessor<T>, (val: T) => void];
//     mapSelection: (val: string) => T; // Function to transform selected value into any shape
//   }>;

export const SelectorHost: Component<ParentProps<{
    value: Accessor<string|null>
    set_value: (new_val:string|null)=>void
}>> = (props) => {
    return (
        <SelectorContext.Provider value={{ selected: props.value, setSelected: props.set_value }}>
            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "0.3em",
                }}
            >
                {props.children}
            </div>
        </SelectorContext.Provider>
    );
};

export const IconTextSelection = () => <svg viewBox="0 0 16 24"  height="100%">
    <rect x="8" y="2" width="2" height="20" fill="currentColor" />
    <rect x="0" y="0" width="8" height="2" fill="currentColor" />
    <rect x="10" y="0" width="8" height="2" fill="currentColor" />
    <rect x="0" y="22" width="8" height="2" fill="currentColor" />
    <rect x="10" y="22" width="8" height="2" fill="currentColor" />
</svg>

export const SelectorOption: Component<{ text: string; value: string }> = (props) => {
    const color = magic_color(props.text);
    const ctx = useContext(SelectorContext);
    if (!ctx) throw new Error("SelectorOption must be used within a SelectorHost");

    const is_active = () => ctx.selected() === props.value;

    return (
        <div
            style={{
                
            }}
            class={css`
                padding: 0.5em;
                border-radius: 0.4em;
                border: 1px solid grey;
                cursor: pointer;
                &:hover {
                    border-color: white;
                }
                display: flex;
                gap: 0.5em;
            `}
            onClick={() => ctx.setSelected(props.value)}
        >
            <div
                style={{
                    "background-color": color,
                }}
                class={css`
                    border: 1px solid grey;
                    border-radius: 50%;
                    width: 1em;
                    height: 1em;
                `}
            >{
                is_active()
                && <div
                    class={css`
                        border: 3px solid color-mix(in srgb, currentColor 70%, transparent);
                        box-sizing: border-box;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    `}
                ></div>
            }</div>{" "}
            <div>
                {props.text}
            </div>
            <div
                style={{
                    "margin-left": "auto",
                }}
            >

                {is_active() && <IconTextSelection />}
            </div>
        </div>
    );
};

