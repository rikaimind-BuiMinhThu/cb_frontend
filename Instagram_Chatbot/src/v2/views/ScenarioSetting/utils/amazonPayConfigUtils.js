import {
  AMAZON_PAY_DETECTION_MODES,
  AMAZON_PAY_DISPLAY_MODES,
  AMAZON_PAY_READY_MODES,
  AMAZON_PAY_URL_FLAG,
  DEFAULT_AMAZON_DETECTION,
  DEFAULT_AMAZON_PAY_CONFIG,
  FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX,
  normalizeAmazonPayConfig,
} from 'v2/variables/amazonPayConstants';

const isManagedAmazonPayDisplayCondition = (condition) => (
  condition?.nameCondition === 'current_url'
  && condition?.inputCondition === AMAZON_PAY_URL_FLAG
  && (condition?.condition === 'include' || condition?.condition === 'not_include')
);

export const getAmazonPayDisplayModeFromConditions = (conditions = []) => {
  const amazonCondition = conditions.find(isManagedAmazonPayDisplayCondition);
  if (!amazonCondition) return AMAZON_PAY_DISPLAY_MODES.ALWAYS;
  return amazonCondition.condition === 'include'
    ? AMAZON_PAY_DISPLAY_MODES.DISPLAY_WHEN
    : AMAZON_PAY_DISPLAY_MODES.UNDISPLAY_WHEN;
};

export const hasActiveSpecialDisplayConditions = (message, isUseFukushashiki = false) => {
  if (!message) return false;
  if (message.not_display_when_logged_in || message.not_display_when_have_error) return true;
  if (!isUseFukushashiki) return false;
  return getAmazonPayDisplayModeFromConditions(message.conditions) !== AMAZON_PAY_DISPLAY_MODES.ALWAYS;
};

export const applyAmazonPayDisplayModeToConditions = (conditions = [], mode) => {
  const filtered = conditions.filter((condition) => !isManagedAmazonPayDisplayCondition(condition));

  if (mode === AMAZON_PAY_DISPLAY_MODES.DISPLAY_WHEN) {
    filtered.push({
      linkCondition: 'and',
      condition: 'include',
      nameCondition: 'current_url',
      inputCondition: AMAZON_PAY_URL_FLAG,
    });
  } else if (mode === AMAZON_PAY_DISPLAY_MODES.UNDISPLAY_WHEN) {
    filtered.push({
      linkCondition: 'and',
      condition: 'not_include',
      nameCondition: 'current_url',
      inputCondition: AMAZON_PAY_URL_FLAG,
    });
  }

  return filtered;
};

export const normalizeLpDomain = (input) => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim().toLowerCase();
  const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
  const hostOnly = withoutProtocol.split('/')[0].split('?')[0].split('#')[0];
  return hostOnly.replace(/^www\./, '');
};

export const normalizeAllowedLpDomains = (domains) => {
  const list = Array.isArray(domains)
    ? domains
    : String(domains || '').split(/[\n,]+/);

  return [...new Set(list.map(normalizeLpDomain).filter(Boolean))];
};

export const validateLpDomain = (input) => {
  const domain = normalizeLpDomain(input);
  if (!domain) return { valid: false, message: 'ドメインを入力してください。' };
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
    return { valid: false, message: `無効なドメイン形式です: ${input}` };
  }
  return { valid: true, domain };
};

export const inferAmazonPayDetectionMode = (detection = DEFAULT_AMAZON_DETECTION) => {
  const strategies = detection?.strategies || [];
  if (strategies.some((strategy) => strategy.type === 'custom_js')) {
    return AMAZON_PAY_DETECTION_MODES.JS;
  }
  if (strategies.some((strategy) => strategy.type === 'url_param')) {
    return AMAZON_PAY_DETECTION_MODES.URL_PARAM;
  }
  if (strategies.some((strategy) => strategy.type === 'dom_selector')) {
    return AMAZON_PAY_DETECTION_MODES.DOM_SELECTOR;
  }
  return AMAZON_PAY_DETECTION_MODES.JS;
};

export const inferAmazonPayReadyMode = (detection = DEFAULT_AMAZON_DETECTION) => {
  const readyWhen = detection?.ready_when || [];
  if (readyWhen.length > 0) return AMAZON_PAY_READY_MODES.DOM_SELECTOR;
  return AMAZON_PAY_READY_MODES.NONE;
};

