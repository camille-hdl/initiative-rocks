//@flow
import * as actions from "./actions.js";
import { connect } from "react-redux";
import App from "./components/index.jsx";
import type { Map, List } from "immutable";
import { withRouter } from "react-router-dom";
import { creaturesSortedSelector } from "./selectors.js";

export const mapStateToProps = (state: Map) => {
    return {
        version: state.get("version"),
        encounter: state.get("encounter"),
        initiativeOrder: creaturesSortedSelector(state),
        savedCreatures: state.get("savedCreatures"),
        theme: state.get("theme"),
    };
};

export const mapDispatchToProps = (dispatch: any) => {
    const dispatchers = {};
    for (let actionName in actions) {
        dispatchers[actionName] = (...args) => dispatch(actions[actionName](...args));
    }
    return dispatchers;
};

export const AppContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
