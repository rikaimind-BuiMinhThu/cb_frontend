(() => {
  const paramsMapping = {
    [EC_CHATBOT_CONVERSION_PARAMS.SCENARIO_ID]: EC_CHATBOT_STORAGE_KEYS.SCENARIO_ID,
    [EC_CHATBOT_CONVERSION_PARAMS.BOT_TYPE]: EC_CHATBOT_STORAGE_KEYS.BOT_TYPE,
    [EC_CHATBOT_CONVERSION_PARAMS.USER_INPUT_ID]: EC_CHATBOT_STORAGE_KEYS.USER_INPUT_ID
  };

  // Lưu parameters vào localStorage
  Object.entries(paramsMapping).forEach(([urlParam, storageKey]) => {
    const value = getUrlParameter(urlParam);
    if (value) {
      localStorage.setItem(storageKey, value);
    }
  });
})();