// Initialize Sentry (single clean block)
(function initSentry() { 
  try {
    // Avoid double-initializing if sdk is loaded multiple times
    if (window.__SENTRY_SDK_V2_INITIALIZED__) return;
    window.__SENTRY_SDK_V2_INITIALIZED__ = true;

  var sentryScript = document.createElement('script');
  // Use the official browser CDN path (no @sentry/browser prefix) to avoid 404/CORS
  sentryScript.src = 'https://browser.sentry-cdn.com/7.57.0/bundle.min.js';
    sentryScript.crossOrigin = 'anonymous';

    sentryScript.onload = function () {
      try {
        if (window.Sentry && !window.__SENTRY_INITIALIZED__) {
          window.__SENTRY_INITIALIZED__ = true;
          window.Sentry.init({
            dsn: 'https://12b50bfdf6c0598e78a84630e5f7e40b@o4510197539930112.ingest.us.sentry.io/4510256042868736',
            debug: false,
            sendDefaultPii: true,
            integrations: (typeof window.Sentry !== 'undefined' && typeof window.Sentry.BrowserTracing === 'function') ? [new window.Sentry.BrowserTracing()] : []
          });
          console.log('Sentry initialized (sdk-v2)');

          // Attach global handlers so runtime errors and promise rejections are captured
          try {
            window.addEventListener('error', function(evt) {
              try {
                var err = evt && evt.error ? evt.error : new Error('window.error: ' + (evt && evt.message ? evt.message : String(evt)));
                if (window.Sentry) {
                  window.Sentry.captureException(err);
                  console.log('Sentry captured window.error');
                }
              } catch (e) {
                console.warn('Error forwarding window.error to Sentry', e);
              }
            });

            window.addEventListener('unhandledrejection', function(evt) {
              try {
                var reason = evt && evt.reason ? evt.reason : new Error('Unhandled rejection');
                if (window.Sentry) {
                  window.Sentry.captureException(reason);
                  console.log('Sentry captured unhandledrejection');
                }
              } catch (e) {
                console.warn('Error forwarding unhandledrejection to Sentry', e);
              }
            });

            // helper to manually capture exceptions from page
            window.__sdk_v2_captureException = function(e) { if (window.Sentry) { return window.Sentry.captureException(e); } };

            // Override console.error to forward to Sentry (with recursion guard)
            (function() {
              var origConsoleError = console.error && console.error.bind ? console.error.bind(console) : function(){return;};
              var inProgress = false;
              console.error = function() {
                var args = Array.prototype.slice.call(arguments);
                if (inProgress) {
                  return origConsoleError.apply(console, args);
                }
                try {
                  inProgress = true;
                  if (window.Sentry) {
                    var first = args[0];
                    var err;
                    if (first instanceof Error) err = first;
                    else {
                      try { err = new Error(args.map(function(a){ return typeof a === 'string' ? a : JSON.stringify(a); }).join(' ')); }
                      catch (e) { err = new Error(String(first)); }
                    }
                    try {
                      var eid = window.Sentry.captureException(err);
                      origConsoleError('Sentry.captureException eventId:', eid);
                    } catch(e) {
                      origConsoleError('Sentry capture failed:', e);
                    }
                  }
                } finally {
                  inProgress = false;
                  return origConsoleError.apply(console, args);
                }
              };
            })();

            // Axios interceptor to capture response errors automatically
            try {
              if (window.axios && window.Sentry) {
                if (!window.__sdk_v2_axios_installed__) {
                  window.__sdk_v2_axios_installed__ = true;
                  window.axios.interceptors.response.use(function (resp) { return resp; }, function (error) {
                    try {
                      var ev = window.Sentry.captureException(error);
                      console.log('Sentry.captureException eventId (axios):', ev);
                    } catch(e) {
                      console.warn('Failed to capture axios error in Sentry', e);
                    }
                    return Promise.reject(error);
                  });
                }
              }
            } catch (e) {
              console.warn('Failed to install axios interceptor (sdk-v2):', e);
            }
          } catch (handlerErr) {
            console.warn('Failed to attach global Sentry handlers (sdk-v2):', handlerErr);
          }
        }
      } catch (e) {
        console.error('Sentry init error (sdk-v2):', e);
      }


    };

    sentryScript.onerror = function (err) {
      console.error('Failed to load Sentry script (sdk-v2):', err);
    };

    document.head.appendChild(sentryScript);
  } catch (outer) {
    console.error('Failed to setup Sentry loader (sdk-v2):', outer);
  }
})();

// Error tracking wrapper function
function trackError(error, context = {}) {
  if (window.Sentry) {
    try {
      var ev = Sentry.captureException(error, { extra: context });
      console.log('Sentry.captureException eventId:', ev);
    } catch (e) {
      console.warn('Sentry.captureException failed in trackError', e);
    }
  }
  console.error(error);
}

// Wrap your main functions with try-catch
function wrapWithErrorHandling(fn, fnName) {
  return function wrapped(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      trackError(error, {
        functionName: fnName,
        arguments: JSON.stringify(args)
      });
      throw error;
    }
  };
}

const WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT = 20;

const CHATBOT_ACTIONS = {
  CLICK_BUTTON: 'clickButton',
  EXCUTE_JS: 'excuteJS',
  FUKUSHASHIKI: 'fukushashiki',
  INJECT_CUSTOM_JS: 'injectCustomJS',
  GET_ERROR_MESSAGE: 'getErrorMessage',
  CRAWL_DATA: 'crawlData',
  OPEN_PREVIEW: 'openPreview',
  GET_PREVIEW_ORDER_CONTENT: 'getPreviewOrderContent',
  SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE: 'setChatbotConversionParamsToLocalStorage',
  UPDATE_AMAZON_PAY_DATA_BY_SELECTOR: 'updateAmazonPayDataBySelector',
};

const LP_INTEGRATION_MODES = {
  GENERIC: 'generic',
  LEGACY: 'legacy',
  AUTO: 'auto',
};

const FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX = '_fukushashiki_search_value';

