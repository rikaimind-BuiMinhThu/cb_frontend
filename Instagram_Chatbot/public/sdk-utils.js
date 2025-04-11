// Constants
if (typeof window.EC_CHATBOT_STORAGE_KEYS === 'undefined') {
  window.EC_CHATBOT_STORAGE_KEYS = {
    SCENARIO_ID: 'ecChatbotScenarioId',
    BOT_TYPE: 'ecChatbotBotType',
    USER_INPUT_ID: 'ecChatbotUserInputId',
    ENV: 'ecChatbotEnv'
  };
}

if (typeof EC_CHATBOT_CONVERSION_PARAMS === 'undefined') {
  window.EC_CHATBOT_CONVERSION_PARAMS = {
    SCENARIO_ID: 'scenario_id',
    BOT_TYPE: 'bot_type',
    USER_INPUT_ID: 'user_input_id'
  };
}

// Utilities

if (window.getChatbotEnvironment === undefined) {
  window.getChatbotEnvironment = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    if (params.env) return params.env;
    const localStorageEnv = localStorage.getItem(EC_CHATBOT_STORAGE_KEYS.ENV);
    return localStorageEnv || "production";
  };
}

if (window.getEcChatBotApiServerBaseUrl === undefined) {
  window.getEcChatBotApiServerBaseUrl = () => {
      // Comment out below line if you want to connect the staging backend API server
      // return "https://ec-chatbot-test1.com";
    const environment = window.getChatbotEnvironment();
    switch (environment) {
      case "staging":
      case "test":
        return "https://ec-chatbot-test1.com";
      case "production":
        return "https://ec-chatbot-test.com";
      case "local":
        return "http://localhost:3000";
      default:
        return "http://localhost:3000";
    }
  }
}

if (window.getUrlParameter === undefined) {
  window.getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
}
