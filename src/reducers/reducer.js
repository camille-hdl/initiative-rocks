//@flow
import { Map, List, fromJS } from "immutable";
import { SET_THEME, SET_ENCOUNTER, UPDATE_CREATURE, REMOVE_CREATURE, SAVE_CREATURE } from "../actions.js";

const updateCreatureReducer = (state: Map, data: Map): Map => {
    return state.updateIn(["encounter", "creatures"], creatures =>
        creatures.map(oldCreature => (oldCreature.get("id") === data.get("id") ? data : oldCreature))
    );
};
const removeCreatureReducer = (state: Map, data: Map): Map => {
    return state.updateIn(["encounter", "creatures"], creatures =>
        creatures.filter(oldCreature => oldCreature.get("id") !== data.get("id"))
    );
};
const saveCreatureReducer = (state: Map, data: Map): Map => {
    return state.update("savedCreatures", savedCreatures => savedCreatures.push(data.set("id", "" + Math.random())));
};

type Reducer = (state: Map, data: any) => Map;
const reducersMap: { [actionType: string]: Reducer } = {
    [SET_THEME]: (state: Map, data: string) => state.set("theme", data),
    [SET_ENCOUNTER]: (state: Map, data: Map) => state.set("encounter", data),
    [UPDATE_CREATURE]: updateCreatureReducer,
    [REMOVE_CREATURE]: removeCreatureReducer,
    [SAVE_CREATURE]: saveCreatureReducer,
};
export default function App(state: Map, action: { type: string, data: any }) {
    return typeof reducersMap[action.type] === "function" ? reducersMap[action.type](state, action.data) : state;
}
