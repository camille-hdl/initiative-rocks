//@flow
import React, { memo } from "react";
import { Map } from "immutable";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Button from "@material-ui/core/Button";
import CreatureForm from "./creature-form.jsx";

const styles = theme => ({
    initiative: {
        flexBasis: "10%",
        flexShrink: 2,
        flexGrow: 0,
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
type Props = { creature: Map, isCurrentTurn: boolean, updateCreature: (creature: Map) => void, classes: any };

/**
 * A creature in the encounter page
 */
function CreatureFoldable(props: Props) {
    const { classes, isCurrentTurn, creature, updateCreature } = props;
    return (
        <ExpansionPanel
            color={isCurrentTurn ? "primary" : null}
            expanded={creature.get("expanded")}
            onChange={() => updateCreature(creature.update("expanded", e => !e))}
        >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.initiative}>
                    <PlayArrowIcon style={{ visibility: isCurrentTurn ? "visible" : "hidden" }} />{" "}
                    {creature.get("initiative")}
                </Typography>
                <Typography className={classes.heading}>{creature.get("name") || "(New creature)"}</Typography>
                <div className={classes.secondaryInfos}>
                    <Typography className={classes.secondaryHeading}>details</Typography>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <CreatureForm creature={creature} updateCreature={updateCreature} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default withStyles(styles)(memo(CreatureFoldable));