const AMAZON_SELECTOR_TO_VALUE_PATH = {
  left_fukushashiki_search_value: 'text_input.text.valueLeft',
  right_fukushashiki_search_value: 'text_input.text.valueRight',
  fukushashiki_search_value: 'text_input.text.value',
  value_fukushashiki_search_value: 'text_input.text.value',
  valueConfirm_fukushashiki_search_value: 'text_input.text.valueConfirm',
  confirm_fukushashiki_search_value: 'text_input.password_confirmation.value',
  value1_fukushashiki_search_value: 'text_input.phone_number.value1',
  value2_fukushashiki_search_value: 'text_input.phone_number.value2',
  value3_fukushashiki_search_value: 'text_input.phone_number.value3',
  post_code_fukushashiki_search_value: 'zip_code_address.value_post_code',
  post_code_left_fukushashiki_search_value: 'zip_code_address.value_post_code_left',
  post_code_right_fukushashiki_search_value: 'zip_code_address.value_post_code_right',
  prefecture_fukushashiki_search_value: 'zip_code_address.value_prefecture',
  municipality_fukushashiki_search_value: 'zip_code_address.value_municipality',
  address_fukushashiki_search_value: 'zip_code_address.value_address',
  building_name_fukushashiki_search_value: 'zip_code_address.building_name',
  initial_selection_fukushashiki_search_value: 'radio_button.initial_selection',
  checkedValue_fukushashiki_search_value: 'checkbox.checkedValue',
};

const DEFAULT_AMAZON_DETECTION = {
  match: 'any',
  strategies: [
    { type: 'url_param', param: 'amazonCheckoutSessionId' },
    { type: 'dom_selector', selector: '#amazon_payment_method' },
  ],
  ready_when: [],
};

const DEFAULT_AMAZON_PAY_CONFIG = {
  poll_interval_ms: 200,
  max_count: 20,
  amazon_detection: DEFAULT_AMAZON_DETECTION,
};

const evaluateAmazonStrategy = (strategy) => {
  if (!strategy?.type) return false;
  if (strategy.type === 'url_param') {
    const param = strategy.param;
    if (!param) return false;
    const value = getParam(param);
    return value != null && String(value).trim() !== '';
  }
  if (strategy.type === 'dom_selector') {
    const selector = strategy.selector;
    if (!selector) return false;
    return !!document.querySelector(selector);
  }
  return false;
};

const evaluateAmazonReadyCondition = (condition) => {
  if (condition?.type !== 'dom_value') return false;
  const selector = condition.selector;
  if (!selector) return false;
  const el = document.querySelector(selector);
  if (!el) return false;
  return String(el.value || '').trim() !== '';
};

const isAmazonPayActive = (detection) => {
  const strategies = detection?.strategies || [];
  if (!strategies.length) return false;
  const match = detection?.match || 'any';
  if (match === 'all') {
    return strategies.every((strategy) => evaluateAmazonStrategy(strategy));
  }
  return strategies.some((strategy) => evaluateAmazonStrategy(strategy));
};

const isAmazonPayReady = (detection) => {
  const readyWhen = detection?.ready_when || [];
  if (!readyWhen.length) return true;
  return readyWhen.every((condition) => evaluateAmazonReadyCondition(condition));
};

const normalizeLpDomain = (input) => {
  if (!input || typeof input !== 'string') return '';
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0].split('?')[0].split('#')[0];
  domain = domain.replace(/^www\./, '');
  return domain;
};

const isHostnameAllowedForLp = (hostname, allowedDomains) => {
  const host = normalizeLpDomain(hostname);
  if (!host) return false;
  return (allowedDomains || []).some((domain) => host === domain || host.endsWith(`.${domain}`));
};

const splitSourceSelectors = (rawValue) => {
  if (typeof rawValue !== 'string') return [];
  return rawValue.split(',').map((selector) => selector.trim()).filter(Boolean);
};

const buildBindingsFromSelectorKey = ({ selectorKeyType, rawValue, valuePath }) => {
  if (!selectorKeyType || !valuePath) return [];
  return splitSourceSelectors(rawValue).map((sourceSelector) => ({
    selectorKeyType,
    sourceSelector,
    valuePath,
  }));
};

const bindingsFromFieldTypes = ({
  content,
  fieldTypes,
  getSelectorKeyType,
  getValuePath,
  shouldIncludeField = () => true,
}) => {
  const bindings = [];
  fieldTypes.forEach((fieldType) => {
    if (!shouldIncludeField(fieldType, content)) return;
    const selectorKeyType = getSelectorKeyType(fieldType);
    const valuePath = getValuePath(fieldType);
    const rawValue = content[selectorKeyType];
    bindings.push(...buildBindingsFromSelectorKey({ selectorKeyType, rawValue, valuePath }));
  });
  return bindings;
};

const appendBinding = (bindings, seen, binding) => {
  if (!binding?.selectorKeyType || !binding?.sourceSelector || !binding?.valuePath) return;
  const dedupeKey = `${binding.selectorKeyType}::${binding.sourceSelector}`;
  if (seen.has(dedupeKey)) return;
  seen.add(dedupeKey);
  bindings.push(binding);
};

const appendBindings = (bindings, seen, newBindings) => {
  (newBindings || []).forEach((binding) => appendBinding(bindings, seen, binding));
};

const ZIP_FIELD_TYPES = [
  'post_code', 'post_code_left', 'post_code_right', 'prefecture', 'municipality', 'address', 'building_name',
];

const SHIPPING_FIELD_TYPES = [
  'number1', 'number2', 'number3', 'number', 'name_left', 'name_right', 'kana_left', 'kana_right',
  'building_name', 'address', 'municipality', 'prefecture', 'post_code', 'post_code_left', 'post_code_right',
  'initial_selection',
];

const CARD_PAYMENT_FIELD_TYPES = [
  'card_number', 'card_holder1', 'card_holder2', 'card_holder', 'year', 'month', 'cvc',
  'card_number1', 'card_number2', 'card_number3', 'card_number4', 'installment', 'initial_selection',
];

