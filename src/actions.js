//@flow
export const SET_THEME = "SET_THEME";
export const SET_ENCOUNTER = "SET_ENCOUNTER";
export const UPDATE_CREATURE = "UPDATE_CREATURE";
export const REMOVE_CREATURE = "REMOVE_CREATURE";
export const SAVE_CREATURE = "SAVE_CREATURE";
export const UNSAVE_CREATURE = "UNSAVE_CREATURE";

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
export const removeCreature = (creature: Map): ReduxAction => {
    return { type: REMOVE_CREATURE, data: creature };
};
export const saveCreature = (creature: Map): ReduxAction => {
    return { type: SAVE_CREATURE, data: creature };
};
export const unsaveCreature = (creature: Map): ReduxAction => {
    return { type: UNSAVE_CREATURE, data: creature };
};
