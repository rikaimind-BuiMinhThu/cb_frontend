const isLanHost = (host) => {
  const hostname = String(host || '').split(':')[0];
  return /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);
};

const cacheSdkScriptOrigin = (src) => {
  try {
    window.sdkScriptOrigin = new URL(src).origin;
  } catch {
    // ignore
  }
};

const getEnvFromScriptSrc = () => {
  try {
    if (window.getSdkEnv) return window.sdkEnv;

    window.getSdkEnv = true;

    const SRC_PARSER = {
      'ec-chatbot1.com': 'staging',
      'ec-chatbot.com': 'production',
      'localhost:3001': 'local',
      '127.0.0.1:3001': 'local',
    };

    const src = document.currentScript?.src || '';

    if (!src) return null;

    const host = new URL(src).host;
    cacheSdkScriptOrigin(src);

    if (isLanHost(host)) {
      window.sdkEnv = 'lan';
      return 'lan';
    }

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

const getLanFrontEndBaseUrl = () => {
  if (window.sdkScriptOrigin) return window.sdkScriptOrigin;
  try {
    const src = document.querySelector('script[src*="/v2/sdk"]')?.src
      || document.querySelector('script[src*="sdk.js"]')?.src
      || '';
    if (src) {
      cacheSdkScriptOrigin(src);
      if (window.sdkScriptOrigin) return window.sdkScriptOrigin;
    }
  } catch {
    // ignore
  }
  return window.location.origin;
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

export const getEcChatBotApiServerBaseUrl = () => {
  const environment = getEnvironment();
  switch (environment) {
    case 'staging':
    case 'test':
    case 'lan':
      return 'https://ec-chatbot-test1.com';
    case 'production':
      return 'https://ec-chatbot-test.com';
    case 'local':
      return 'http://localhost:3000';
    default:
      return 'http://localhost:3000';
  }
};

export const getEcChatBotFrontEndBaseUrl = () => {
  const environment = getEnvironment();

  switch (environment) {
    case 'staging':
    case 'test':
      return 'https://ec-chatbot1.com';
    case 'production':
      return 'https://ec-chatbot.com';
    case 'lan':
      return getLanFrontEndBaseUrl();
    case 'local':
      return 'http://localhost:3001';
    default:
      return 'http://localhost:3001';
  }
};
