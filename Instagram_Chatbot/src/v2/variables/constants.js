export const ADD_TOKEN="ADD_TOKEN";

export const APP_BASE_PATH = process.env.REACT_APP_BASE_PATH || '/v2';

export const getAppPath = (path = '') =>
    `${APP_BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;

export const getAdminRoutePath = (path = '') => {
    const normalized = path.startsWith('/admin')
        ? path
        : `/admin${path.startsWith('/') ? path : `/${path}`}`;
    return getAppPath(normalized);
};

/** Default landing after login / logo click / unauthorized Home access. */
export const getDefaultLandingPath = (role, client) => {
    if (role === 'admin_deel') return getAdminRoutePath('/dashboard');
    if (client?.is_web) return getAdminRoutePath('/bot');
    if (client?.is_instagram) return getAdminRoutePath('/crm');
    return getAdminRoutePath('/dashboard');
};

export const getEnvironment = () => {
    try {
        return getParamFromUrl("env") || process.env.REACT_APP_CHATBOT_ENV || "production";
    } catch (e) {
        return getParamFromUrl("env") || process.env.REACT_APP_CHATBOT_ENV || "production";
    }
};

export const getParamFromUrl = (paramName) => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params[paramName];
}

export const getSignInPath = () => getAppPath('/sign-in');

export const getDebugFlag = () =>  {
    try {
        return getParamFromUrl("debug") === "true";
    } catch (e) {
        return false;
    }
};

export const log = (message) => {
    let debugFlag = getDebugFlag();

    if (debugFlag) {
        console.log(message);
    }
};

export const getEcChatBotApiServerBaseUrl = () => {
    if (process.env.REACT_APP_API_CHATBOT_URL) {
        return process.env.REACT_APP_API_CHATBOT_URL;
    }

    const environment = getEnvironment();
    log("Environment: " + environment);

    switch (environment) {
        case "staging":
        case "test":
            return "https://ec-chatbot-test1.com";
        case "production":
            return "https://ec-chatbot-test.com";
        case "development":
        case "local":
        default:
            return "http://localhost:3000";
    }
};

export const getEcChatBotFrontEndBaseUrl = () => {
    if (process.env.REACT_APP_FRONTEND_BASE_URL) {
        return process.env.REACT_APP_FRONTEND_BASE_URL;
    }

    const environment = getEnvironment();

    switch (environment) {
        case "staging":
        case "test":
            return "https://ec-chatbot1.com";
        case "production":
            return "https://ec-chatbot.com";
        default:
            return `http://localhost:${process.env.PORT || 3001}`;
    }
};

export const S3_UPLOAD_URL= "https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/";
export const SHORTEN_URL = `${getEcChatBotApiServerBaseUrl()}/s/`;
export const EC_CHATBOT_URL = getEcChatBotApiServerBaseUrl();
export const FACEBOOK_APP_ID = `${process.env.REACT_APP_FACEBOOK_APP_ID}`;
export const META_GRAPH_API_VERSION = 'v25.0';
export const FUKUSHASHIKI_SEARCH_MODE_OPTIONS = [
    { key: 1, value: 'id' },
    { key: 2, value: 'css_selector' },
    { key: 3, value: 'xpath' }
];

export const FUKUSHASHIKI_SEARCH_VALUE_LABELS = {
    1: '複写先要素のIDを入力ください',
    2: '複写先要素のcss_selectorを入力ください',
    3: '複写先要素のxPathを入力ください',
};

export const EXECUTION_POLICIES = {
  RPA: 'rpa',
  FUKUSHASHIKI: 'fukushashiki',
  API: 'api',
};

export const EXECUTION_POLICY_OPTIONS = [
  { value: EXECUTION_POLICIES.API, label: 'API' },
  { value: EXECUTION_POLICIES.FUKUSHASHIKI, label: '複写式' },
  { value: EXECUTION_POLICIES.RPA, label: 'RPA' },
];

export const DEFAULT_EXECUTION_POLICY = EXECUTION_POLICIES.RPA;
