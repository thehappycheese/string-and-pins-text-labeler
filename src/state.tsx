import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { alice_text } from "./alice";


export type Entity = {
    label: string;
    start: number;
    end: number;
};
export type Relationship = {
    label: string;
    from: number;
    to: number;
};
export type active_tool = {
    type: "none"
}|{
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

export type State = {
    active_document_text: string;
    active_tool: active_tool;
    entity_labels: string[];
    relationship_labels: string[];
    selected_ranges: Entity[];
    connected_ranges: Relationship[];
};

export const [state, set_state] = makePersisted(
    createStore<State>(
        {
            active_document_text: alice_text,
            active_tool: {
                type: "create-entity",
                label: "Character"
            },

            entity_labels: [
                "Character",
                "Location",
                "Event",
            ],

            relationship_labels: [
                "Is in",
                "Is related to",
            ],

            selected_ranges: [
                { start: 8, end: 25    , label: "Character" },
                { start: 150, end: 220 , label: "Character" },
                { start: 350, end: 360 , label: "Character" },
            ],
            connected_ranges: [
                { from: 0, to: 1, label:"Is related to"},
                { from: 1, to: 0, label:"Is related to"},
                { from: 1, to: 2, label:"Is related to"},
            ]
        }
    ),
    { name: "string-and-pins" }
);
