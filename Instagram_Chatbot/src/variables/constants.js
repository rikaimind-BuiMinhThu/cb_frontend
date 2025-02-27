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
    // return "https://ec-chatbot-test1.com";
    const environment = process.env.REACT_APP_CHATBOT_ENV;
    log("Environment: " + environment);

    return process.env.REACT_APP_API_CHATBOT_URL;
};

export const getEcChatBotFrontEndBaseUrl = () => {
    // return "http://localhost:3001";
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
