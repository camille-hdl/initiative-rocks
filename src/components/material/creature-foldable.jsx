//@flow
import React, { memo, useMemo } from "react";
import { Map } from "immutable";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import CreatureForm from "./creature-form.jsx";
import HpManager from "./hp-manager.jsx";
import { getCurrentHP } from "../../lib/creatures.js";

const styles = theme => ({
    initiative: {
        flexBasis: "10%",
        flexShrink: 2,
        flexGrow: 0,
    },
    badgeMargin: {
        margin: theme.spacing.unit / 2,
    },
    initScore: {
        backgroundColor: theme.palette.text.secondary,
        color: theme.palette.background.secondary,
        width: 30,
        height: 30,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 1,
        textOverflow: "ellipsis",
    },
    secondaryInfos: {
        flexBasis: "33.33%",
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});
type Props = {
    creature: Map,
    isCurrentTurn: boolean,
    updateCreature: (creature: Map) => void,
    removeCreature: (creature: Map) => void,
    saveCreature: (creature: Map) => void,
    classes: any,
};

/**
 * A creature in the encounter page
 */
function CreatureFoldable(props: Props) {
    const { classes, isCurrentTurn, creature, updateCreature, removeCreature, saveCreature } = props;
    const isMultiple = creature.get("type") === "😈" && creature.get("multiple");
    const aliveInstances = useMemo(() => {
        return creature.get("instances").filter(instance => {
            return getCurrentHP(creature.get("hp"), instance.get("events")) > 0;
        });
    }, [creature]);
    return (
        <ExpansionPanel
            data-cy="creature"
            color={isCurrentTurn ? "primary" : null}
            expanded={creature.get("expanded")}
            onChange={() => updateCreature(creature.update("expanded", e => !e))}
        >
            <ExpansionPanelSummary data-cy="creature-summary" expandIcon={<ExpandMoreIcon />}>
                <div className={classes.initiative}>
                    <Badge
                        invisible={!isCurrentTurn}
                        className={classes.badgeMargin}
                        badgeContent={"🎲"}
                        color="secondary"
                    >
                        <Avatar data-cy="initiative" className={classes.initScore}>
                            {creature.get("initiative")}
                        </Avatar>
                    </Badge>
                </div>
                <Typography data-cy="creature-name-display" className={classes.heading}>
                    {creature.get("type")} {creature.get("name") || "(New creature)"}
                </Typography>
                <div className={classes.secondaryInfos} data-cy="creature-hp-display">
                    {isMultiple ? (
                        <Typography>{`${aliveInstances.size} / ${creature.get("instances").size} alive`}</Typography>
                    ) : creature.get("hp") ? (
                        <HpManager
                            creature={creature}
                            instance={creature.get("instances").first()}
                            updateInstance={instance => {
                                updateCreature(creature.setIn(["instances", 0], instance));
                            }}
                        />
                    ) : (
                        <Typography className={classes.secondaryHeading}>No hp</Typography>
                    )}
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <CreatureForm creature={creature} updateCreature={updateCreature} />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
                <IconButton data-cy="delete-creature-btn" aria-label="Delete" onClick={() => removeCreature(creature)}>
                    <DeleteIcon />
                </IconButton>
                <IconButton data-cy="save-creature-btn" aria-label="Save" onClick={() => saveCreature(creature)}>
                    <SaveIcon />
                </IconButton>
            </ExpansionPanelActions>
        </ExpansionPanel>
    );
}

export default withStyles(styles)(memo(CreatureFoldable));
