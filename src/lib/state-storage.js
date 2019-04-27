//@flow
import localforage from "localforage";
import { fromJS, Map } from "immutable";
import debounce from "debounce";

const KEY = "init-rocks-state";

export const restoreState = (): Promise => {
    return localforage
        .getItem(KEY)
        .then(val => {
            if (val) return fromJS(val);
            return null;
        })
        .catch(err => err);
};

export const storeState = (state: Map) => {
    localforage.setItem(KEY, state.toJS());
};

export const createDebounced = (ms: number) => debounce(storeState, ms);
