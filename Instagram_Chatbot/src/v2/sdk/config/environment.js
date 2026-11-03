const LOCAL_DEV_PORT = '3001';
const PRIVATE_LAN_HOST_PATTERN = /^(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/i;

const isLocalDevHost = (host) => {
  if (!host) return false;
  const [hostname, port] = String(host).split(':');
  if (port && port !== LOCAL_DEV_PORT) return false;
  if (!port && hostname !== 'localhost' && hostname !== '127.0.0.1') return false;
  return PRIVATE_LAN_HOST_PATTERN.test(hostname)
    || PRIVATE_LAN_HOST_PATTERN.test(host);
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
    const sdkEnv = SRC_PARSER[host] || (isLocalDevHost(host) ? 'local' : null);

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

export const getEcChatBotApiServerBaseUrl = () => {
  // return 'https://ec-chatbot-test1.com';
  const environment = getEnvironment();
  switch (environment) {
    case 'staging':
    case 'test':
      return 'https://ec-chatbot-test1.com';
    case 'production':
      return 'https://ec-chatbot-test.com';
    case 'local':
      // Local FE testing against staging API (do not commit).
      return 'https://ec-chatbot-test1.com';
    default:
      return 'http://localhost:3000';
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
    case 'local': {
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        const { protocol, hostname, port } = window.location;
        if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
          return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
        }
      }
      return 'http://localhost:3001';
    }
    default:
      return 'http://localhost:3001';
  }
};
