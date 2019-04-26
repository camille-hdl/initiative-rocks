//@flow
import React from "react";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useNetwork from "react-use/lib/useNetwork";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
    setTheme: (theme: "light" | "dark") => void,
};
function TopBar(props: Props) {
    const { version, classes } = props;
    const networkState = useNetwork();

    const toggleTheme = (curTheme: "light" | "dark"): "light" | "dark" => {
        props.setTheme(curTheme === "light" ? "dark" : "light");
    };
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" className={classes.title}>
                    {"Initiative Rocks!"}
                </Typography>
                <Typography component="span" variant="body1" color="inherit" className={classes.round}>
                    Round <span className={classes.roundNumber}>{props.encounter.get("round")}</span>
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={props.theme === "dark"}
                            onChange={() => toggleTheme(props.theme)}
                            value={props.theme}
                        />
                    }
                    label={<BrightnessMediumIcon />}
                />
                <Typography variant="body1" color="inherit">
                    <span title={networkState.online ? "You are online" : "You are offline"}>
                        {networkState.online ? <WifiIcon /> : <WifiOffIcon />}
                    </span>{" "}
                    - version: {version}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(TopBar);
