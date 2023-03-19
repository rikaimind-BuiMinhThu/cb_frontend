export const ADD_TOKEN="ADD_TOKEN";

export const getEnvironment = () => {
    return localStorage.getItem("env") || "production";
};

export const getDebugFlag = () =>  {
    return localStorage.getItem("debug") || true;
};

export const log = (message) => {
    let debugFlag = getDebugFlag();

    if (debugFlag) {
        console.log(message);
    }
};

export const getEcChatBotApiServerBaseUrl = () => {
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
};

export const getEcChatBotFrontEndBaseUrl = () => {
    const environment = getEnvironment();

    switch (environment) {
        case "staging":
        case "test": 
            return "http://ec-chatbot1.com";
        case "production":
            return "http://ec-chatbot.com";
        default: 
            return "http://localhost:3001";
    }
};

export const S3_UPLOAD_URL= "https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/";
export const SHORTEN_URL = `${getEcChatBotApiServerBaseUrl()}/s/`;
export const EC_CHATBOT_URL = `${getEcChatBotApiServerBaseUrl()}`;