const extractTextInputBindings = (content) => {
  const bindings = [];
  const inputType = content.text_input?.type;
  switch (inputType) {
    case 'text':
      if (content.text_input?.text?.isSplitInput) {
        bindings.push(
          ...buildBindingsFromSelectorKey({
            selectorKeyType: 'left_fukushashiki_search_value',
            rawValue: content.left_fukushashiki_search_value,
            valuePath: 'text_input.text.valueLeft',
          }),
          ...buildBindingsFromSelectorKey({
            selectorKeyType: 'right_fukushashiki_search_value',
            rawValue: content.right_fukushashiki_search_value,
            valuePath: 'text_input.text.valueRight',
          }),
        );
      }
      bindings.push(...buildBindingsFromSelectorKey({
        selectorKeyType: 'fukushashiki_search_value',
        rawValue: content.fukushashiki_search_value,
        valuePath: 'text_input.text.value',
      }));
      break;
    case 'phone_number':
      if (content.text_input?.phone_number?.withHyphen === false) {
        bindings.push(...buildBindingsFromSelectorKey({
          selectorKeyType: 'fukushashiki_search_value',
          rawValue: content.fukushashiki_search_value,
          valuePath: 'text_input.phone_number.value',
        }));
        break;
      }
      bindings.push(...bindingsFromFieldTypes({
        content,
        fieldTypes: ['value1', 'value2', 'value3'],
        getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
        getValuePath: (fieldType) => `text_input.phone_number.${fieldType}`,
      }));
      break;
    case 'email_confirmation':
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: 'value_fukushashiki_search_value',
          rawValue: content.value_fukushashiki_search_value,
          valuePath: `text_input.${inputType}.value`,
        }),
        ...buildBindingsFromSelectorKey({
          selectorKeyType: 'valueConfirm_fukushashiki_search_value',
          rawValue: content.valueConfirm_fukushashiki_search_value,
          valuePath: `text_input.${inputType}.valueConfirm`,
        }),
      );
      break;
    case 'password_confirmation':
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: 'fukushashiki_search_value',
          rawValue: content.fukushashiki_search_value,
          valuePath: 'text_input.password_confirmation.value',
        }),
        ...buildBindingsFromSelectorKey({
          selectorKeyType: 'confirm_fukushashiki_search_value',
          rawValue: content.confirm_fukushashiki_search_value,
          valuePath: 'text_input.password_confirmation.valueConfirm',
        }),
      );
      break;
    case 'email_address':
    case 'urls':
    case 'password':
      bindings.push(...buildBindingsFromSelectorKey({
        selectorKeyType: 'fukushashiki_search_value',
        rawValue: content.fukushashiki_search_value,
        valuePath: `text_input.${inputType}.value`,
      }));
      break;
    default:
      break;
  }
  return bindings;
};

const extractZipCodeAddressBindings = (content) => bindingsFromFieldTypes({
  content,
  fieldTypes: ZIP_FIELD_TYPES,
  getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
  getValuePath: (fieldType) => (fieldType === 'building_name'
    ? 'zip_code_address.building_name'
    : `zip_code_address.value_${fieldType}`),
  shouldIncludeField: (fieldType) => fieldType !== 'await',
});

const extractShippingAddressBindings = (content) => bindingsFromFieldTypes({
  content,
  fieldTypes: SHIPPING_FIELD_TYPES,
  getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
  getValuePath: (fieldType) => `shipping_address.value_${fieldType}`,
  shouldIncludeField: (fieldType, item) => {
    const bindingMode = item[`${fieldType}_fukushashiki_search_mode`];
    const bindingValue = item[`${fieldType}_fukushashiki_search_value`];
    return bindingMode !== undefined && bindingValue !== undefined && bindingValue !== '';
  },
});

const extractCardPaymentBindings = (content) => bindingsFromFieldTypes({
  content,
  fieldTypes: CARD_PAYMENT_FIELD_TYPES,
  getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
  getValuePath: (fieldType) => `${content.type}.${fieldType}`,
});

const extractCheckboxBindings = (content) => buildBindingsFromSelectorKey({
  selectorKeyType: 'checkedValue_fukushashiki_search_value',
  rawValue: content.checkedValue_fukushashiki_search_value,
  valuePath: 'checkbox.checkedValue',
});

const extractRadioButtonBindings = (content) => buildBindingsFromSelectorKey({
  selectorKeyType: 'initial_selection_fukushashiki_search_value',
  rawValue: content.initial_selection_fukushashiki_search_value,
  valuePath: 'radio_button.initial_selection',
});

const extractTextareaBindings = (content) => buildBindingsFromSelectorKey({
  selectorKeyType: 'fukushashiki_search_value',
  rawValue: content.fukushashiki_search_value,
  valuePath: 'textarea.text_input.value',
});

const extractBindingsFromContent = (content) => {
  if (!content?.type) return [];
  switch (content.type) {
    case 'text_input': return extractTextInputBindings(content);
    case 'zip_code_address': return extractZipCodeAddressBindings(content);
    case 'shipping_address': return extractShippingAddressBindings(content);
    case 'card_payment_radio_button':
    case 'credit_card_payment': return extractCardPaymentBindings(content);
    case 'checkbox': return extractCheckboxBindings(content);
    case 'radio_button': return extractRadioButtonBindings(content);
    case 'textarea': return extractTextareaBindings(content);
    default: return [];
  }
};

const resolveValuePath = (selectorKeyType, content) => {
  if (AMAZON_SELECTOR_TO_VALUE_PATH[selectorKeyType]) {
    return AMAZON_SELECTOR_TO_VALUE_PATH[selectorKeyType];
  }
  const inputType = content?.text_input?.type || 'text';
  if (selectorKeyType === 'value_fukushashiki_search_value') {
    return `text_input.${inputType}.value`;
  }
  if (selectorKeyType === 'valueConfirm_fukushashiki_search_value') {
    return `text_input.${inputType}.valueConfirm`;
  }
  const phoneMatch = selectorKeyType.match(/^value([123])_fukushashiki_search_value$/);
  if (phoneMatch) {
    return `text_input.phone_number.value${phoneMatch[1]}`;
  }
  console.warn('[AmazonPay] unresolved valuePath for selector key:', selectorKeyType);
  return null;
};

const extractGenericFallbackBindings = (content) => {
  const bindings = [];
  Object.entries(content || {}).forEach(([selectorKeyType, rawValue]) => {
    if (!selectorKeyType.endsWith(FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX)) return;
    const valuePath = resolveValuePath(selectorKeyType, content);
    if (!valuePath) return;
    bindings.push(...buildBindingsFromSelectorKey({ selectorKeyType, rawValue, valuePath }));
  });
  return bindings;
};

