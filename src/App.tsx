import { SelectorHost, SelectorOption } from "./components/Selector";
import { TextHost } from "./components/TextHost";
import { styled } from "solid-styled-components";
import { Portal } from "solid-js/web";
import { For, Show } from "solid-js";
import { set_state, state } from "./state";
import { DebugTable } from "./components/DebugTable";
import { PropertyEditor } from "./components/PropertyEditor";
import { produce } from "solid-js/store";





export const Menu = styled("div")`flex:0 1 20em;`;

const MenuHeader = styled("div")`
    font-size: 1.1em;
    font-weight: bold;
    margin: 1em 0em 0.5em 0em;
    border-bottom:1px solid grey;`;

export const MainView = styled("div")`
    border-radius: 0.5em;
    border: 1px solid grey;
    overflow:hidden;
    
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
            <SelectorHost
                value={()=>state.active_tool.type !=="create-entity"? null : state.active_tool.label}
                set_value={new_val=>set_state(
                    "active_tool",
                    new_val===null
                    ?{type:"none"}
                    :{
                        type:"create-entity",
                        label: new_val
                    }
                )}
            >
                <For each={state.entity_templates}>{template=>
                    <SelectorOption text={template.label} value={`${template.label}`}/>
                }</For>
            </SelectorHost>
            <MenuHeader>Connect</MenuHeader>
            <SelectorHost
                value={()=>state.active_tool.type !=="create-relationship"? null : state.active_tool.label}
                set_value={new_val=>set_state(
                    "active_tool",
                    new_val===null
                    ?{type:"none"}
                    :{
                        type:"create-relationship",
                        label: new_val
                    }
                )}
            >
                <For each={state.relationship_templates}>{template=>(
                    <SelectorOption text={template.label} value={`${template.label}`}/>
                )}</For>
            </SelectorHost>

            <MenuHeader>Debug</MenuHeader>
            <DebugTable items={state.selected_ranges}  show_index={true} exclude_keys={new Set(["screen_positions"])}/>
            <DebugTable items={state.connected_ranges} show_index={true}/>
            <MenuHeader>Debug Actions</MenuHeader>
            <button
                onClick={() => {
                    localStorage.removeItem("string-and-pins");
                    location.reload();
                }}
            >Reset</button>
            <div>{
                JSON.stringify(state.entity_templates)
            }</div>
        </Menu>
        <MainView>
            <TextHost
                selected_ranges={()=>state.selected_ranges}
                add_selected_range={range=>set_state("selected_ranges", state.selected_ranges.length, range)}
                connected_ranges={()=>state.connected_ranges}
                connect_ranges={new_rel=>set_state("connected_ranges", state.connected_ranges.length, new_rel)}
                text_content={()=>state.active_document_text}
                    active_tool={()=>state.active_tool}
            />
        </MainView>
        <Menu>
            {
                <Show when={state.active_tool.type==="create-entity"}>
                    <For each={
                        state.entity_templates.find(i=>i.label===(state.active_tool as any).label)?.attributes
                    }>{ (attribute, index) => {
                        
                        return <div>
                            <PropertyEditor
                                label={()=>attribute.label}
                                set_label={new_value=>set_state(produce(state =>
                                    state.entity_templates
                                    .filter(i=>i.label===(state.active_tool as any).label)
                                    .forEach(i=>i.attributes[index()].label=new_value)
                                ))}
                                type={attribute.type}
                                set_type={new_type=>{
                                    set_state(produce(state=>{
                                        state.entity_templates
                                        .filter(i=>i.label===(state.active_tool as any).label)
                                        .forEach(i=>i.attributes[index()].type = new_type);
                                    }))
                                }}
                                on_remove={()=>{
                                    set_state(produce(state=>{
                                        state.entity_templates
                                        .filter(i=>i.label===(state.active_tool as any).label)
                                        .forEach(entity_template=>entity_template.attributes.splice(index(),1));
                                    }))
                                }}
                            />
                        </div>
                    }}</For>
                    <hr/>
                    <button
                        onClick={()=>set_state(produce(state=>state
                            .entity_templates
                            .filter(i=>i.label===(state.active_tool as any).label)
                            .forEach(attr=>attr.attributes.push({
                                label:`Attribute-${attr.attributes.length}`,
                                type:"string"
                            }))
                        ))}
                    >➕</button>
                </Show>
            }
            
        </Menu>
    </>
}


export default App;
