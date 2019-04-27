//@flow
import type { List } from "immutable";
import { reduce } from "ramda";
/**
 * Creatures a new instance
 */
export const getNewInstance = () => {
    return {
        events: [],
        tags: [],
    };
};

/**
 * Creates a new creature with default values
 */
export const getNewCreature = () => {
    return {
        name: "",
        initiative: null,
        hp: null,
        instances: [getNewInstance()],
        multiple: false,
        ac: "",
        tags: [],
        notes: "",
        link: "",
        dndAPIData: null,
        type: "😈",
        expanded: true,
        id: "c" + Math.random(),
    };
};

const sumEvents = reduce((acc: number, ev: number) => {
    return acc + ev;
}, 0);
/**
 * Compute current HP from max HP and a list of events (damage + healing)
 */
export const getCurrentHP = (maxHP: number, events: List): number => {
    const diff = sumEvents(events.toJS());
    return maxHP + diff;
};
