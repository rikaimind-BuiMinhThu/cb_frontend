// Script for cart confirm page
(() => {
  // Define constant keys
  const STORAGE_KEYS = {
    SCENARIO_ID: 'ecChatbotScenarioId',
    BOT_TYPE: 'ecChatbotBotType',
    USER_INPUT_ID: 'ecChatbotUserInputId'
  };

  // Define URL parameter names
  const URL_PARAMS = {
    SCENARIO_ID: 'scenario_id',
    BOT_TYPE: 'bot_type',
    USER_INPUT_ID: 'user_input_id'
  };

  // Hàm lấy parameter từ URL
  const getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  // Mapping giữa URL parameters và localStorage keys
  const paramsMapping = {
    [URL_PARAMS.SCENARIO_ID]: STORAGE_KEYS.SCENARIO_ID,
    [URL_PARAMS.BOT_TYPE]: STORAGE_KEYS.BOT_TYPE,
    [URL_PARAMS.USER_INPUT_ID]: STORAGE_KEYS.USER_INPUT_ID
  };

  // Lưu parameters vào localStorage
  Object.entries(paramsMapping).forEach(([urlParam, storageKey]) => {
    const value = getUrlParameter(urlParam);
    if (value) {
      localStorage.setItem(storageKey, value);
    }
  });
})();