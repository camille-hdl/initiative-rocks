//@flow

const _impls = {};
/**
 * Une implémentation doit avoir les méthodes suivantes:
 *
 * * `load(config): Promise`: préparer la librairie
 * * `page()`: appelé 1 fois par page pour préparer des variables, etc
 * * `pageView()`: consultation de page
 * * `event()`: tracker un event
 */
const getImplementation = (impl: string) => {
    return new Promise((res, reject) => {
        if (impl === "ga") {
            if (_impls.ga) {
                res(_impls.ga);
            } else {
                import("./implementations/google-analytics.js").then(m => {
                    _impls.ga = m.default;
                    res(_impls.ga);
                });
            }
        } else {
            reject(`Unknown implementation ${impl}`);
        }
    });
};

type GaConfig = {
    UA: string,
};

type PiwikConfig = {
    url: string,
    siteID: string,
};

type Props = {
    gaConfig: GaConfig | null,
    piwikConfig: PiwikConfig | null,
};

let isOn = false;
let initialized = false;
let initializing = false;
let queue = [];
let __hist = [];
let implementations = [];

/**
 * loop through the wait list
 * if `__myAnalytics` is provided, we also use it
 */
const traiterQueue = (__myAnalytics?: Array<any>) => {
    if (__myAnalytics && __myAnalytics.length) {
        while (__myAnalytics.length > 0) {
            const item = __myAnalytics.shift();
            queue.push(item);
        }
    }
    if (!isOn || !initialized) return;
    queue.forEach(queueItem => {
        __hist.push([...queueItem]);
        const [method, ...args] = queueItem;
        implementations.forEach(impl => {
            impl[method](...args);
        });
    });
    queue = [];
};

export default {
    on: (props: Props, __myAnalytics: Array<any>) => {
        isOn = true;
        if (!initialized) {
            // initialiser les modules
            if (!initializing) {
                initializing = true;
                const promises = [];
                if (props.gaConfig && props.gaConfig.UA) {
                    promises.push(
                        getImplementation("ga").then(impl => {
                            return impl.load(props.gaConfig);
                        })
                    );
                }
                //TODO: piwik
                Promise.all(promises).then(impls => {
                    initialized = true;
                    initializing = false;
                    implementations = impls;
                    traiterQueue(__myAnalytics);
                });
            }
        } else {
            traiterQueue(__myAnalytics);
        }
    },
    off: () => {
        isOn = false;
    },
    isOn: () => isOn,
    page: (...args) => {
        queue.push(["page", ...args]);
        traiterQueue();
    },
    pageView: (...args) => {
        queue.push(["pageView", ...args]);
        traiterQueue();
    },
    event: (...args) => {
        queue.push(["event", ...args]);
        traiterQueue();
    },
};
