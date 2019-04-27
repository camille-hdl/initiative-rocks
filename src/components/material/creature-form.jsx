//@flow
import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { includes, partialRight, head, map } from "ramda";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import type { Map } from "immutable";
import CreatureInstances from "./creature-instances.jsx";

const allowedCreatureTypes = ["😈", "🧝‍♀️"];
/**
 * Returns true if the value is an accepter type
 */
const isAllowedType = partialRight(includes, [allowedCreatureTypes]);

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    textFieldFull: {
        width: "100%",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
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
    const handleChangeBool = (prop: string, transformer?: (val: any) => any = identity) => ev =>
        updateCreature(creature.set(prop, transformer(ev.target.checked)));
    const isMultiple = creature.get("type") === "😈" && creature.get("multiple");

    /**
     * If we need the third col or not
     */
    const smCols = creature.get("type") === "😈" ? 4 : 6;
    return (
        <Grid container spacing={24} data-cy="creature-form">
            <Grid item xs={12} sm={smCols}>
                <form noValidate autoComplete="off">
                    <FormControl className={classes.textField}>
                        <TextField
                            disabled={creature.get("expanded") ? null : true}
                            data-cy="creature-name"
                            label="Creature name"
                            value={creature.get("name")}
                            onChange={handleChange("name")}
                            margin="normal"
                        />
                    </FormControl>
                    <FormControl className={classes.textField}>
                        <TextField
                            disabled={creature.get("expanded") ? null : true}
                            data-cy="creature-init"
                            label="Initiative"
                            value={isNaN(creature.get("initiative")) ? "" : creature.get("initiative")}
                            onChange={handleChange("initiative", v => (isNaN(v) ? null : +v))}
                            margin="normal"
                            type="number"
                        />
                    </FormControl>
                    <FormControl className={classes.textField}>
                        <TextField
                            disabled={creature.get("expanded") ? null : true}
                            data-cy="creature-max-hp"
                            label="Max HP"
                            value={isNaN(creature.get("hp")) ? "" : creature.get("hp")}
                            onChange={handleChange("hp", v => (isNaN(v) ? null : +v))}
                            margin="normal"
                            type="number"
                        />
                    </FormControl>
                    <FormControl className={classes.textField}>
                        <InputLabel htmlFor="creature-type">NPC or PC</InputLabel>
                        <Select
                            disabled={creature.get("expanded") ? null : true}
                            data-cy="creature-type"
                            value={creature.get("type")}
                            onChange={handleChange("type", v => (isAllowedType(v) ? v : head(allowedCreatureTypes)))}
                            input={<Input name="age" id="creature-type" />}
                        >
                            {map(
                                type => (
                                    <MenuItem value={type} key={type}>
                                        {type}
                                    </MenuItem>
                                ),
                                allowedCreatureTypes
                            )}
                        </Select>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={12} sm={smCols}>
                <FormControl className={classes.textFieldFull}>
                    <TextField
                        disabled={creature.get("expanded") ? null : true}
                        data-cy="creature-notes"
                        label="Notes"
                        value={creature.get("notes")}
                        onChange={handleChange("notes")}
                        margin="normal"
                        multiline
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={smCols}>
                {creature.get("type") === "😈" ? (
                    <FormControl className={classes.textField}>
                        <FormControlLabel
                            control={
                                <Switch
                                    disabled={creature.get("expanded") ? null : true}   
                                    data-cy="toggle-multiple"
                                    checked={creature.get("multiple")}
                                    onChange={handleChangeBool("multiple", v => !!v)}
                                    value={creature.get("multiple")}
                                />
                            }
                            label="Multiple"
                        />
                    </FormControl>
                ) : null}
                {isMultiple ? <CreatureInstances creature={creature} updateCreature={updateCreature} /> : null}
            </Grid>
        </Grid>
    );
}

export default memo(withStyles(styles)(CreatureForm));
