//@flow
import React, { useState, useEffect, useRef } from "react";

import { withStyles } from "@material-ui/core/styles";
import { map as _map, addIndex } from "ramda";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import green from "@material-ui/core/colors/green";
import lime from "@material-ui/core/colors/lime";
import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import { getCurrentHP } from "../../lib/creatures.js";
import * as _exprEval from "expr-eval";
import { Map, List } from "immutable";
const exprEval = _exprEval.default;
const map = addIndex(_map);
const styles = theme => ({
    paper: {
        position: "absolute",
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        width: theme.spacing.unit * 70,
        maxWidth: "100%",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: "none",
    },
    amountInput: {
        width: "100%",
    },
    buttonHealing: {
        marginLeft: "5%",
        borderColor: green[500],
        width: "45%",
    },
    buttonDamage: {
        marginRight: "5%",
        borderColor: red[500],
        width: "45%",
    },
    buttonFullHP: {
        color: green[500],
        borderColor: green[500],
    },
    button75HP: {
        color: lime[600],
        borderColor: lime[600],
    },
    button50HP: {
        color: amber[700],
        borderColor: amber[700],
    },
    button25HP: {
        color: orange[700],
        borderColor: orange[700],
    },
    button0HP: {
        color: red[400],
        borderColor: red[400],
    },
    eventNeutral: {
        padding: theme.spacing.unit,
        color: "#F0F0F0",
    },
    eventDamage: {
        padding: theme.spacing.unit,
        color: red[400],
    },
    eventHealing: {
        padding: theme.spacing.unit,
        color: green[500],
    },
});

type Props = {
    creature: Map,
    instance: Map,
    updateInstance: (i: Map) => void,
    classes: any,
};
let lastValidExpression = "";
const computeExpr = (str: string): number => {
    if (!str) {
        lastValidExpression = "";
        return 0;
    }
    try {
        const parser = new exprEval.Parser();
        const expr = parser.parse(str);
        const result = Math.floor(expr.evaluate());
        lastValidExpression = str;
        return result;
    } catch (e) {
        return computeExpr(lastValidExpression);
    }
};
const getOverheal = (maxHP: number, futureEvents: List): number => {
    const futureMaxHP = getCurrentHP(maxHP, futureEvents);
    return maxHP < futureMaxHP ? futureMaxHP - maxHP : 0;
};

const getButtonClass = (maxHP: number, amount: number): string => {
    const pct = (amount / maxHP) * 100;
    if (pct >= 98) return "buttonFullHP";
    if (pct >= 75) return "button75HP";
    if (pct >= 50) return "button50HP";
    if (pct >= 25) return "button25HP";
    return "button0HP";
};

/**
 * This element manages HP display on a creature, as well as the HP modification modal.
 * The input is focused when the modal is opened, as only one modal can be usable at once
 */
function HpManager(props: Props) {
    const amountInputRef = useRef();
    const inputRef = amountInputRef.current;
    const { classes, creature, instance, updateInstance } = props;
    const [open, setOpen] = useState(false);
    const [hasRef, setHasRef] = useState(false);
    const [expr, setExpr] = useState("");
    const amount = computeExpr(expr);
    const currentHP = getCurrentHP(creature.get("hp"), instance.get("events"));
    useEffect(() => {
        if (hasRef && open && amountInputRef.current) {
            amountInputRef.current.focus();
        }
    }, [open, inputRef, hasRef, amountInputRef]);
    return (
        <>
            <Button
                data-cy="hp-manager-toggle"
                variant="outlined"
                className={classes[getButtonClass(creature.get("hp"), currentHP)]}
                onClick={e => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
            >
                {`${currentHP} / ${creature.get("hp")}`}
                {currentHP <= 0 ? " 💀" : null}
            </Button>
            <Modal open={open} onClick={e => e.stopPropagation()} onClose={() => setOpen(false)}>
                <div className={classes.paper} data-cy="hp-manager-modal">
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" id="amount" data-cy="hp-manager-amount">
                                {amount}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={ref => {
                                    amountInputRef.current = ref;
                                    if (ref) {
                                        setHasRef(true);
                                    } else {
                                        setHasRef(false);
                                    }
                                }}
                                data-cy="hp-manager-input"
                                className={classes.amountInput}
                                placeholder="ex: 14+15/2"
                                label="Amount"
                                value={expr}
                                onChange={e => setExpr(e.target.value)}
                                margin="normal"
                                inputProps={{ inputMode: "numeric" }}
                                onKeyPress={ev => {
                                    if (ev.which === 13) {
                                        if (amount === 0) return;
                                        setExpr("");
                                        setOpen(false);
                                        updateInstance(instance.update("events", events => events.push(amount * -1)));
                                        if (window.myAnalytics) {
                                            window.myAnalytics.event({
                                                eventCategory: "encounter",
                                                eventAction: "damage_creature",
                                                eventLabel: expr,
                                            });
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                data-cy="hp-manager-damage"
                                variant="outlined"
                                className={classes.buttonDamage}
                                title="Damage the creature (press enter)"
                                onClick={() => {
                                    if (amount === 0) return;
                                    setExpr("");
                                    setOpen(false);
                                    updateInstance(instance.update("events", events => events.push(amount * -1)));
                                    if (window.myAnalytics) {
                                        window.myAnalytics.event({
                                            eventCategory: "encounter",
                                            eventAction: "damage_creature",
                                            eventLabel: expr,
                                        });
                                    }
                                }}
                            >
                                <span role="img" aria-label="Damage">
                                    ⚔️
                                </span>
                            </Button>
                            <Button
                                variant="outlined"
                                className={classes.buttonHealing}
                                data-cy="hp-manager-healing"
                                title="Heal the creature"
                                onClick={() => {
                                    if (amount === 0) return;
                                    setExpr("");
                                    setOpen(false);
                                    updateInstance(instance.update("events", events => events.push(amount)));
                                    if (window.myAnalytics) {
                                        window.myAnalytics.event({
                                            eventCategory: "encounter",
                                            eventAction: "heal_creature",
                                            eventLabel: expr,
                                        });
                                    }
                                }}
                            >
                                <span role="img" aria-label="Healing">
                                    💚
                                </span>
                                {getOverheal(creature.get("hp"), instance.get("events").push(amount)) > 0
                                    ? ` +${getOverheal(creature.get("hp"), instance.get("events").push(amount))}`
                                    : null}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {instance.get("events").size > 0
                                ? map(
                                      (ev: number, index: number) =>
                                          ev === 0 ? (
                                              <span key={index} className={classes.eventNeutral}>
                                                  {ev}
                                              </span>
                                          ) : ev > 0 ? (
                                              <span key={index} className={classes.eventHealing}>{`+${ev}`}</span>
                                          ) : (
                                              <span key={index} className={classes.eventDamage}>
                                                  {ev}
                                              </span>
                                          ),
                                      instance
                                          .get("events")
                                          .reverse()
                                          .toArray()
                                  )
                                : null}
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </>
    );
}

export default withStyles(styles)(HpManager);
