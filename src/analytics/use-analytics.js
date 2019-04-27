//@flow
import { useState, useEffect } from "react";

import Cookies from "js-cookie";

const COOKIE_EXPIRES = 365;
const __myAnalytics = window.myAnalytics;

type GaConfig = {
    UA: string,
};

type PiwikConfig = {
    url: string,
    siteID: string,
};

export type Props = {
    gaConfig: GaConfig | null,
    piwikConfig: PiwikConfig | null,
};

type AnalyticsState = [boolean | null, (enabled: boolean | null) => void];

const useConsentCookie = () => {
    const cookieName = window.__TRACKING_CONSENT_COOKIE_NAME__ || "defaultConsentCookie";
    const readCookie = () => (Cookies.getJSON(cookieName) ? Cookies.getJSON(cookieName).value : null);
    const writeCookie = (value: any) => Cookies.set(cookieName, { value: value }, { expires: COOKIE_EXPIRES });

    return { readCookie, writeCookie };
};
export default (props: Props): AnalyticsState => {
    const { readCookie, writeCookie } = useConsentCookie();
    const cookieValue = readCookie();

    const [enabled, setEnabled] = useState(cookieValue);
    /**
     * Toujours stocker l'état d'activation dans le cookie
     */
    useEffect(() => {
        writeCookie(enabled);
    }, [enabled, writeCookie]);

    /**
     * On charge la librairie dynamiquement
     * au dernier moment (uniquement si nécessaire)
     */
    const [lib, setLib] = useState(null);
    const [libLoading, setLibLoading] = useState(false);
    useEffect(() => {
        if (enabled && !lib) {
            setLibLoading(true);
            import("./my-analytics.js").then(m => {
                setLib(m.default);
                setLibLoading(false);
            });
        }
    }, [enabled, lib, setLib, libLoading, setLibLoading]);
    /**
     * Activer ou désactiver la lib si besoin
     */
    useEffect(() => {
        if (lib && typeof lib.isOn === "function") {
            if (enabled && !lib.isOn()) {
                lib.on(props, __myAnalytics);
            } else if (!enabled && lib.isOn()) {
                lib.off();
            }
        }
    }, [lib, enabled, props]);

    const [api, setAPI] = useState(window.myAnalytics);
    /**
     * Si le tracking est actif, il faut charger l'API
     */
    useEffect(() => {
        if (enabled && lib) {
            setAPI(lib);
        } else {
            setAPI(__myAnalytics);
        }
    }, [enabled, lib, setAPI]);

    /**
     * Si on change l'API, il faut la rattacher à window
     */
    useEffect(() => {
        window.myAnalytics = api;
    }, [api]);

    return [enabled, setEnabled];
};
