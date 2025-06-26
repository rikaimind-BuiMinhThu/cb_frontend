(() => {
  const MAX_RETRIES = 50;
  const REQUIRED_GLOBALS = [
    'getUrlParameter',
    'EC_CHATBOT_CONVERSION_PARAMS',
    'EC_CHATBOT_STORAGE_KEYS',
    'getEcChatBotApiServerBaseUrl',
    'tabletCheck',
    'mobileCheck',
    'sendCountRequest'
  ];

  const validatedGlobals = {};
  let isValidGlobal = false

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (REQUIRED_GLOBALS.every(globalName => globalName in window)) {
      REQUIRED_GLOBALS.forEach(globalName => validatedGlobals[globalName] = window[globalName]);
      isValidGlobal = true
      break;
    }
  }

  if (!isValidGlobal) {
    console.error(`Failed to validate required globals after ${MAX_RETRIES} attempts`);
    return;
  }

  const {
    getUrlParameter,
    EC_CHATBOT_CONVERSION_PARAMS,
    EC_CHATBOT_STORAGE_KEYS,
    getEcChatBotApiServerBaseUrl,
    tabletCheck,
    mobileCheck,
    sendCountRequest,
  } = validatedGlobals;

  const scenarioId = getUrlParameter(EC_CHATBOT_CONVERSION_PARAMS.SCENARIO_ID) || localStorage.getItem(EC_CHATBOT_STORAGE_KEYS.SCENARIO_ID);
  const params = {
    scenario_id: scenarioId,
    bot_type: getUrlParameter(EC_CHATBOT_CONVERSION_PARAMS.BOT_TYPE) || localStorage.getItem(EC_CHATBOT_STORAGE_KEYS.BOT_TYPE),
    user_input_id: getUrlParameter(EC_CHATBOT_CONVERSION_PARAMS.USER_INPUT_ID) || localStorage.getItem(EC_CHATBOT_STORAGE_KEYS.USER_INPUT_ID)
  };

  // Gửi request lên chatbot server
  const sendConversionData = async () => {
    try {
      const response = await fetch(`${getEcChatBotApiServerBaseUrl()}/api/v1/scenario_users/conversions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (response.ok) {
        Object.values(EC_CHATBOT_STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error sending conversion data:', error);
    }
  };

  sendConversionData();

  const device = tabletCheck() ? "tablet" : (mobileCheck() ? "smartphone" : "pc");

  const conversion = {
    scenario_data: `${device}_conversion`,
  };

  sendCountRequest(scenarioId, conversion).then(res => console.log(res));
})();