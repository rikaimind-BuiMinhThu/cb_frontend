import {
  DEFAULT_AMAZON_DETECTION,
  DEFAULT_AMAZON_PAY_CONFIG,
  FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX,
  normalizeAmazonPayConfig,
} from '../../../../../variables/amazonPayConstants';

export const normalizeLpDomain = (input) => {
  if (!input || typeof input !== 'string') return '';
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0].split('?')[0].split('#')[0];
  domain = domain.replace(/^www\./, '');
  return domain;
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

export const amazonDetectionToForm = (detection = DEFAULT_AMAZON_DETECTION) => {
  const urlParams = (detection.strategies || [])
    .filter((strategy) => strategy.type === 'url_param')
    .map((strategy) => strategy.param)
    .filter(Boolean);

  const domSelectors = (detection.strategies || [])
    .filter((strategy) => strategy.type === 'dom_selector')
    .map((strategy) => strategy.selector)
    .filter(Boolean);

  const readySelectors = (detection.ready_when || [])
    .filter((condition) => condition.type === 'dom_value')
    .map((condition) => condition.selector)
    .filter(Boolean);

  return {
    match: detection.match || 'any',
    urlParamsText: urlParams.join('\n'),
    domSelectorsText: domSelectors.join('\n'),
    readySelectorsText: readySelectors.join('\n'),
  };
};

export const amazonDetectionFromForm = ({ match, urlParamsText, domSelectorsText, readySelectorsText }) => {
  const strategies = [];

  (urlParamsText || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean).forEach((param) => {
    strategies.push({ type: 'url_param', param });
  });

  (domSelectorsText || '').split('\n').map((item) => item.trim()).filter(Boolean).forEach((selector) => {
    strategies.push({ type: 'dom_selector', selector });
  });

  const ready_when = (readySelectorsText || '').split('\n').map((item) => item.trim()).filter(Boolean).map((selector) => ({
    type: 'dom_value',
    selector,
  }));

  return {
    match: match || 'any',
    strategies: strategies.length ? strategies : DEFAULT_AMAZON_DETECTION.strategies,
    ready_when,
  };
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

export const buildAmazonPayButtonClickActionData = (config = {}) => {
  const searchValue = (config.button_fukushashiki_search_value || '').trim();
  if (searchValue) {
    return {
      searchMode: config.button_fukushashiki_search_mode,
      searchValue,
    };
  }

  return (config.button_selector || 'amazon_payment_method').replace(/^#/, '');
};
