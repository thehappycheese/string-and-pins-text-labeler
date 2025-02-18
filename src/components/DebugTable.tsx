import { Component, createSignal, createEffect, For } from "solid-js";
import styles from "./DebugTable.module.css";

export const DebugTable: Component<{
    items: Record<string, any>[];
    show_index?: boolean;
    exclude_keys?: Set<string>;
}> = (props) => {
    const [key_set, set_key_set] = createSignal([...new Set(props.items.flatMap(Object.keys))]);
    createEffect(() => {
        set_key_set([...new Set(props.items.flatMap(Object.keys))].filter(i => !(props.exclude_keys?.has(i) ?? false)));
    });
    return <table class={styles.debug_table}>
        <thead>
            <tr>
                {props.show_index && <th>#</th>}
                <For each={key_set()}>{key => <th>{key}</th>}</For>
            </tr>
        </thead>
        <tbody>
            <For each={props.items}>{(item, index) => (
                <tr>
                    {props.show_index && <td>{index()}</td>}
                    <For each={key_set().map(i => item[i])}>{cell => <td>{cell}</td>}</For>
                </tr>
            )}</For>
        </tbody>
    </table>;
};
