import { CHATBOT_ACTIONS, LP_INTEGRATION_MODES } from './constants.js';
import { extractSelectorBindingsFromMessages } from './amazon/bindings.js';
import { resolveLpMode } from './amazon/detection.js';
import {
  appendIframeToBody,
  loadIframeForW2Repeat,
  waitToLoadAmazonEcForce,
  waitToLoadAmazonGeneric,
  waitToLoadAmazonSubscstore,
} from './amazon/loaders.js';
import {
  getDebugFlag,
  getEcChatBotApiServerBaseUrl,
  getEcChatBotFrontEndBaseUrl,
  getEnvironment,
  log,
  sleep,
} from './config/environment.js';
import { getSdkPreviewBasePath } from './config/previewPath.js';
import { mobileCheck, tabletCheck } from './device.js';
import { fillDataFromMessage, movePaymentMethodToTop } from './dom/formFill.js';
import { getElementByAddress } from './dom/lookup.js';
import { ecRunEcForceSessionLandingLogout } from './integrations/ecforceSession.js';
import { injectCustomJS } from './integrations/customJs.js';
import {
  applyIframeHorizontalAnchor,
  formatClosedIframeSize,
  getClosedContentDimensions,
  getDesktopOffsets,
  getMobileCloseOffsets,
  getUseMobileFullwidth,
  resizeIframeFromMessage,
} from './layout/iframeLayout.js';
import {
  crawlDataAndSendMessage,
  excuteJSCode,
  processGetErrorMessage,
  setChatbotConversionParamsToLocalStorage,
} from './messaging/crawl.js';
import {
  botId,
  chatbotLayout,
  setGlobalIframe,
  setScenarioId,
  updateChatbotOffsetsFromMessage,
  uuid,
} from './state.js';

const getUser = async (url, datacount) => {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datacount),
  });
  const data = await response.json();
  log(data);
};

const handleChatbotMessage = async (e, iframe) => {
  if (typeof e.data !== 'object') return;
  if (e.data.source !== 'ec-chatbot') return;

  updateChatbotOffsetsFromMessage(e.data);

  switch (e.data.action) {
    case CHATBOT_ACTIONS.FUKUSHASHIKI:
      e.data.actionData = movePaymentMethodToTop(e.data.actionData);
      await fillDataFromMessage(e.data.actionData);
      break;
    case CHATBOT_ACTIONS.GET_ERROR_MESSAGE:
      processGetErrorMessage(e.data.actionData);
      break;
    case CHATBOT_ACTIONS.EXCUTE_JS:
      excuteJSCode(e.data.actionData);
      break;
    case CHATBOT_ACTIONS.CRAWL_DATA:
      await sleep(500);
      await crawlDataAndSendMessage(e.data.actionData);
      break;
    case CHATBOT_ACTIONS.CLICK_BUTTON:
      (function () {
        const data = e.data.actionData;

        const clickElement = (button) => {
          if (!button) {
            const target = typeof data === 'string' ? data : data?.searchValue;
            const err = new Error(`Button not found: ${target}`);
            try {
              if (window.Sentry) {
                window.Sentry.captureException(err);
                console.log('Sentry captured missing button error:', target);
              } else {
                console.warn('Button not found (Sentry not available):', target);
              }
            } catch (captureErr) {
              console.warn('Error while sending missing-button to Sentry', captureErr);
            }
            return;
          }

          try {
            button.click();
          } catch (clickErr) {
            try { if (window.Sentry) window.Sentry.captureException(clickErr); } catch (err) { /* ignore */ }
            throw clickErr;
          }
        };

        if (typeof data === 'string') {
          clickElement(document.getElementById(data));
          return;
        }

        if (data && data.searchMode && data.searchValue) {
          clickElement(getElementByAddress(data.searchMode, data.searchValue));
          return;
        }

        console.warn('[CLICK_BUTTON] Invalid actionData:', data);
      })();
      break;
    case CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT: {
      const { isNewProcess = false } = e.data;

      if (!isNewProcess) {
        await sleep(2000);
      }
      excuteJSCode(e.data.actionData);
      break;
    }
    case CHATBOT_ACTIONS.SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE:
      setChatbotConversionParamsToLocalStorage(e.data.actionData);
      break;
    case CHATBOT_ACTIONS.INJECT_CUSTOM_JS:
      injectCustomJS(e.data.actionData);
      break;
    default:
      break;
  }

  if (e.data.isOpen === undefined) return;

  resizeIframeFromMessage(iframe, e.data);

  iframe.style.width = `${iframe.width} !important`;
  iframe.style.height = `${iframe.height} !important`;
  if (e.data.isOpen && mobileCheck() && !e.data.isUpsell) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'scroll';
  }
  setGlobalIframe(iframe);
};

