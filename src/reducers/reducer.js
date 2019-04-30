//@flow
import { Map, List, fromJS } from "immutable";
import {
    SET_THEME,
    SET_ENCOUNTER,
    UPDATE_CREATURE,
    REMOVE_CREATURE,
    SAVE_CREATURE,
    UNSAVE_CREATURE,
} from "../actions.js";
import { createDebounced } from "../lib/state-storage.js";

/**
 * Update a creature in the encounter
 */
const updateCreatureReducer = (state: Map, data: Map): Map => {
    return state.updateIn(["encounter", "creatures"], creatures =>
        creatures.map(oldCreature => (oldCreature.get("id") === data.get("id") ? data : oldCreature))
    );
};

/**
 * Remove a creature from the encounter
 */
const removeCreatureReducer = (state: Map, data: Map): Map => {
    return state.updateIn(["encounter", "creatures"], creatures =>
        creatures.filter(oldCreature => oldCreature.get("id") !== data.get("id"))
    );
};

/**
 * Add a creature to the saved creatures
 */
const saveCreatureReducer = (state: Map, data: Map): Map => {
    return state.update("savedCreatures", savedCreatures =>
        savedCreatures.push(
            data
                .set("id", "" + Math.random())
                .set("initiative", null)
                .set("expanded", false)
        )
    );
};

/**
 * Remove a creature from the saved creatures
 */
const unsaveCreatureReducer = (state: Map, data: Map): Map => {
    return state.update("savedCreatures", savedCreatures =>
        savedCreatures.filter(creature => creature.get("id") !== data.get("id"))
    );
};

type Reducer = (state: Map, data: any) => Map;
const reducersMap: { [actionType: string]: Reducer } = {
    [SET_THEME]: (state: Map, data: string) => state.set("theme", data),
    [SET_ENCOUNTER]: (state: Map, data: Map) => state.set("encounter", data),
    [UPDATE_CREATURE]: updateCreatureReducer,
    [REMOVE_CREATURE]: removeCreatureReducer,
    [SAVE_CREATURE]: saveCreatureReducer,
    [UNSAVE_CREATURE]: unsaveCreatureReducer,
};
const stateSaver = createDebounced(1000);
export default function App(state: Map, action: { type: string, data: any }) {
    const newState =
        typeof reducersMap[action.type] === "function" ? reducersMap[action.type](state, action.data) : state;
    stateSaver(newState); // SIDE EFFECT
    return newState;
}
