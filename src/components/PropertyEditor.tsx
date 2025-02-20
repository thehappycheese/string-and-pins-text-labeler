import { Component, VoidProps, Accessor, Setter, For } from "solid-js";
import { css } from "solid-styled-components";
import { Attribute, ATTRIBUTE_TYPES } from "../state";
import { ModalStringInput } from "./ModalStringInput";


export const PropertyEditor: Component<VoidProps<{
    label: Accessor<string>;
    set_label: (new_value:string)=>void;
    type: Attribute["type"];
    set_type: (new_type:Attribute["type"])=>void
    on_remove: ()=>void
}>> = props => {
    return <div
        class={css`
            margin: 1em;
            display: grid;
            grid-template-columns: 1fr auto auto;
        `}
    >
        <ModalStringInput
            value={props.label}
            set_value={props.set_label} />
        <select onChange={e=>props.set_type(e.target.value as Attribute["type"])}>
            <For each={ATTRIBUTE_TYPES}>{
                i => <option value={i} selected={i === props.type}>{i}</option>}</For>
        </select>
        <button onClick={props.on_remove}>❌</button>
    </div>;
};
