//@flow
import { createSelector } from "reselect";
import { Map, List } from "immutable";

export const creaturesSelector = (state: Map): List => state.getIn(["encounter", "creatures"]);

/**
 * Returns creatures sorted by initiative score
 */
export const creaturesSortedSelector = createSelector<Map, void, List<Map>, List<Map>>(
    creaturesSelector,
    (creatures: List<Map>): List<Map> => {
        return creatures.sort((a, b) => {
            return a.get("initiative") === b.get("initiative") ? 0 : a.get("initiative") < b.get("initiative") ? 1 : -1;
        });
    }
);
