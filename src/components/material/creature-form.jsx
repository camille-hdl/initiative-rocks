//@flow
import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import type { Map } from "immutable";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});
type Props = {
    creature: Map,
    classes: any,
    updateCreature: (newCreature: Map) => void,
};
const identity = v => v;

/**
 * Form for a creature. If the creature is set as "multiple", we use the same name and initiative for a group of
 * creatures.
 * each individual in the group is an "instance"
 */
function CreatureForm(props: Props) {
    const { classes, creature, updateCreature } = props;
    const handleChange = (prop: string, transformer?: (val: any) => any = identity) => ev =>
        updateCreature(creature.set(prop, transformer(ev.target.value)));
    return (
        <form className={classes.container} noValidate autoComplete="off">
            <TextField
                label="Creature name"
                className={classes.textField}
                value={creature.get("name")}
                onChange={handleChange("name")}
                margin="normal"
            />
            <TextField
                label="Initiative"
                className={classes.textField}
                value={isNaN(creature.get("initiative")) ? "" : creature.get("initiative")}
                onChange={handleChange("initiative", v => (isNaN(v) ? null : +v))}
                margin="normal"
                type="number"
            />
            <TextField
                label="Max HP"
                className={classes.textField}
                value={isNaN(creature.get("hp")) ? "" : creature.get("hp")}
                onChange={handleChange("hp", v => (isNaN(v) ? null : +v))}
                margin="normal"
                type="number"
            />
        </form>
    );
}

export default memo(withStyles(styles)(CreatureForm));
