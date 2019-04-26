//@flow
import { Map, List, fromJS } from "immutable";
import { SET_THEME, SET_ENCOUNTER, UPDATE_CREATURE } from "../actions.js";

const updateCreatureReducer = (state: Map, data: Map): Map => {
    return state.updateIn(["encounter", "creatures"], creatures =>
        creatures.map(oldCreature => (oldCreature.get("id") === data.get("id") ? data : oldCreature))
    );
};

type Reducer = (state: Map, data: any) => Map;
const reducersMap: { [actionType: string]: Reducer } = {
    [SET_THEME]: (state: Map, data: string) => state.set("theme", data),
    [SET_ENCOUNTER]: (state: Map, data: Map) => state.set("encounter", data),
    [UPDATE_CREATURE]: updateCreatureReducer,
};
export default function App(state: Map, action: { type: string, data: any }) {
    return typeof reducersMap[action.type] === "function" ? reducersMap[action.type](state, action.data) : state;
}
