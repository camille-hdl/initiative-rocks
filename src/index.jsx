//@flow
import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import { AppContainer } from "./container.jsx";

import App from "./reducers/reducer.js";
import { fromJS, Map } from "immutable";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter } from "react-router-dom";
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import { version } from "../package.json";
import { restoreState } from "./lib/state-storage.js";

export const getInitialState = () => {
    return {
        version: version,
        theme: "dark",
        encounter: {
            creatures: [],
            initiativeToken: 0,
            round: 1,
        },
        savedCreatures: [],
    };
};

const checkRestoredState = (defaultInitState: Map, restoredState: Map | null) => {
    /**
     * Without the following line, cypress tests fail in electron
     * because whatever database localForage is using isn't cleared between tests
     */
    if (typeof window.__DO_NOT_RESTORE_STATE__ !== "undefined" && window.__DO_NOT_RESTORE_STATE__)
        return defaultInitState;
    if (!restoredState) return defaultInitState;
    // pour l'instant on autorise de réutiliser le state même si la version ne correspond pas
    // if (defaultInitState.get("version") !== restoredState.get("version")) return defaultInitState;
    return defaultInitState.merge(restoredState);
};

restoreState().then(restoredState => {
    const defaultInitState = fromJS(getInitialState());
    const initState = checkRestoredState(defaultInitState, restoredState);
    ReactDOM.render(
        <BrowserRouter>
            <AppContainer
                store={createStore(
                    App,
                    initState,
                    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                )}
            />
        </BrowserRouter>,
        document.getElementById("app-container")
    );
});
