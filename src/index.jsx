//@flow
import React from "react";
import ReactDOM from "react-dom";

import { AppContainer } from "./container.jsx";

import App from "./reducers/reducer.js";
import { fromJS } from "immutable";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter } from "react-router-dom";
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import { version } from "../package.json";

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

ReactDOM.render(
    <BrowserRouter>
        <AppContainer
            store={createStore(
                App,
                fromJS(getInitialState()),
                window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
            )}
        />
    </BrowserRouter>,
    document.getElementById("app-container")
);
