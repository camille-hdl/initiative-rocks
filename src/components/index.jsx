//@flow
import React, { useMemo } from "react";
import { Map, List } from "immutable";
import { Route, Switch, Redirect } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import TopBar from "./material/top-bar.jsx";
import Encounter from "./pages/encounter.jsx";

// const DynamicComponent = lazy(() => import("../dynamic-component.jsx"));
export type Props = {
    version: string,
    encounter: Map,
    initiativeOrder: List,
    savedCreatures: List,
    theme: "light" | "dark",
    setTheme: (theme: "light" | "dark") => void,
    setEncounter: (encounter: Map) => void,
    updateCreature: (creature: Map) => void,
    removeCreature: (creature: Map) => void,
    saveCreature: (creature: Map) => void,
    unsaveCreature: (creature: Map) => void,
} & RouteProps;

type RouteProps = {
    location: {
        pathname: string,
    },
    history: any,
    match: any,
};
/**
 *
 */
export default function App(props: Props) {
    const { theme } = props;
    const muiTheme = useMemo(() => {
        return createMuiTheme({
            palette: {
                type: theme,
                secondary: {
                    main: "#E40712",
                    light: "#EA0F15",
                    dark: "#d70711",
                    contrastText: "#fff"
                },
                primary: {
                    main: "#9d0a0e",
                    light: "#F34045",
                    dark: "#9d0a0e",
                    contrastText: "#fff"
                }
            },
            typography: { useNextVariants: true },
        });
    }, [theme]);
    return (
        <>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <TopBar {...props} />
                <main>
                    <Switch>
                        <Route path="/" render={routeProps => <Encounter {...props} {...routeProps} />} />
                    </Switch>
                </main>
            </MuiThemeProvider>
        </>
    );
}
