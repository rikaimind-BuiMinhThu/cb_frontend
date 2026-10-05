import { getEcChatBotApiServerBaseUrl } from './config/environment.js';

const REDIRECT_FLAG = '__EC_CHAT_BODY_VERSION_REDIRECTED__';

/** Captured when this module first evaluates (script load time). */
const sdkScriptEl = typeof document !== 'undefined' ? document.currentScript : null;

function getFrontendBaseFromScript() {
  try {
    const src = sdkScriptEl?.src;
    if (src) return new URL(src).origin;
  } catch {
    // ignore
  }
  return '';
}

function injectAlternateScript(alternateScriptPath) {
  window[REDIRECT_FLAG] = true;
  const script = document.createElement('script');
  script.src = `${getFrontendBaseFromScript()}${alternateScriptPath}`;
  script.defer = true;
  (document.head || document.documentElement).appendChild(script);
}

/**
 * If the chatbot's chat_body_version does not match this entry SDK, load the
 * alternate script and return true. On failure / missing bot_id, fail open
 * (return false so the current SDK continues).
 *
 * @param {{ entryVersion: string, alternateScriptPath: string }} options
 * @returns {Promise<boolean>} true when redirected away from this entry
 */
export async function resolveChatBodyVersionGate({ entryVersion, alternateScriptPath }) {
  if (window[REDIRECT_FLAG]) {
    return false;
  }

  let botId = null;
  try {
    botId = sessionStorage.getItem('bot_id');
  } catch {
    // ignore
  }

  if (!botId) {
    return false;
  }

  try {
    const response = await fetch(
      `${getEcChatBotApiServerBaseUrl()}/api/v1/managements/chatbots/${encodeURIComponent(botId)}/chat_body_version`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      },
    );
    const data = await response.json();
    const version = data?.data?.chat_body_version;
    if (version && version !== entryVersion) {
      injectAlternateScript(alternateScriptPath);
      return true;
    }
  } catch {
    // Fail open: continue with the current entry.
  }

  return false;
}
