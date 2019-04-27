import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import clear from "rollup-plugin-clear";
import json from "rollup-plugin-json";

import * as ANALYTICS from "./analytics.json";

/**
 * Where our output will be written to disk
 */
const outputDir = "./public/js/";

const getPluginsConfig = (prod, mini) => {
    const sortie = [
        /**
         * Clear previous builds
         */
        clear({
            targets: [`${outputDir}esm`, `${outputDir}system`],
            watch: true,
        }),
        nodeResolve({
            mainFields: ["module", "main", "browser"],
            dedupe: ["react", "react-dom"],
            preferBuiltins: false,
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(prod ? "production" : "development"),
            "ANALYTICS_ID": ANALYTICS.UA,
        }),
        commonjs({
            include: "node_modules/**",
            /**
             * When `import`ing named exports from CJS modules, (e.g. `import React, { PureComponent } from "react"`)
             * Rollup sometimes doesn't guess the exports correctly,
             * and you need to define them explicitly here.
             */
            namedExports: {
                "./node_modules/react/index.js": [
                    "cloneElement",
                    "createElement",
                    "PropTypes",
                    "Children",
                    "Component",
                    "createFactory",
                    "PureComponent",
                    "lazy",
                    "Suspense",
                    "useState",
                    "useEffect",
                    "useMemo",
                    "useCallback",
                    "useRef",
                    "useLayoutEffect",
                    "useContext",
                    "isValidElement",
                    "useReducer",
                    "memo",
                ],
                "./node_modules/react-dom/index.js": ["findDOMNode", "unstable_batchedUpdates"],
                "./node_modules/immutable/dist/immutable.js": ["Map", "List", "Set", "fromJS"],
                "./node_modules/babel-runtime/node_modules/core-js/library/modules/es6.object.to-string.js": [
                    "default",
                ],
                "./node_modules/@material-ui/core/styles/index.js": [
                    "withStyles",
                    "createMuiTheme",
                    "MuiThemeProvider",
                ],
                "./node_modules/react-is/index.js": ["isValidElementType", "isContextConsumer"],
                "./node_modules/process/browser.js": ["nextTick"],
                "./node_modules/events/events.js": ["EventEmitter"],
            },
        }),
        babel({
            exclude: "node_modules/**",
        }),
        globals(),
        builtins(),
        json({
            preferConst: true,
            compact: true,
            namedExports: true,
        }),
    ];
    if (mini) {
        sortie.push(
            /**
             * Minification.
             * We don't want Terser to remove code since Rollup is supposed to
             * do that for us
             */
            terser({
                compress: {
                    unused: false,
                    collapse_vars: false,
                },
                output: {
                    comments: !prod,
                },
                sourcemap: true,
            })
        );
    }
    return sortie;
};

export default CLIArgs => {
    /**
     * Usage : `rollup -c --prod --mini`
     */
    const prod = !!CLIArgs.prod;
    const mini = !!CLIArgs.mini;
    const bundle = {
        input: ["./src/index.jsx"],
        output: [
            {
                dir: `${outputDir}system/`,
                format: "system",
            },
            {
                dir: `${outputDir}esm/`,
                format: "esm",
            },
        ],
        watch: {
            include: ["./src/**"],
        },
    };
    bundle.plugins = getPluginsConfig(prod, mini);
    return bundle;
};
