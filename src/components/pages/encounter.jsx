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
import Link from "@material-ui/core/Link";
import Notifications from "../material/notifications.jsx";

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
            <Grid container>
                <Grid item xs={12}>
                    {creatureList}
                    {props.initiativeOrder.size <= 0 ? (
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={1} className={classes.welcomeMessage}>
                                    <Typography data-cy="welcome-message-2" component="p">
                                        {"This is a simple combat tracker for D&D."}
                                        <br />
                                        <ul>
                                            <li>{"Track rounds, turn order and HP"}</li>
                                            <li>{"Manage groups of creatures"}</li>
                                            <li>{"Save creatures for later use"}</li>
                                            <li>{"Works offline"}</li>
                                        </ul>
                                        <br />
                                        {`If you want to help me improve this app, please enable data collection in the settings.`}
                                    </Typography>
                                </Paper>
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
                                <Paper elevation={1} className={classes.welcomeMessage}>
                                    <Typography data-cy="welcome-message-2" component="p">
                                        {"This app is a "}
                                        <Link
                                            href="https://en.wikipedia.org/wiki/Progressive_web_applications"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="inherit"
                                        >
                                            {"Progressive Web Application"}
                                        </Link>
                                        {"."}
                                        <br />
                                        {"If your browser supports it, you can install it."}
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
                    className={classes.fab}
                    data-cy="add-creature-fab"
                    title="Add a creature"
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
                    data-cy="nex-turn-fab"
                    title="Next turn"
                    className={classes.fab}
                    onClick={() => {
                        nextTurn();
                    }}
                >
                    <PlayArrowIcon className={classes.extendedIcon} />
                    Next Turn
                </Fab>
            </div>
            <Notifications savedCreatures={props.savedCreatures} />
        </>
    );
}

export default memo(withStyles(styles)(memo(Encounter)));
