export const ADD_TOKEN="ADD_TOKEN";

export const getEnvironment = () => {
    try {
        return getParamFromUrl("env") || "production";
    } catch (e) {
        return getParamFromUrl("env") || "production";
    }
};

export const getParamFromUrl = (paramName) => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params[paramName];
}

export const getDebugFlag = () =>  {
    try {
        return getParamFromUrl("debug") || true;
    } catch (e) {
        return getParamFromUrl("debug") || true;
    }
};

export const log = (message) => {
    let debugFlag = getDebugFlag();

    if (debugFlag) {
        console.log(message);
    }
};

export const getEcChatBotApiServerBaseUrl = () => {
    // Comment out below line if you want to connect the staging backend API server
    return "https://ec-chatbot-test1.com";
    const environment = process.env.REACT_APP_CHATBOT_ENV;
    log("Environment: " + environment);

    return process.env.REACT_APP_API_CHATBOT_URL;
};

export const getEcChatBotFrontEndBaseUrl = () => {
    // Comment out below line if you want to use the local frontend
    return "http://localhost:3001";
    const environment = getEnvironment();

    switch (environment) {
        case "staging":
        case "test": 
            return "https://ec-chatbot1.com";
        case "production":
            return "https://ec-chatbot.com";
        default: 
            return "http://localhost:3001";
    }
};

export const S3_UPLOAD_URL= "https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/";
export const SHORTEN_URL = `${getEcChatBotApiServerBaseUrl()}/s/`;
export const EC_CHATBOT_URL = `${getEcChatBotApiServerBaseUrl()}`;
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