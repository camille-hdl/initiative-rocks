//@flow
type GaConfig = {
    UA: string,
};
const GA_URL = "https://www.google-analytics.com/analytics.js";
const loadAsyncScript = (url: string, document: any, callback?: (ev: any, error: any) => void) => {
    const s = document.createElement("script");
    s.src = url;
    if (typeof callback === "function") {
        s.addEventListener("load", (...args) => {
            callback(args, null);
        });
        s.addEventListener("error", (...args) => {
            callback(null, args);
        });
    }
    document.head.appendChild(s);
};

let config = null;

export default {
    load: function(props: GaConfig) {
        config = props;
        window.ga =
            window.ga ||
            function() {
                (window.ga.q = window.ga.q || []).push(arguments);
            };
        window.ga.l = +new Date();
        return new Promise<any>((res, reject) => {
            loadAsyncScript(GA_URL + "?id=" + config.UA, window.document, (args, err) => {
                if (err) {
                    reject(err);
                } else {
                    res(this);
                }
            });
        });
    },
    page: function(...args) {
        if (!config) {
            throw new Error("Called .page() before .load()");
        }
        window.ga("create", config.UA, "none");
    },
    event: function(...args) {
        if (!config) {
            throw new Error("Called .event() before .load()");
        }
        if (args) {
            window.ga("send", "event", ...args);
        } else {
            window.ga("send", "event");
        }
    },
    pageView: function(...args) {
        if (!config) {
            throw new Error("Called .pageView() before .load()");
        }
        if (args) {
            window.ga("send", "pageview", ...args);
        } else {
            window.ga("send", "pageview");
        }
    },
};
