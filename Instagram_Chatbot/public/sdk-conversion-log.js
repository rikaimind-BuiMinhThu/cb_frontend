const getEnvironment = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.env || "production";
}

const getEcChatBotApiServerBaseUrl = () => {
  // Comment out below line if you want to connect the staging backend API server
  // return "https://ec-chatbot-test1.com";
  const environment = getEnvironment();
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

(() => {
  // Define constant keys
  const STORAGE_KEYS = {
    SCENARIO_ID: 'ecChatbotScenarioId',
    BOT_TYPE: 'ecChatbotBotType',
    USER_INPUT_ID: 'ecChatbotUserInputId'
  };

  const getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const params = {
    scenario_id: getUrlParameter('scenario_id') || localStorage.getItem(STORAGE_KEYS.SCENARIO_ID),
    bot_type: getUrlParameter('bot_type') || localStorage.getItem(STORAGE_KEYS.BOT_TYPE),
    user_input_id: getUrlParameter('user_input_id') || localStorage.getItem(STORAGE_KEYS.USER_INPUT_ID)
  };

  // Gửi request lên chatbot server
  const sendConversionData = async () => {
    try {
      const response = await fetch(`${getEcChatBotApiServerBaseUrl()}/scenario_users/conversions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (response.ok) {
        // Xóa dữ liệu từ localStorage sau khi gửi thành công
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error sending conversion data:', error);
    }
  };

  sendConversionData();
})();