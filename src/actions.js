//@flow
export const SET_THEME = "SET_THEME";
export const SET_ENCOUNTER = "SET_ENCOUNTER";
export const UPDATE_CREATURE = "UPDATE_CREATURE";

type ReduxAction = { type: string, data: any };
import type { Map, List } from "immutable";

export const setTheme = (theme: "light" | "dark"): ReduxAction => {
    return { type: SET_THEME, data: theme };
};

export const setEncounter = (encounter: Map): ReduxAction => {
    return { type: SET_ENCOUNTER, data: encounter };
};

export const updateCreature = (creature: Map): ReduxAction => {
    return { type: UPDATE_CREATURE, data: creature };
};
