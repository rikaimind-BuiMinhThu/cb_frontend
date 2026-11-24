const getEnvFromScriptSrc = () => {
  try {
    if (window.getSdkEnv) return window.sdkEnv;

    window.getSdkEnv = true;

    const SRC_PARSER = {
      'ec-chatbot1.com': 'staging',
      'ec-chatbot.com': 'production',
      'localhost:3001': 'local',
    };

    const src = document.currentScript?.src || '';

    if (!src) return null;

    const host = new URL(src).host;
    const sdkEnv = SRC_PARSER[host];

    if (sdkEnv) {
      window.sdkEnv = sdkEnv;
      return sdkEnv;
    }

    return null;
  } catch {
    return null;
  }
};

export const getEnvironment = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.env || getEnvFromScriptSrc() || 'production';
};

export const getDebugFlag = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.debug === 'true' || params.debug === '1';
};

export const getParam = (paramName) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params[paramName];
};

export const log = (message) => {
  const debugFlag = getDebugFlag();

  if (debugFlag) {
    console.log(message);
  }
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_QUERY_PARAM = 'api';
const API_ENV_PRODUCTION = 'production';
const API_ENV_STAGING = 'staging';
const API_ENV_TEST = 'test';
const API_BASE_URL_PRODUCTION = 'https://ec-chatbot-test.com';
const API_BASE_URL_STAGING = 'https://ec-chatbot-test1.com';
const API_BASE_URL_LOCAL = 'http://localhost:3000';

const resolveApiBaseUrlFromQuery = () => {
  const apiOverride = getParam(API_QUERY_PARAM);
  if (apiOverride === API_ENV_PRODUCTION) {
    return API_BASE_URL_PRODUCTION;
  }
  if (apiOverride === API_ENV_STAGING || apiOverride === API_ENV_TEST) {
    return API_BASE_URL_STAGING;
  }
  return null;
};

export const getEcChatBotApiServerBaseUrl = () => {
  const apiFromQuery = resolveApiBaseUrlFromQuery();
  if (apiFromQuery) {
    return apiFromQuery;
  }

  const environment = getEnvironment();
  switch (environment) {
    case 'staging':
    case 'test':
      return API_BASE_URL_STAGING;
    case 'production':
      return API_BASE_URL_PRODUCTION;
    case 'local':
      return API_BASE_URL_LOCAL;
    default:
      return API_BASE_URL_LOCAL;
  }
};

export const getEcChatBotFrontEndBaseUrl = () => {
  // return 'http://localhost:3001';
  const environment = getEnvironment();

  switch (environment) {
    case 'staging':
    case 'test':
      return 'https://ec-chatbot1.com';
    case 'production':
      return 'https://ec-chatbot.com';
    case 'local':
      return 'http://localhost:3001';
    default:
      return 'http://localhost:3001';
  }
};