const extractSelectorBindingsFromMessages = (messages) => {
  const bindings = [];
  const seen = new Set();
  (messages || [])
    .filter((msg) => msg.belong_to === 'user' && msg.is_used_when_amazon_pay)
    .forEach((msg) => {
      (msg.message_content || []).forEach((content, contentIndex) => {
        const meta = { messageId: msg.id, contentIndex };
        appendBindings(bindings, seen, extractBindingsFromContent(content).map((binding) => ({ ...binding, ...meta })));
        appendBindings(bindings, seen, extractGenericFallbackBindings(content).map((binding) => ({ ...binding, ...meta })));
      });
    });
  return bindings;
};

const collectSelectorValuesFromBindings = (bindings) => {
  const selectorValues = [];
  (bindings || []).forEach(({ selectorKeyType, sourceSelector, valuePath }) => {
    if (!sourceSelector || !valuePath) return;
    const el = document.querySelector(sourceSelector);
    if (!el) return;
    const value = (el.value || '').trim();
    if (!value) return;
    selectorValues.push({ selectorKeyType, sourceSelector, valuePath, value });
  });
  return selectorValues;
};

const buildAmazonSelectorPayload = ({ scenarioMessages, selectorBindings, cartSystem, domain }) => {
  const bindings = (selectorBindings && selectorBindings.length)
    ? selectorBindings
    : extractSelectorBindingsFromMessages(scenarioMessages);
  const selectorValues = collectSelectorValuesFromBindings(bindings);
  return {
    meta: { cartSystem, domain, configVersion: 1, source: 'sdk-v2' },
    selectorValues,
  };
};

const normalizeEcchAmazonSelectorValues = (selectorValues) => {
  const normalized = [];
  (selectorValues || []).forEach((item) => {
    const { selectorKeyType, sourceSelector, valuePath, value } = item || {};
    if (!selectorKeyType || !sourceSelector || !valuePath) {
      console.warn('[ecchAmazon] skip item missing selectorKeyType/sourceSelector/valuePath:', item);
      return;
    }
    normalized.push({ selectorKeyType, sourceSelector, valuePath, value });
  });
  return normalized;
};

const safeGetAmazonPayload = async () => {
  if (typeof window.ecchAmazon !== 'function') return null;
  try {
    const payload = await window.ecchAmazon();
    if (!payload || !Array.isArray(payload.selectorValues)) return null;
    const selectorValues = normalizeEcchAmazonSelectorValues(payload.selectorValues);
    if (!selectorValues.length) return null;
    return { ...payload, selectorValues };
  } catch (err) {
    console.warn('[ecchAmazon] invalid contract:', err);
    return null;
  }
};

const sendAmazonPayDataBySelector = (payload) => {
  if (!payload?.selectorValues?.length) return;
  sendMessageToChatbot(payload, CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_BY_SELECTOR);
};

const waitToLoadAmazonGeneric = (iframe, amazonConfig) => {
  const config = { ...DEFAULT_AMAZON_PAY_CONFIG, ...(amazonConfig?.amazon_pay_config || {}) };
  const detection = config.amazon_detection || DEFAULT_AMAZON_DETECTION;
  const cartSystem = amazonConfig?.cart_system;
  const selectorBindings = amazonConfig?.selector_bindings || [];
  const targetMessages = amazonConfig?.target_messages || amazonConfig?.messages || [];
  let count = 0;
  let sent = false;
  let amazonPayFlagSet = false;

  const interval = setInterval(async () => {
    count++;
    if (!amazonPayFlagSet && isAmazonPayActive(detection)) {
      iframe.src += '&is_using_amazon_pay=true';
      amazonPayFlagSet = true;
    }
    if (!isAmazonPayReady(detection)) {
      if (count >= config.max_count) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
      return;
    }
    let payload = await safeGetAmazonPayload();
    if (!payload) {
      payload = buildAmazonSelectorPayload({
        selectorBindings,
        scenarioMessages: targetMessages,
        cartSystem,
        domain: window.location.hostname,
      });
    }
    if (payload?.selectorValues?.length) {
      if (!sent) {
        appendIframeToBody(iframe);
        setTimeout(() => sendAmazonPayDataBySelector(payload), 500);
        sent = true;
      }
      clearInterval(interval);
      return;
    }
    if (count >= config.max_count) {
      appendIframeToBody(iframe);
      clearInterval(interval);
    }
  }, config.poll_interval_ms);
};

const hasAmazonPayTargets = (messages) => (
  (messages || []).some((msg) => msg.belong_to === 'user' && msg.is_used_when_amazon_pay)
);

const canRunGenericAmazon = (hostname, scenarioConfig) => (
  isHostnameAllowedForLp(hostname, scenarioConfig?.allowed_lp_domains)
  && hasAmazonPayTargets(scenarioConfig?.messages)
  && extractSelectorBindingsFromMessages(scenarioConfig?.messages).length > 0
);

const resolveLegacyLpMode = (href) => {
  if (isTorizenLP(href)) return 'LEGACY_TORIZEN';
  if (isYuwaeruLP(href)) return 'LEGACY_YUWAERU';
  if (isBlissLp(href) || isPhystechLp(href) || isRoseMayLp(href)) return 'LEGACY_ECFORCE';
  return 'DEFAULT';
};

const resolveLpMode = ({ hostname, scenarioConfig }) => {
  const mode = scenarioConfig?.lp_integration_mode || LP_INTEGRATION_MODES.AUTO;
  const genericReady = canRunGenericAmazon(hostname, scenarioConfig);
  if (mode === LP_INTEGRATION_MODES.GENERIC) {
    return genericReady ? 'GENERIC' : 'DEFAULT';
  }
  if (mode === LP_INTEGRATION_MODES.LEGACY) {
    return resolveLegacyLpMode(window.location.href);
  }
  if (mode === LP_INTEGRATION_MODES.AUTO) {
    if (genericReady) return 'GENERIC';
    return resolveLegacyLpMode(window.location.href);
  }
  return 'DEFAULT';
};

