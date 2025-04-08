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
    CLIENT_ID: 'ecChatbotClientId',
    BOT_TYPE: 'ecChatbotBotType',
    USER_INPUT_ID: 'ecChatbotUserInputId'
  };

  // Hàm lấy parameter từ URL
  const getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  // Lấy dữ liệu từ URL hoặc localStorage
  const params = {
    scenario_id: getUrlParameter('scenario_id') || localStorage.getItem(STORAGE_KEYS.SCENARIO_ID),
    client_id: getUrlParameter('client_id') || localStorage.getItem(STORAGE_KEYS.CLIENT_ID),
    bot_type: getUrlParameter('bot_type') || localStorage.getItem(STORAGE_KEYS.BOT_TYPE),
    user_input_id: getUrlParameter('user_input_id') || localStorage.getItem(STORAGE_KEYS.USER_INPUT_ID)
  };

  // Kiểm tra xem có đủ dữ liệu không
  const isValidData = Object.values(params).every(value => value);

  if (isValidData) {
    // Gửi request lên chatbot server
    const sendConversionData = async () => {
      try {
        const response = await fetch(`${chat_bot_server_endpoint}/conversions`, {
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
  }
})();