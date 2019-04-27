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
import { getNewCreature } from "../../lib/creatures.js";

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
    const { classes, encounter, setEncounter, initiativeOrder, updateCreature, removeCreature, saveCreature } = props;
    const initiativeToken = encounter.get("initiativeToken");
    const creatureList = useMemo(() => {
        return map((creature: Map, index: number) => {
            const isCurrentTurn = index === initiativeToken;
            return (
                <Creature
                    creature={creature}
                    isCurrentTurn={isCurrentTurn}
                    updateCreature={updateCreature}
                    removeCreature={removeCreature}
                    saveCreature={saveCreature}
                    key={creature.get("id")}
                />
            );
        }, initiativeOrder.toArray());
    }, [initiativeToken, initiativeOrder, updateCreature, removeCreature, saveCreature]);
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
            if (window.myAnalytics) {
                window.myAnalytics.event({
                    eventCategory: "encounter",
                    eventAction: "next_turn",
                });
            }
        } else {
            //next round
            props.setEncounter(
                props.encounter.update(encounter => encounter.set("initiativeToken", 0).update("round", r => r + 1))
            );
            if (window.myAnalytics) {
                window.myAnalytics.event({
                    eventCategory: "encounter",
                    eventAction: "next_turn",
                });
                window.myAnalytics.event({
                    eventCategory: "encounter",
                    eventAction: "next_round",
                });
            }
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
                                    <Typography
                                        data-cy="welcome-message"
                                        component="p"
                                        onClick={() => {
                                            props.setEncounter(
                                                props.encounter.update("creatures", creatures =>
                                                    creatures.push(fromJS(getNewCreature()))
                                                )
                                            );
                                            if (window.myAnalytics) {
                                                window.myAnalytics.event({
                                                    eventCategory: "encounter",
                                                    eventAction: "add_creature",
                                                });
                                            }
                                        }}
                                    >
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
                    data-cy="add-creature-fab"
                    onClick={() => {
                        props.setEncounter(
                            props.encounter.update("creatures", creatures => creatures.push(fromJS(getNewCreature())))
                        );
                        if (window.myAnalytics) {
                            window.myAnalytics.event({
                                eventCategory: "encounter",
                                eventAction: "add_creature",
                            });
                        }
                    }}
                >
                    <AddIcon />
                </Fab>
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="Next turn"
                    data-cy="nex-turn-fab"
                    className={classes.fab}
                    onClick={() => {
                        nextTurn();
                    }}
                >
                    <PlayArrowIcon className={classes.extendedIcon} />
                    Next Turn
                </Fab>
            </div>
        </>
    );
}

export default memo(withStyles(styles)(memo(Encounter)));