const CUSTOM_JS_CODE_POSITION = {
  HEAD: 'head',
  TOP_BODY: 'top_body',
  BOTTOM_BODY: 'bottom_body',
};

const CONVERSION_PARAMS_STORAGE_KEYS = {
  SCENARIO_ID: 'ecChatbotScenarioId',
  BOT_TYPE: 'ecChatbotBotType',
  USER_INPUT_ID: 'ecChatbotUserInputId',
  ENV: 'ecChatbotEnv',
};

const SEARCH_MODES = {
  ID: 1,
  CSS_SELECTOR: 2,
  XPATH: 3,
};

const CRAWL_ELEMENT_TYPES = {
  SELECT: 'select',
  FROM_JS: 'from_js'
};

const ELEMENT_TAGS = {
  SELECT: "SELECT",
  INPUT: "INPUT",
};

const MESSAGE_CONTENT_TYPES = {
  PULLDOWN: {
    LP_INTEGRATION_OPTION: 'lp_integration_option',
    FROM_JS: 'from_js_result',
    CUSTOMIZATION: 'customization',
    TIME_HM: 'time_hm',
    DATE_YMD: 'date_ymd',
    DATE_MD: 'date_md',
    DATE_YM: 'date_ym',
    DATE_YMD_HM: 'date_ymd_hm',
    DOB_YMD: 'dob_ymd',
    DOB_YM: 'dob_ym',
    TIMEZONE_FROM_TO: 'timezone_from_to',
    PERIOD_FROM_TO: 'period_from_to',
    PREFECTURES: 'prefectures',
    UP_TO_MUNICIPALITY: 'up_to_municipality',
    CONSUME_API_RESPONSE: 'comsume_api_response',
  },
};

function ecRunEcForceSessionLandingLogout() {
  try {
    if (typeof document === 'undefined') return;

    var name = '_ec_force_session';

    if ((document.cookie || '').includes(name + '=')) {
      document.cookie = name + '=; Max-Age=0; path=/';
    }
  } catch (e) {}
}

const botId = sessionStorage.getItem("bot_id");
const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
let chatbotBottom = sessionStorage.getItem("chatbotBottom");
let chatbotH = sessionStorage.getItem("chatbotH");
let chatbotRight = sessionStorage.getItem("chatbotRight");
let chatbotW = sessionStorage.getItem("chatbotW");
let scenarioId = "";

if (typeof window.jQuery === 'undefined') {
  let head = document.getElementsByTagName("head")[0];
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
  head.appendChild(script);
}

const getEnvFromScriptSrc  = () => {
  try {
    if (window.getSdkEnv) return window.sdkEnv;
  
    window.getSdkEnv = true;
  
    const SRC_PARSER = {
      "ec-chatbot1.com": "staging",
      "ec-chatbot.com": "production",
      "localhost:3001": "local",
    }
  
    const src = document.currentScript?.src || "";
  
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
}

const getEnvironment = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.env || getEnvFromScriptSrc() || "production";
}

const getDebugFlag = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.debug || true;
}

const getParam = (paramName) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params[paramName];
}

const log = (message) =>{
  let debugFlag = getDebugFlag();

  if (debugFlag) {
    console.log(message);
  }
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const WAIT_OPTION_TYPES = {
  WAIT_FOR_LOADING: "WAIT_FOR_LOADING",
  WAIT_FOR_SETTING_VALUE: "WAIT_FOR_SETTING_VALUE",
};

const waitForElement = (mode, address, options = {type: "WAIT_FOR_LOADING"}, callback = () => {}) => {
  let count = 0;
  const poops = setInterval(function(){
    count ++;
    log(`Waiting for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(options)}: ${count} times`);
    if (count > 50) {
      clearInterval(poops);
      console.log(`Timeout for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(options)}`);
      return;
    }

    const element = getElementByAddress(mode, address);
    if (!element) return;
    switch (options.type) {
      case WAIT_OPTION_TYPES.WAIT_FOR_LOADING:
        clearInterval(poops);
        callback();
        break;
      case WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE:
        const yearsValue = `20${options.value}`;
        const isNullOption = options.value === 'NULL_OPTION';

        const altBinding = options.disableRemoveLeadingZero
          ? options.value
          : removeLeadingZero(options.value);

        if (isNullOption || (element.value != options.value && element.value != altBinding && element.value != yearsValue)) {
          setValueToElement(element, options.value, options.disableRemoveLeadingZero);
          break;
        }

        clearInterval(poops);
        callback();
        break;
      default:
        throw new Error(`Invalid wait option type ${options.type}`);
    }
  }, 500);
}

const movePaymentMethodToTop = (data) => {
  const index = data.findIndex(item => item.type === "payment_method_id");
  if (index !== -1) {
      const [paymentMethod] = data.splice(index, 1);      
      // await component in LP to set value after payment method setted
      data.unshift({additionalType: "await"}, paymentMethod, { additionalType: "await" });
  }
  return data;
}

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

const getEcChatBotFrontEndBaseUrl = () => {
  // Comment out below line if you want to use the local frontend
  // return "http://localhost:3001";
  const environment = getEnvironment();

  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot1.com";
    case "production":
      return "https://ec-chatbot.com";
    case "local":
      return "http://localhost:3001";
    default:
      return "http://localhost:3001";
  }
}

const setChatbotConversionParamsToLocalStorage = (data) => {
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.SCENARIO_ID, data.scenarioId);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.BOT_TYPE, data.botType);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.USER_INPUT_ID, data.userInputId);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.ENV, data.env);
}

let globalIframe;

const sendMessageToChatbot = (contentMessage, action) => {
  let data = {action: action, actionData: contentMessage};

  globalIframe.contentWindow.postMessage(data, "*");
}

