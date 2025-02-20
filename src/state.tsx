import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { alice_text } from "./alice";

export type Rectangle = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type Entity = {
    label: string;
    text: string;
    start: number;
    end: number;
    attributes:object;
    screen_positions: Rectangle[];
    deleted:boolean;
};

export type Relationship = {
    label: string;
    from: number;
    to: number;
    attributes:object;
    deleted:boolean;
};

export type ItemWithAttributes = {
    label:string,
    attributes:Attribute[]
}

export const ATTRIBUTE_TYPES = ["string","boolean","number","date","color"] as const;

export type Attribute = {
    label:string;
    type:(typeof ATTRIBUTE_TYPES)[number];
}


export type ActiveTool = {
    type: "none"
} | {
    type: "create-entity"
    label: string;
} | {
    type: "create-relationship"
    label: string;
} | {
    type:"remove-entity"
} | {
    type:"remove-relationship"
};

export type Selection = {
    type: "none"
} | {
    type: "entity",
    index: number
} | {
    type:"relationship",
    index: number
}

export type State = {
    active_document_text: string;
    active_tool: ActiveTool;
    entity_templates: ItemWithAttributes[];
    relationship_templates: ItemWithAttributes[];
    selected_ranges: Entity[];
    connected_ranges: Relationship[];
    selection: Selection
};

export const [state, set_state] = makePersisted(
    createStore<State>(
        {
            active_document_text: alice_text,
            active_tool: {
                type: "create-entity",
                label: "Person"
            },

            entity_templates: [
                {
                    label:"Person",
                    attributes:[
                        {
                            label:"Name",
                            type:"string",
                        }
                    ],
                },
                {
                    label:"Place",
                    attributes:[],
                },
                {
                    label:"Thing",
                    attributes:[],
                },
                {
                    label:"Time",
                    attributes:[],
                },
                {
                    label:"Event",
                    attributes:[],
                },
            ],

            relationship_templates: [
                {
                    label:"Is in",
                    attributes:[]
                },
                {
                    label:"Related To",
                    attributes:[]
                }
            ],

            selection:{
                type:"none"
            },

            selected_ranges: [
                
            ],
            connected_ranges: [

            ]
        }
    ),
    { 
        name: "string-and-pins",
        
    }
);
