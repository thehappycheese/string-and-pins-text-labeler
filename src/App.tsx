import { SelectorHost, SelectorOption } from "./components/Selector";
import { TextHost } from "./components/TextHost";
import { styled } from "solid-styled-components";
import { Portal } from "solid-js/web";
import { For } from "solid-js";
import { set_state, state } from "./state";





export const Menu = styled("div")`flex:0 1 20em;`;

const MenuHeader = styled("div")`
    font-size: 1.1em;
    font-weight: bold;
    margin: 0.5em 0;`;

export const MainView = styled("div")`
    border-radius: 0.5em;
    border: 1px solid grey;
    padding: 0.3em 3em;
    overflow-y: scroll;
    
    flex: 1;
    line-height: 1.5em;`;


function App() {

    const dialog_load_document = <dialog
        style={{
            width: "80%",
            height: "80%",
        }}
    >
        <div
            style={{
                "display": "flex",
                "flex-direction": "column",
                "gap": "1em",
                "padding": "1em",
                "width": "100%",
                "height": "100%",
            }}
        >
            <div>
                <h1>Load Document</h1>
            </div>
            <div>
                <textarea rows={30} cols={120}
                style={{
                    "width": "100%",
                    "font-size": "0.8em",
                }}
                ></textarea>
            </div>
            <div>
                <button
                    onClick={() => {
                        const textarea = dialog_load_document.querySelector("textarea")!;
                        set_state("connected_ranges", []);
                        set_state("selected_ranges", []);
                        set_state("active_document_text", textarea.value);
                        dialog_load_document.close();
                    }}
                >Load</button>
                <button
                    onClick={() => {
                        dialog_load_document.close();
                    }}
                >Cancel</button>
            </div>
        </div>
    </dialog> as HTMLDialogElement;

    return <>
        <Menu>
            <button
                onClick={() => {
                    dialog_load_document.showModal();
                }}
            >Load Document</button>
            <Portal>{dialog_load_document}</Portal>
            <MenuHeader>Entity</MenuHeader>
            <SelectorHost shared_value={[()=>(state.active_tool as any).label, new_val=>set_state("active_tool", new_val as any)]}>
                <For each={state.entity_labels}>{entity_label=>
                    <SelectorOption text={entity_label} value={`E-${entity_label}`}/>
                }</For>
            </SelectorHost>
            <MenuHeader>Connect</MenuHeader>
            <SelectorHost shared_value={[()=>(state.active_tool as any).label, new_val=>set_state("active_tool", new_val as any)]}>
                <For each={state.relationship_labels}>{relationship_label=>(
                    <SelectorOption text={relationship_label} value={`R-${relationship_label}`}/>
                )}</For>
            </SelectorHost>
            <button
                onClick={() => {
                    set_state(
                        "selected_ranges",
                        state.selected_ranges.length,
                        {start:90, end:100}
                    );
                    set_state(
                        "connected_ranges",
                        state.connected_ranges.length,
                        {from:0, to:state.selected_ranges.length-1}
                    );
                }}
            >doop</button>

            <button
                onClick={() => {
                    localStorage.removeItem("string-and-pins");
                    location.reload();
                }}
            >Reset</button>

            <table
                style={{
                    width: "100%",
                    "border-collapse": "collapse",
                    "margin-top": "1em",
                    "border": "1px solid grey",
                }}
            >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Start</th>
                        <th>End</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={state.selected_ranges}>{(range, index)=>(
                        <tr>
                            <td>{index()}</td>
                            <td>{range.start}</td>
                            <td>{range.end}</td>
                        </tr>
                    )}</For>
                </tbody>

            </table>

            

        </Menu>
        <MainView>
            <TextHost
                selected_ranges={()=>state.selected_ranges}
                add_selected_range={(range)=>set_state("selected_ranges", state.selected_ranges.length, range)}
                connected_ranges={()=>state.connected_ranges}
                text_content={()=>state.active_document_text}
            />
        </MainView>
    </>
}

export default App;
