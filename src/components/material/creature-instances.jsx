//@flow
import React from "react";

import { fromJS, Map } from "immutable";
import { map as _map, addIndex } from "ramda";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import HpManager from "./hp-manager.jsx";
const map = addIndex(_map);
import { getNewInstance } from "../../lib/creatures.js";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    instanceNumber: {
        color: theme.palette.background.primary,
        backgroundColor: theme.palette.text.primary,
    },
    button: {
        margin: theme.spacing.unit,
    },
});
type Props = {
    creature: Map,
    classes: any,
    updateCreature: (creature: Map) => void,
};
function CreatureInstances(props: Props) {
    const { classes, creature, updateCreature } = props;

    return (
        <List dense className={classes.root} data-cy="instances-list">
            {map(
                (value: Map, index: number) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar className={classes.instanceNumber}>{index + 1}</Avatar>
                        </ListItemAvatar>
                        {creature.get("hp") ? (
                            <HpManager
                                creature={creature}
                                instance={value}
                                updateInstance={instance => {
                                    updateCreature(creature.setIn(["instances", index], instance));
                                }}
                            />
                        ) : (
                            <ListItemText>No hp</ListItemText>
                        )}

                        <ListItemSecondaryAction>
                            <IconButton
                                className={classes.button}
                                aria-label="Delete"
                                onClick={() => {
                                    // we need at least 1 instance
                                    if (creature.get("instances").size <= 1) return;
                                    // remove this instance
                                    updateCreature(
                                        creature.update("instances", instances =>
                                            instances.filter((v, i: number) => {
                                                return i !== index;
                                            })
                                        )
                                    );
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ),
                creature.get("instances").toArray()
            )}
            <ListItem
                key={"add-instance"}
                button
                onClick={() => {
                    updateCreature(creature.update("instances", instances => instances.push(fromJS(getNewInstance()))));
                }}
            >
                <Typography>
                    <AddIcon />
                </Typography>
            </ListItem>
        </List>
    );
}

export default withStyles(styles)(CreatureInstances);
