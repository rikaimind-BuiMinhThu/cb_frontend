export const ADD_TOKEN="ADD_TOKEN";

const getEnvironment = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.env || "production";
}

const getDebugFlag = () =>  {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.debug || true;
}

const log = (message) => {
    let debugFlag = getDebugFlag();

    if (debugFlag) {
        console.log(message);
    }
}

const getEcChatBotApiServerBaseUrl = () => {
    const environment = getEnvironment();
    log("Environment: " + environment);

    switch (environment) {
        case "staging":
        case "test": 
            return "http://ec-chatbot1.com";
        case "production":
            return "http://ec-chatbot.com";
        default: 
            return "http://localhost:3000";
    }
}

export const S3_UPLOAD_URL= "https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/";
export const SHORTEN_URL = `${getEcChatBotApiServerBaseUrl()}/s/`;
export const EC_CHATBOT_URL = `${getEcChatBotApiServerBaseUrl()}`;