export const displayPopup = async () => {
  const device =
    !tabletCheck() && !mobileCheck()
      ? 'pc'
      : tabletCheck()
        ? 'tablet'
        : 'smartphone';
  const response = await fetch(
    `${getEcChatBotApiServerBaseUrl()}/api/v1/managements/chatbots/${botId}/get_scenario_selected`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await response.json();
  if (data.data && data.data.is_clear_landing_page_session) {
    ecRunEcForceSessionLandingLogout();
  }
  setScenarioId(data.data.id);

  const scenarioMessages = data.data?.messages || [];
  const selectorBindings = extractSelectorBindingsFromMessages(scenarioMessages);
  const amazonRuntimeConfig = {
    allowed_lp_domains: data.data?.allowed_lp_domains || [],
    lp_integration_mode: data.data?.lp_integration_mode || LP_INTEGRATION_MODES.AUTO,
    amazon_pay_config: data.data?.amazon_pay_config || {},
    messages: scenarioMessages,
    target_messages: scenarioMessages,
    selector_bindings: selectorBindings,
    cart_system: data.cart_system,
  };

  const iframe = document.createElement('iframe');
  const isMobile = mobileCheck();
  const mobileCloseOffsets = getMobileCloseOffsets();
  const desktopOffsets = getDesktopOffsets();

  if (isMobile) {
    iframe.width = '100%';
    iframe.style.maxWidth = '100%';
    applyIframeHorizontalAnchor(iframe, mobileCloseOffsets.horizontal);
  } else {
    const initialClosedSize = formatClosedIframeSize(
      getClosedContentDimensions({}, false),
      desktopOffsets.horizontal,
      desktopOffsets.bottom,
    );
    iframe.width = initialClosedSize.width;
    applyIframeHorizontalAnchor(iframe, desktopOffsets.horizontal);
  }

  iframe.id = 'previewSdk';
  iframe.style.position = 'fixed';
  iframe.style.setProperty('bottom', isMobile ? `${mobileCloseOffsets.bottom}px` : '0px', 'important');
  iframe.height = isMobile
    ? `${mobileCloseOffsets.bottom + getClosedContentDimensions({}, getUseMobileFullwidth({})).height}px`
    : formatClosedIframeSize(
      getClosedContentDimensions({}, false),
      desktopOffsets.horizontal,
      desktopOffsets.bottom,
    ).height;

  iframe.style.border = 'none';
  iframe.style.padding = '0';
  iframe.style.margin = '0';
  iframe.style.borderRadius = '0px';
  iframe.style.zIndex = '999999';
  iframe.style.width = `${iframe.width} !important`;
  iframe.style.height = `${iframe.height} !important`;
  iframe.src = `${getEcChatBotFrontEndBaseUrl()}${getSdkPreviewBasePath()}/preview-customer-fukushashiki?bot_id=${botId}&scenario_id=${chatbotLayout.scenarioId}&urlReceive=${window.location.origin
  }&deviceReceive=${device}&uuid=${uuid}&env=${getEnvironment()}&debug=${getDebugFlag()}&cartSystem=${data.cart_system}&isLoggedIn=${window.logged_in}`;

  const lpMode = resolveLpMode({
    hostname: window.location.hostname,
    scenarioConfig: amazonRuntimeConfig,
  });

  switch (lpMode) {
    case 'GENERIC':
      waitToLoadAmazonGeneric(iframe, amazonRuntimeConfig);
      break;
    case 'LEGACY_TORIZEN':
      waitToLoadAmazonSubscstore(iframe);
      break;
    case 'LEGACY_YUWAERU':
      loadIframeForW2Repeat(iframe);
      break;
    case 'LEGACY_ECFORCE':
      waitToLoadAmazonEcForce(iframe);
      break;
    default:
      appendIframeToBody(iframe);
      break;
  }

  window.addEventListener(
    'message',
    (e) => {
      handleChatbotMessage(e, iframe);
    },
    false,
  );

  log('device: ', device);
  setTimeout(() => {
    const checkDevice = { scenario_data: device };
    getUser(`${getEcChatBotApiServerBaseUrl()}/api/v1/analytics/scenario_counts/${chatbotLayout.scenarioId}`, checkDevice);
  }, 5000);
};
