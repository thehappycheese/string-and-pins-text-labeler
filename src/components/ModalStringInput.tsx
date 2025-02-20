import {
    Accessor,
    Component,
    createEffect,
    createSignal,
    VoidProps,
} from "solid-js";
import styles from "./ModalStringInput.module.css";

export const ModalStringInput: Component<
    VoidProps<{
        value: Accessor<string>;
        set_value:(new_value:string)=>void;
    }>
> = (props) => {
    const [temp_value, set_temp_value] = createSignal(props.value());
    const [in_edit_mode, set_in_edit_mode] = createSignal(false);
    
    const open_for_edit = () => {
        set_temp_value(props.value());
        set_in_edit_mode(true);
    };
    const close_and_apply = () => {
        props.set_value(temp_value());
        set_in_edit_mode(false);
    };
    const close_and_cancel = () => {
        set_temp_value(props.value());
        set_in_edit_mode(false);
    };

    const inp = (
        <input
            value={temp_value()}
            onInput={(e) => set_temp_value(e.target.value)}
            onBlur={close_and_apply}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    close_and_apply();
                } else if (e.key === "Escape") {
                    close_and_cancel();
                }
            }}
        />
    ) as HTMLInputElement;

    createEffect(() => {
        if (in_edit_mode()) {
            inp.focus();
        }
    });

    return (
        <div
            class={styles.main}
        >
            {in_edit_mode()
            ? <>
                {inp}
                <button onClick={close_and_apply} >✔️</button>
            </>
            : (
                <>
                    <div onDblClick={open_for_edit}>{props.value()}</div>
                    <button onClick={open_for_edit} >✏️</button>
                </>
            )}
        </div>
    );
};
