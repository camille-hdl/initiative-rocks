//@flow
import React, { useMemo, memo } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import type { Props } from "../index.jsx";
import { fromJS, Map } from "immutable";
import { map as _map, addIndex } from "ramda";
import Creature from "../material/creature-foldable.jsx";

const map = addIndex(_map);

const getNewInstance = () => {
    return {
        events: [],
        tags: [],
    };
};

/**
 * Creates a new creature with default values
 */
const getNewCreature = () => {
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
        type: "monster",
        expanded: true,
        id: "c" + Math.random(),
    };
};

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit,
    },
    fabContainer: {
        position: "absolute",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    welcomeMessage: {
        ...theme.mixins.gutters(),
        marginTop: theme.spacing.unit * 4,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

/**
 * Displays all the creatures in the encounter,
 * manages the turn order
 */
function Encounter(props: Props & { classes: any }) {
    const { classes, encounter, setEncounter, initiativeOrder, updateCreature } = props;
    const initiativeToken = encounter.get("initiativeToken");
    const creatureList = useMemo(() => {
        return map((creature: Map, index: number) => {
            const isCurrentTurn = index === initiativeToken;
            return (
                <Creature
                    creature={creature}
                    isCurrentTurn={isCurrentTurn}
                    updateCreature={updateCreature}
                    key={creature.get("id")}
                />
            );
        }, initiativeOrder.toArray());
    }, [initiativeToken, initiativeOrder, updateCreature]);
    /**
     * If there is a creature below in the initiative order, we proceed.
     * Otherwise, we go to the next round
     */
    const nextTurn = () => {
        if (props.encounter.get("creatures").size <= 0) return;
        if (props.encounter.get("initiativeToken") < props.encounter.get("creatures").size - 1) {
            // we continue in the current round
            props.setEncounter(
                props.encounter.update(encounter => encounter.update("initiativeToken", token => token + 1))
            );
        } else {
            //next round
            props.setEncounter(
                props.encounter.update(encounter => encounter.set("initiativeToken", 0).update("round", r => r + 1))
            );
        }
    };
    return (
        <>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    {creatureList}
                    {props.initiativeOrder.size <= 0 ? (
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} className={classes.welcomeMessage}>
                                    <Typography component="p">
                                        {"Start by adding creatures! Click on the '+' button below"}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
            <div className={classes.fabContainer}>
                <Fab
                    color="secondary"
                    aria-label="Add a creature"
                    className={classes.fab}
                    onClick={() => {
                        props.setEncounter(
                            props.encounter.update("creatures", creatures => creatures.push(fromJS(getNewCreature())))
                        );
                    }}
                >
                    <AddIcon />
                </Fab>
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="Next turn"
                    className={classes.fab}
                    onClick={() => nextTurn()}
                >
                    <PlayArrowIcon className={classes.extendedIcon} />
                    Next Turn
                </Fab>
            </div>
        </>
    );
}

export default memo(withStyles(styles)(memo(Encounter)));