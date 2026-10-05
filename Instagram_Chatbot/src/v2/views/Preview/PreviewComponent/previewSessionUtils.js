const LP_RESET_QUERY_KEY = "lp_reset";
const LP_RESET_QUERY_VALUE = "1";
const SCENARIO_ID_QUERY_KEY = "scenario_id";
const CHATBOT_H_KEY = "chatbotH";
const CHATBOT_BOTTOM_KEY = "chatbotBottom";
const CHATBOT_STATE_KEY = "chatbotState";
const PREV_OPEN_STATUS_KEY = "prevOpenStatus";
const TIMER_CONFIG_KEY = "timerConfig";
const CHATBOT_KEY_PREFIX = "chatbot";
const MESSAGES_BOT_PREFIX = "messages_bot_";
const LP_SWAP_ACTION = "lpSwapUgcSample";
const LP_SWAP_MISS = "lpSwapUgcSampleMiss";
const LP_SWAP_DONE = "lpSwapUgcSampleDone";
const LP_SWAP_LOCK_KEY = "__lpUgcSwapLock";
const SEND_FRAME_ID_ACTION = "sendFrameId";
const TAKEJS_LOADED_ACTION = "takejsLoaded";
const TAKEJS_TIKTOK_LOADED_ACTION = "takejsTiktokLoaded";
const TIKTOK_TYPE = "tt";
const QID_PARAM = "qid";
const FRAME_NUM = "0";
const IFRAME_WIDTH = "100%";
const IFRAME_BORDER = "0";
const IFRAME_DISPLAY = "block";
const MIN_HEIGHT_PROP = "min-height";
const DATA_UGC_TAKE_INITED = "data-ugc-take-inited";
const DATA_NUM = "data-num";
const DATA_HOST = "data-host";
const REVIEW_TYPE = "rv";
const SEND_FRAME_DELAY_MS = 400;
const SEND_FRAME_RETRY_MS = 800;

const LP_UGC_IFRAME_INFO = {
  ig: { iframeClass: "ugc-slider", wrapClass: "ugc-slider-wrapper", info: "ugc-slider-info" },
  tt: { iframeClass: "ugc-tiktok-slider", wrapClass: "ugc-tiktok-slider-wrapper", info: "ugc-tiktok-slider-info" },
  rv: { iframeClass: "ugc-review-slider", wrapClass: "ugc-review-slider-wrapper", info: "ugc-review-slider-info" },
};

export const shouldSkipSavedChatbotState = (params, savedState) => {
  if (!savedState) {
    return false;
  }
  if (params.get(LP_RESET_QUERY_KEY) === LP_RESET_QUERY_VALUE) {
    return true;
  }
  const urlScenarioId = params.get(SCENARIO_ID_QUERY_KEY);
  if (urlScenarioId && String(urlScenarioId) !== String(savedState.scenarioId)) {
    return true;
  }
  return false;
};

export const clearChatbotState = () => {
  sessionStorage.removeItem(CHATBOT_H_KEY);
  sessionStorage.removeItem(CHATBOT_BOTTOM_KEY);
  sessionStorage.removeItem(CHATBOT_STATE_KEY);
  sessionStorage.removeItem(PREV_OPEN_STATUS_KEY);
  sessionStorage.removeItem(TIMER_CONFIG_KEY);
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith(CHATBOT_KEY_PREFIX) || key.startsWith(MESSAGES_BOT_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  });
};

const notifyLpSwap = (action, type) => {
  try {
    if (window.parent && window.parent !== window) {
      const payload = { action };
      if (type) {
        payload.type = type;
      }
      window.parent.postMessage(payload, "*");
    }
  } catch (_error) {
    // ignore cross-origin notify failures
  }
};

const qidFromSrc = (src) => {
  try {
    return new URL(src, window.location.href).searchParams.get(QID_PARAM) || "";
  } catch (_error) {
    return "";
  }
};

const iframeHasQid = (iframe, qid) => {
  if (!iframe || !qid) {
    return false;
  }
  const current = qidFromSrc(iframe.src || iframe.getAttribute("src") || "");
  return current !== "" && current === String(qid);
};

const holdIframeBox = (iframe, spec) => {
  iframe.className = spec.iframeClass;
  const currentH = iframe.style.height || (iframe.offsetHeight ? `${iframe.offsetHeight}px` : "");
  iframe.style.width = IFRAME_WIDTH;
  iframe.style.border = IFRAME_BORDER;
  iframe.style.display = IFRAME_DISPLAY;
  iframe.style.removeProperty(MIN_HEIGHT_PROP);
  if (currentH) {
    iframe.style.height = currentH;
  }
  if (iframe.parentElement) {
    iframe.parentElement.className = spec.wrapClass;
  }
};

export const applyLpUgcSampleSwap = (data) => {
  const spec = LP_UGC_IFRAME_INFO[data?.type];
  if (!spec || !data?.src) {
    notifyLpSwap(LP_SWAP_MISS, data?.type);
    return false;
  }

  const iframe = document.querySelector(`iframe.${spec.iframeClass}`);
  if (!iframe) {
    notifyLpSwap(LP_SWAP_MISS, data.type);
    return false;
  }

  const locks = window[LP_SWAP_LOCK_KEY] && typeof window[LP_SWAP_LOCK_KEY] === "object"
    ? window[LP_SWAP_LOCK_KEY]
    : {};
  window[LP_SWAP_LOCK_KEY] = locks;

  const qid = data.qid || qidFromSrc(data.src);
  const force = data.force === true;
  if (!force && (iframeHasQid(iframe, qid) || locks[data.type] === data.src)) {
    if (iframeHasQid(iframe, qid)) {
      notifyLpSwap(LP_SWAP_DONE, data.type);
    }
    return true;
  }

  locks[data.type] = data.src;

  holdIframeBox(iframe, spec);
  iframe.removeAttribute(DATA_UGC_TAKE_INITED);
  iframe.removeAttribute(DATA_NUM);

  const infoEl = document.getElementById(spec.info);
  if (infoEl && data.host) {
    infoEl.setAttribute(DATA_HOST, data.host);
  }

  notifyLpSwap(LP_SWAP_DONE, data.type);

  if (data.type === REVIEW_TYPE) {
    iframe.src = data.src;
    return true;
  }

  iframe.setAttribute(DATA_NUM, FRAME_NUM);
  const frameId = qid ? `${qid}_${FRAME_NUM}` : "";
  const send = () => {
    if (!qid || !iframe.contentWindow) {
      return;
    }
    try {
      iframe.contentWindow.postMessage({ action: SEND_FRAME_ID_ACTION, message: frameId }, "*");
      iframe.contentWindow.postMessage(
        { action: data.type === TIKTOK_TYPE ? TAKEJS_TIKTOK_LOADED_ACTION : TAKEJS_LOADED_ACTION },
        "*",
      );
    } catch (_error) {
      // ignore
    }
  };
  iframe.addEventListener("load", send, { once: true });
  iframe.src = data.src;
  window.setTimeout(send, SEND_FRAME_DELAY_MS);
  window.setTimeout(send, SEND_FRAME_RETRY_MS);
  return true;
};

export const subscribeLpUgcSampleSwap = () => {
  const onMessage = (event) => {
    const payload = event.data;
    if (!payload || payload.action !== LP_SWAP_ACTION) {
      return;
    }
    applyLpUgcSampleSwap(payload);
  };
  window.addEventListener("message", onMessage);
  return () => window.removeEventListener("message", onMessage);
};
