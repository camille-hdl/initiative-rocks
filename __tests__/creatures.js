import { getCurrentHP } from "../src/lib/creatures";
import { List } from "immutable";
test("getCurrentHP", () => {
    const events = List([-10, 5]);
    expect(getCurrentHP(20, events)).toEqual(15);
});