export const amazonDetectionToForm = (detection = DEFAULT_AMAZON_DETECTION) => {
  const urlParams = (detection.strategies || [])
    .filter((strategy) => strategy.type === 'url_param')
    .map((strategy) => strategy.param)
    .filter(Boolean);

  const domSelectors = (detection.strategies || [])
    .filter((strategy) => strategy.type === 'dom_selector')
    .map((strategy) => strategy.selector)
    .filter(Boolean);

  const jsCode = (detection.strategies || [])
    .filter((strategy) => strategy.type === 'custom_js')
    .map((strategy) => strategy.code)
    .filter(Boolean)
    .join('\n');

  const readySelectors = (detection.ready_when || [])
    .filter((condition) => condition.type === 'dom_value')
    .map((condition) => condition.selector)
    .filter(Boolean);

  return {
    match: detection.match || 'any',
    jsCode,
    urlParamsText: urlParams.join('\n'),
    domSelectorsText: domSelectors.join('\n'),
    readySelectorsText: readySelectors.join('\n'),
  };
};

export const amazonDetectionFromForm = ({
  detectionMode,
  jsCode,
  urlParamsText,
  domSelectorsText,
  readyMode,
  readySelectorsText,
}) => {
  const strategies = [];

  if (detectionMode === AMAZON_PAY_DETECTION_MODES.JS) {
    const code = (jsCode || '').trim();
    if (code) strategies.push({ type: 'custom_js', code });
  } else if (detectionMode === AMAZON_PAY_DETECTION_MODES.URL_PARAM) {
    (urlParamsText || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean).forEach((param) => {
      strategies.push({ type: 'url_param', param });
    });
  } else if (detectionMode === AMAZON_PAY_DETECTION_MODES.DOM_SELECTOR) {
    (domSelectorsText || '').split('\n').map((item) => item.trim()).filter(Boolean).forEach((selector) => {
      strategies.push({ type: 'dom_selector', selector });
    });
  }

  const ready_when = readyMode === AMAZON_PAY_READY_MODES.DOM_SELECTOR
    ? (readySelectorsText || '').split('\n').map((item) => item.trim()).filter(Boolean).map((selector) => ({
      type: 'dom_value',
      selector,
    }))
    : [];

  return {
    match: 'any',
    strategies: strategies.length ? strategies : DEFAULT_AMAZON_DETECTION.strategies,
    ready_when,
  };
};

export const buildAmazonPayConfigWithDetection = ({
  amazonPayConfig,
  detectionMode,
  jsCode,
  urlParamsText,
  domSelectorsText,
  readyMode,
  readySelectorsText,
}) => normalizeAmazonPayConfig({
  ...amazonPayConfig,
  amazon_detection: amazonDetectionFromForm({
    detectionMode,
    jsCode,
    urlParamsText,
    domSelectorsText,
    readyMode,
    readySelectorsText,
  }),
});

export const AMAZON_PAY_INCOMPLETE_DETECTION_ERROR = 'Amazon Pay連携設定の判定方法を入力してください。';

export const validateAmazonPayConfig = ({
  detectionMode,
  jsCode,
  urlParamsText,
  domSelectorsText,
  readyMode,
  readySelectorsText,
}, isUseAmazonPay) => {
  if (!isUseAmazonPay) return { valid: true };

  if (detectionMode === AMAZON_PAY_DETECTION_MODES.JS && !(jsCode || '').trim()) {
    return { valid: false, message: AMAZON_PAY_INCOMPLETE_DETECTION_ERROR };
  }
  if (detectionMode === AMAZON_PAY_DETECTION_MODES.URL_PARAM && !(urlParamsText || '').trim()) {
    return { valid: false, message: AMAZON_PAY_INCOMPLETE_DETECTION_ERROR };
  }
  if (detectionMode === AMAZON_PAY_DETECTION_MODES.DOM_SELECTOR && !(domSelectorsText || '').trim()) {
    return { valid: false, message: AMAZON_PAY_INCOMPLETE_DETECTION_ERROR };
  }
  if (readyMode === AMAZON_PAY_READY_MODES.DOM_SELECTOR && !(readySelectorsText || '').trim()) {
    return { valid: false, message: 'オートフィル完了の判定用DOMセレクターを入力してください。' };
  }

  return { valid: true };
};

export const buildAmazonPayConfigForSave = ({ poll_interval_ms, max_count, detectionForm }) => ({
  poll_interval_ms,
  max_count,
  amazon_detection: amazonDetectionFromForm(detectionForm),
});

export const hasValidAmazonPaySelectors = (message) => {
  if (!message?.message_content?.length) return false;

  return message.message_content.some((content) => (
    Object.keys(content || {}).some((key) => {
      const isSelectorKey = key.endsWith(FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX)
        || key === 'fukushashiki_search_value';
      return isSelectorKey && String(content[key] || '').trim() !== '';
    })
  ));
};

export const parseAmazonPayConfigFromApi = (rawConfig) => normalizeAmazonPayConfig(rawConfig || DEFAULT_AMAZON_PAY_CONFIG);

export { buildAmazonPayButtonClickActionData } from 'v2/utils/amazonPayButtonUtils';
