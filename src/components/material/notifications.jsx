//@flow
import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import type { List } from "immutable";
import { isNil } from "ramda";

const styles = theme => ({
    close: {
        padding: theme.spacing.unit / 2,
    },
});
type Props = {
    classes: any,
    savedCreatures: List,
};
/**
 * Notify the user when a creature is successfully saved
 */
function Notifications(props: Props) {
    const { classes, savedCreatures } = props;
    const [open, setOpen] = useState(false);
    const [previousNb, setPreviousNB] = useState(null);
    const nbOfSavedCreatures = savedCreatures.size;
    useEffect(() => {
        if (!isNil(previousNb) && nbOfSavedCreatures > 0 && nbOfSavedCreatures > previousNb) {
            setOpen(true);
        }
        setPreviousNB(nbOfSavedCreatures);
    }, [nbOfSavedCreatures, previousNb]);
    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            open={open}
            autoHideDuration={3500}
            onClose={() => setOpen(false)}
            ContentProps={{
                "aria-describedby": "message-id",
            }}
            message={<span id="message-id">Creature saved!</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={() => setOpen(false)}
                >
                    <CloseIcon />
                </IconButton>,
            ]}
        />
    );
}

export default withStyles(styles)(Notifications);
