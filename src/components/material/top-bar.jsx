//@flow
import React, { useState } from "react";

import { map } from "ramda";
import { Map, List as ImmutableList } from "immutable";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import useNetwork from "react-use/lib/useNetwork";
import WifiIcon from "@material-ui/icons/Wifi";
import DeleteIcon from "@material-ui/icons/Delete";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import Switch from "@material-ui/core/Switch";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip";
import useAnalytics from "../../analytics/use-analytics.js";

const styles = {
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        fontFamily: "Rock Salt, Cursive",
        textDecoration: "none",
        flexGrow: 1,
    },
    round: {
        flexGrow: 1,
    },
    roundNumber: {
        fontFamily: "Rock Salt, Cursive",
        textDecoration: "none",
    },
};
type Props = {
    version: string,
    classes: any,
    encounter: Map,
    theme: "light" | "dark",
    savedCreatures: ImmutableList,
    setTheme: (theme: "light" | "dark") => void,
    setEncounter: (encounter: Map) => void,
    unsaveCreature: (creature: Map) => void,
};

/**
 * App bar and left drawer (settings, saved creatures ...)
 */
function TopBar(props: Props) {
    const { version, classes } = props;
    const networkState = useNetwork();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useAnalytics({
        gaConfig: {
            UA: "ANALYTICS_ID",
        },
    });
    if (typeof window.myAnalytics === "undefined") {
        throw new Error("myAnalytics is missing");
    }

    const toggleTheme = (curTheme: "light" | "dark"): "light" | "dark" => {
        props.setTheme(curTheme === "light" ? "dark" : "light");
        if (window.myAnalytics) {
            window.myAnalytics.event({
                eventCategory: "settings",
                eventAction: "theme",
                eventLabel: curTheme === "light" ? "dark" : "light",
            });
        }
    };
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        data-cy="toggle-drawer-btn"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => {
                            setDrawerOpen(!drawerOpen);
                            if (window.myAnalytics) {
                                window.myAnalytics.event({
                                    eventCategory: "settings",
                                    eventAction: "open_drawer",
                                });
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" className={classes.title}>
                        {"Initiative Rocks!"}
                    </Typography>
                    <Typography
                        component="span"
                        aria-live="polite"
                        variant="body1"
                        color="inherit"
                        className={classes.round}
                    >
                        Round{" "}
                        <Tooltip title="Reset">
                            <Button
                                data-cy="reset-rounds-btn"
                                onClick={() => {
                                    props.setEncounter(props.encounter.set("round", 1).set("initiativeToken", 0));
                                }}
                                className={classes.roundNumber}
                            >
                                {props.encounter.get("round")}
                            </Button>
                        </Tooltip>
                    </Typography>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onOpen={() => setDrawerOpen(true)}>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                    <ListItem data-cy="settings-theme" button onClick={() => toggleTheme(props.theme)}>
                        <ListItemIcon>
                            <BrightnessMediumIcon />
                        </ListItemIcon>
                        <ListItemText primary="Light/Dark mode" />
                        <ListItemSecondaryAction>
                            <Switch
                                checked={props.theme === "dark"}
                                onChange={e => {
                                    e.stopPropagation();
                                    toggleTheme(props.theme);
                                }}
                                value={props.theme}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem
                        data-cy="settings-analytics"
                        button
                        onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    >
                        <ListItemText primary="Anonymous usage data collection" secondary="Helps me improve this app" />
                        <ListItemSecondaryAction>
                            <Switch
                                checked={analyticsEnabled}
                                onChange={e => {
                                    e.stopPropagation();
                                    setAnalyticsEnabled(!analyticsEnabled);
                                }}
                                value={!!analyticsEnabled}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <Divider />
                <List
                    className={classes.drawerListDesktop}
                    subheader={<ListSubheader>Saved creatures</ListSubheader>}
                    data-cy="saved-creatures-list"
                >
                    {map(
                        creature => (
                            <ListItem
                                aria-label="Add to the encounter"
                                key={creature.get("id")}
                                button
                                onClick={() => {
                                    props.setEncounter(
                                        props.encounter.update("creatures", creatures =>
                                            creatures.push(creature.set("id", "" + Math.random()))
                                        )
                                    );
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>{creature.get("type")}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={creature.get("name") || "(no name)"} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        onClick={e => {
                                            e.stopPropagation();
                                            props.unsaveCreature(creature);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ),
                        props.savedCreatures.toArray()
                    )}
                    {props.savedCreatures.size <= 0 ? (
                        <ListItem>
                            <ListItemText primary={"Nothing here"} />
                        </ListItem>
                    ) : null}
                </List>
                <Divider />
                <List className={classes.drawerListDesktop}>
                    <ListItem>
                        <ListItemText primary={networkState.online ? <WifiIcon /> : <WifiOffIcon />} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"Clear encounter"} />
                        <ListItemText
                            secondary={
                                <IconButton
                                    data-cy="clear-encounter-btn"
                                    onClick={() => {
                                        props.setEncounter(props.encounter.set("creatures", ImmutableList([])));
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Version: ${version}`} />
                        <ListItemText
                            secondary={
                                <Button
                                    target="_blank"
                                    rel="noopener"
                                    href="https://github.com/camille-hdl/initiative-rocks"
                                >
                                    github
                                </Button>
                            }
                        />
                    </ListItem>
                </List>
                <Divider />
            </SwipeableDrawer>
        </>
    );
}

export default withStyles(styles)(TopBar);