const waitToLoadAmazonSubscstore = (iframe) => {
  // torizen san, subscstore
  const amazonCheckSessionId = getParam('amazonCheckoutSessionId');
  if (amazonCheckSessionId) {
    iframe.src += `&is_using_amazon_pay=true`;
    // only for subscstore cart system, torizen san
    // loop for waiting data is filled to lp form
    let count = 0;
    const interval = setInterval(() => {
      const isTorizenLpAmazonDataFilled = document.querySelector("input#jsUkProfileFamilyName")?.value;
      if (isTorizenLpAmazonDataFilled && count < WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
      count++;
      if (count >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        // Not Amazon Pay
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
    }, 200);
    return;
  }
  appendIframeToBody(iframe);
}

const loadIframeForW2Repeat = (iframe) => {
  const isDisplayCoupon = !!document.querySelector("input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbCouponCode");
  if (isDisplayCoupon) {
    iframe.src += `&is_display_coupon=true`;
  }
  const isDisplayPasswordInput = !!document.querySelector("input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbUserPassword");
  if (isDisplayPasswordInput) {
    iframe.src += `&is_display_password_input=true`;
  }
  const isDisplayCreditCardInput = !!document.querySelector("input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_rPayment_ctl00_tbCreditCardNo1");
  if (!isDisplayCreditCardInput) {
    iframe.src += `&is_display_credit_card_input=false`;
  }
  const isDisplayNameInput = !!document.querySelector("input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName1");
  if (!isDisplayNameInput) {
    iframe.src += `&is_display_display_name_input=false`;
  }
  waitToLoadAmazonW2Repeat(iframe);
}

const waitToLoadAmazonW2Repeat = (iframe) => {
  const injectAmazon = () => {
    iframe.src += `&is_using_amazon_pay=true`;
    // only for w2_repeat cart system, yuwaeru san
    // loop for waiting data is filled to lp form
    let count = 0;
    const interval = setInterval(() => {
      const isYuwaeruLpAmazonDataFilled = document.querySelector("input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName1")?.value;
      if (isYuwaeruLpAmazonDataFilled && count < WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        appendIframeToBody(iframe);
        clearInterval(interval);
        clearInterval(interval);
      }
      count++;

      if (count >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        // Not Amazon Pay
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
    }, 200);
  }

  // Yuwaeru san, w2_repeat
  const amazonCheckSessionId = getParam('amazonCheckoutSessionId');

  if (amazonCheckSessionId) {
    injectAmazon();
    return;
  }

  let try_times = 0;
  const interval = setInterval(() => {
    if (try_times >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
      clearInterval(interval);
      appendIframeToBody(iframe);
      return;
    }
    try_times++;

    // Wait for cancel Amazon Pay button is displayed
    const isUsingAmazonPay = !!document.querySelector("#ctl00_ContentPlaceHolder1_ucInputForm_lbCancelAmazonPay");
    if (isUsingAmazonPay) {
      injectAmazon();
      clearInterval(interval);
      return;
    }
  }, 200);
}

const waitToLoadAmazonEcForce = (iframe) => {
  let count = 0;
  const interval = setInterval(() => {
    const amazonPayMethodElement = document.querySelector("#amazon_payment_method");
    const name1Value = document.querySelector("input#order_shipping_address_attributes_name1")?.value;

    if (amazonPayMethodElement && name1Value && count < WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
      iframe.src += `&is_using_amazon_pay=true`;
      const isEnableEmailInput = !document.querySelector("input#email")?.disabled;
      if (isEnableEmailInput) {
        iframe.src += `&is_enable_email_input=true`;
      }
      const isDisplayPasswordInput = !!document.querySelector("input#password");
      if (isDisplayPasswordInput) {
        iframe.src += `&is_display_password_input=true`;
      }
      appendIframeToBody(iframe);
      clearInterval(interval);
    }
    count++;

    if (count >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
      // Not Amazon Pay
      appendIframeToBody(iframe);
      clearInterval(interval);
    }
  }, 100);
}

const isBlissLp = (url) => {
  const domains = [
    // Comment out if you want to test bliss in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "skull-shaver.jp",
  ];

  return domains.some(domain => url.includes(domain));
}

const isRoseMayLp = (url) => {
  const domains = [
    // TODO: Update RoseMay domains nếu cần test ở môi trường khác
    "rosemay.net",
    "rosemay.jp",
  ];

  return domains.some(domain => url.includes(domain));
}

const isPhystechLp = (url) => {
  const domains = [
    // Comment out if you want to test phystech in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "livseed.jp",
  ];

  return domains.some(domain => url.includes(domain));
}

const isTorizenLP = (url) => {
  const torizenDomains = [
    // Comment out if you want to test torizen in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "hana.inuneko-sukoyaka.jp",
    "sb.inuneko-sukoyaka.jp"
  ];

  return torizenDomains.some(domain => url.includes(domain));
}

const isYuwaeruLP = (url) => {
  const domains = [
    // Comment out if you want to test yuwaeru in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "store.nekase-genmai.com",
  ];

  return domains.some(domain => url.includes(domain));
}

const displayPopup = async () => {
  const device =
    !tabletCheck() && !mobileCheck()
      ? "pc"
      : tabletCheck()
        ? "tablet"
        : "smartphone";
  const response = await fetch(
    `${getEcChatBotApiServerBaseUrl()}/api/v1/managements/chatbots/${botId}/get_scenario_selected`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  if (data.data && data.data.is_clear_landing_page_session) {
    ecRunEcForceSessionLandingLogout();
  }
  scenarioId = data.data.id;

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

  let iframe = document.createElement("iframe");

  if (mobileCheck()) {
    iframe.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.right = "0";
  } else {
    iframe.width =
      chatbotW && chatbotRight
        ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px`
        : "360px";
    iframe.style.right = "10px";
  }

  iframe.id = "previewSdk";
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.height =
    chatbotH && chatbotBottom
      ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px`
      : "0px";

  iframe.style.border = "none";
  iframe.style.padding = "0";
  iframe.style.margin = "0";
  iframe.style.borderRadius = "0px";
  // iframe.style.display = "none";
  iframe.style.zIndex = "999999";
  iframe.style.width = `${iframe.width} !important`;
  iframe.style.height = `${iframe.height} !important`;
  iframe.src = `${getEcChatBotFrontEndBaseUrl()}/preview-customer-fukushashiki?bot_id=${botId}&scenario_id=${scenarioId}&urlReceive=${window.location.origin
    }&deviceReceive=${device}&uuid=${uuid}&env=${getEnvironment()}&debug=${getDebugFlag()}&cartSystem=${data.cart_system}&isLoggedIn=${window.logged_in}`;

  // only for amazon
  // add param amazonCheckoutSessionId to iframe src

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
    "message",
    async (e) => {
      if (typeof e.data !== 'object') return;
      if (e.data.source !== 'ec-chatbot') return;
      if (e.data.widthPc) chatbotW = e.data.widthPc;
      if (e.data.heightPc) chatbotH = e.data.heightPc;
      if (e.data.chatbotRight) chatbotRight = e.data.chatbotRight;
      if (e.data.chatbotBottom) chatbotBottom = e.data.chatbotBottom;

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
          (function() {
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
        case CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT:
          const { isNewProcess = false } = e.data;

          if (!isNewProcess) {
            await sleep(2000);
          }
          excuteJSCode(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE:
          setChatbotConversionParamsToLocalStorage(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.INJECT_CUSTOM_JS:
          injectCustomJS(e.data.actionData);
          break;
      };

      if (e.data.isOpen === undefined) return;

      if (e.data.isOpen && mobileCheck()) {
        iframe.width = "100%";
        // iframe.height = "620px";
        iframe.height = "100%";
        iframe.style.setProperty("width", "100%", "important");
        iframe.style.setProperty("height", "100%", "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (e.data.isOpen) {
        let w = chatbotW && (chatbotRight !== null) ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px` : "460px";
        let h = chatbotH && (chatbotBottom !== null) ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px` : "700px";
        iframe.width = w;
        iframe.height = h;
        iframe.style.setProperty("width", w, "important");
        iframe.style.setProperty("height", h, "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen && mobileCheck()) {
        const useMoblieFullwidth = (typeof e.data.useMoblieFullwidth === 'boolean')
          ? e.data.useMoblieFullwidth
          : (sessionStorage.getItem("useFullwidthChatbotMobile") === "true");
        let w = useMoblieFullwidth ? "100%" : "250px";
        let h = useMoblieFullwidth ? "85px" : "58px";
        iframe.width = w;
        iframe.height = h;
        iframe.style.setProperty("width", w, "important");
        iframe.style.setProperty("height", h, "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen) {
        let w = chatbotRight ? `${parseInt(chatbotRight) + 400}px` : "400px";
        let h = chatbotBottom ? `${parseInt(chatbotBottom) + 85}px` : "85px";
        iframe.width = w;
        iframe.height = h;
        iframe.style.setProperty("width", w, "important");
        iframe.style.setProperty("height", h, "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      }
      iframe.style.width = `${iframe.width} !important`;
      iframe.style.height = `${iframe.height} !important`;
      if (e.data.isOpen && mobileCheck() && !e.data.isUpsell) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'scroll';
      }
      globalIframe = iframe;
    },
    false
  );

  log("device: ", device);
  setTimeout(() => {
    const checkDevice = { scenario_data: device };
    getUser(`${getEcChatBotApiServerBaseUrl()}/api/v1/analytics/scenario_counts/${scenarioId}`, checkDevice)
  }, 5000);
}

const crawl = async (options) => {
  const targetElement = getElementByAddress(options.searchMode, options.searchAddress);
  if (!targetElement) {
    throw new Error('Element not found');
  };

  switch (options.targetElementType) {
    case CRAWL_ELEMENT_TYPES.SELECT:
      return extractSelectOptions(targetElement, options);
    case CRAWL_ELEMENT_TYPES.FROM_JS:
      return transformJsResultArray({
        data: await extractFromJs(options),
        fields: ['id', 'value', 'text'],
      });
    default:
      throw new Error(`Not support target element type ${options.targetElementType}`);
  }
}

const crawlDataAndSendMessage = async (options) => {
  if (!options.searchAddress || !options.searchMode) return;

  const message = {
    ...options,
    result: await crawl(options),
  };
  
  sendMessageToChatbot(message, CHATBOT_ACTIONS.CRAWL_DATA);
}

const excuteJSCode = (jscode) => {
  if (!jscode) return;
  const func = new Function(jscode);
  func();
}

const extractSelectOptions = (selectElement, options = {}) => {
  if (!selectElement || selectElement.tagName !== "SELECT") return null;

  const result = Array.from(selectElement.options)
    .map((option, index) => ({
      id: index + 1,
      text: option.innerText || '指定なし',
      value: option.value || 'NULL_OPTION'
    }));

  if (options.dontDisplayEmptyOption) {
    return result.filter(option => option.value !== 'NULL_OPTION');
  }

  return result;
}

const extractFromJs = async (options) => {
  const { searchJsCode: jsCode } = options;
  if (!jsCode) return;

  try {
    const func = new Function(jsCode);
    const result = await func();

    return result;
  } catch (error) {
    try {
      if (window.Sentry) {
        var ev = window.Sentry.captureException(error);
        console.log('Sentry.captureException eventId:', ev);
      }
    } catch (e) {
      console.warn('Failed sending EXTRACT_FROM_JS error to Sentry', e);
    }
    console.error("[EXTRACT_FROM_JS]", error);

    return null;
  }
};

const transformJsResultArray = ({ data, fields, skipOnError = true }) => {
  if (!Array.isArray(fields) || !Array.isArray(data)) return [];

  const result = data.filter(item => {
    const isValid = fields.every(field => item[field]);
    return isValid || !skipOnError;
  });

  return skipOnError ? result : result.length === data.length ? result : [];
};

const processGetErrorMessage = (data) => {
  if (!data.isDisplay) return;

  const element = getElementByAddress(data.searchMode, data.searchValue);

  if (!element) {
    console.log(`Element ${data.searchValue} not found`);
    return;
  }
  sendMessageToChatbot(element.innerHTML, CHATBOT_ACTIONS.GET_ERROR_MESSAGE);
}

const isDisabledElement = (element) => {
  // For check GINZA AIRA
  if (element.classList.contains('disabled-input-ec')) return true;

  // For check torizen san with amazon pay
  if (getParam('amazonCheckoutSessionId') && element.getAttribute('disabled')) return true;

  // For other customer
  return element.disabled;
}

const fillDataFromMessage = async (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    if (item.additionalType === "await") {
      await sleep(1500);
      continue;
    }

    try {
      let element = getElementByAddress(item.bindingMode, item.bindingAddress);

      // --- element not found ---
      if (!element) {
        const err = new Error(`Element not found for binding`);
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            level: 'warning',
            tags: { bindingMode: item.bindingMode, type: item.type },
            extra: { item },
          });
        }
        console.warn('Element not found:', item.bindingAddress);
        continue;
      }

      // --- Element are disabled ---
      if (isDisabledElement(element)) {
        const err = new Error(`Element is disabled: ${item.bindingAddress}`);
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            level: 'info',
            tags: { bindingMode: item.bindingMode, type: item.type },
            extra: { item },
          });
        }
        console.warn('Disabled element:', item.bindingAddress);
        continue;
      }

    switch (item.type) {
      case "zip_code_address":
      case "card_number":
      case "card_payment_radio_button":
      case "credit_card_payment":
      case "text_input":
      case "textarea":
      case "slider": {
        const waitOpts = {
          type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE,
          value: item.bindingValue,
        };
        if (item.disableRemoveLeadingZero) {
          waitOpts.disableRemoveLeadingZero = true;
        }
        waitForElement(item.bindingMode, item.bindingAddress, waitOpts);
        break;
      }

      case "payment_method_id": {
        setValuePaymentMethodToElement(element, item.bindingValue);
        break;
      }

      case 'dropdown_prefecture': {
        if (element.tagName === ELEMENT_TAGS.SELECT) {
          const acceptableValues = [item.bindingValue.toString(), removeLeadingZero(item.bindingValue).toString()];
          const selectedOption = Array.from(element.options).find(option => acceptableValues.includes(option.value.toString()));
          if (!selectedOption) item.bindingValue = '';
        };
        waitForElement(
          item.bindingMode, item.bindingAddress,
          {type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue});
        break;
      }

      case "agree_term":
      case 'checkbox': {
        setCheckToCheckboxElement(element, item.bindingValue);
        break;
      }

      case 'pull_down': {
        if (item.pulldownType === 'lp_integration_option') {
          const isNullOption = item.bindingValue === 'NULL_OPTION';
          if (isNullOption) item.bindingValue = '';

          const hasOption = Array.from(element.options).some(option => option.value === item.bindingValue);
          if (!hasOption) item.bindingValue = '';
        }
        
        waitForElement(
          item.bindingMode, item.bindingAddress,
          {type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue});
        break;
      }

      case "radio_button": {
        if (element.tagName === ELEMENT_TAGS.SELECT) {
          setValueToElement(element, item.bindingValue, item.disableRemoveLeadingZero);
          break;
        }

        setRadioValue(element, item.bindingValue);
        break;
      }

      case "password": {
        element.setRangeText(item.bindingValue, 0, element.value.length);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
      default:
        break;
    }
  } catch (err) {
      // catch all unexpected errors in the loop
      console.error('Error processing item in fillDataFromMessage:', err);
      if (window.Sentry) {
        window.Sentry.captureException(err, {
          level: 'error',
          extra: { item },
        });
      }
    }
  }
}

const getElementByAddress = (mode, address) => {
  if (!mode || !address) return null;
  switch (mode) {
    case SEARCH_MODES.ID:
      return document.getElementById(address);
    case SEARCH_MODES.CSS_SELECTOR:
      return document.querySelector(address);
    case SEARCH_MODES.XPATH:
      return document.evaluate(address, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    default:
      throw new Error(`Invalid search mode ${mode}, address: ${address}`);
  }
}

const removeLeadingZero = (value) => {
  let strValue = value?.toString() || "";
  let result = strValue.replace(/^0+/, '');
  return typeof value === 'number' ? Number(result) : result;
}

const removeFirstTwoChars = (input) => {
  const str = input?.toString() || "";
  if (str.length > 2) {
    return str.slice(2);
  } else {
    return '';
  }
}

const setCheckToCheckboxElement = (element, value) => {
  if (!element.type === 'checkbox') return;
  const currentValue = element.checked;
  if (currentValue === value) return;

  element.checked = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

const setValueToElement = (element, value, disableRemoveLeadingZero = false) => {
  let newElementValue = value;

  if (element.tagName === ELEMENT_TAGS.SELECT) {
    const acceptableValues = disableRemoveLeadingZero
      ? [value.toString(), `20${value}`]
      : [value.toString(), removeLeadingZero(value).toString(), `20${value}`];
    newElementValue = acceptableValues.find(v => {
      return Array.from(element.options).some(option => option.value === v);
    });

    if (!newElementValue && newElementValue !== '') {
      console.error(`Option not found: ${value}, element: ${element.id}`);
    }
  }

  element.value = newElementValue;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

const setValuePaymentMethodToElement = (element, value) => {
  const radioButtons = [...element.querySelectorAll('input[type="radio"]')];
  
  if (radioButtons.length > 0) {
    setRadioValue(element, value);
  } else {
    setValueToElement(element, value);
  }
};

const setRadioValue = (element, value) => {
  const radioButtons = [...element.querySelectorAll('input[type="radio"]')];
  const selectedRadio = radioButtons.find(radio => radio.value === value);
  if (!selectedRadio) return;
  selectedRadio.checked = true;
  selectedRadio.dispatchEvent(new Event('input', { bubbles: true }));
  selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
  selectedRadio.click();
};

const getUser = async (url, datacount) => {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datacount),
  });
  const data = await response.json();
  log(data);
};

const tabletCheck = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent
    );
  log("isTablet: " + isTablet);
  return isTablet;
}

const mobileCheck = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

const injectCustomJS = (injectCustomJsCodes) => {
  for(const { jsCode, position } of injectCustomJsCodes)
  {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = jsCode;

    switch (position) {
      case CUSTOM_JS_CODE_POSITION.HEAD:
        document.head.appendChild(script);
        break;
      case CUSTOM_JS_CODE_POSITION.TOP_BODY:
        document.body.insertBefore(script, document.body.firstChild);
        break;
      case CUSTOM_JS_CODE_POSITION.BOTTOM_BODY:
        document.body.appendChild(script);
        break;
      default:
        console.error("Invalid position: " + position);
    }
  }
}

const appendIframeToBody = (iframe) => {
  globalIframe = iframe;
  document.body.appendChild(iframe);
}

displayPopup();