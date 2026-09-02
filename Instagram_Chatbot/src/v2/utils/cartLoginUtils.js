import {
  CART_LOGIN_PROCESS_AFTER_CLICK,
  DEFAULT_CART_LOGIN_CONFIG,
  DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG,
  DEFAULT_CART_LOGIN_STYLE,
  getDefaultCartLoginConfig,
} from 'v2/variables/cartLoginConstants';

const SEARCH_MODES = {
  ID: 1,
  CSS_SELECTOR: 2,
  XPATH: 3,
};

const normalizeSelector = (selector, fallback) => {
  if (!selector || typeof selector !== 'object') {
    return { ...fallback };
  }
  return {
    search_mode: selector.search_mode ?? fallback.search_mode,
    search_value: selector.search_value ?? fallback.search_value,
  };
};

export const normalizeCartLoginConfig = (config) => {
  const base = getDefaultCartLoginConfig();
  if (!config || typeof config !== 'object') {
    return base;
  }

  const processConfig = config.process_after_click_config || {};
  const defaultProcessConfig = DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG;

  return {
    text: config.text ?? base.text,
    display_type: config.display_type ?? base.display_type,
    style: {
      ...DEFAULT_CART_LOGIN_STYLE,
      ...(config.style || {}),
    },
    process_after_click: config.process_after_click ?? base.process_after_click,
    process_after_click_config: {
      open_login_trigger: normalizeSelector(
        processConfig.open_login_trigger,
        defaultProcessConfig.open_login_trigger,
      ),
      scroll_target: normalizeSelector(
        processConfig.scroll_target,
        defaultProcessConfig.scroll_target,
      ),
      scroll_behavior: processConfig.scroll_behavior ?? defaultProcessConfig.scroll_behavior,
      scroll_block: processConfig.scroll_block ?? defaultProcessConfig.scroll_block,
      action_delay_ms: processConfig.action_delay_ms ?? defaultProcessConfig.action_delay_ms,
    },
  };
};

export const buildCartLoginStyle = (config) => {
  const normalized = normalizeCartLoginConfig(config);
  const { style } = normalized;
  const borderStyle = style.border_style === 'none'
    ? 'none'
    : `${style.border_width} ${style.border_style} ${style.border_color}`;

  return {
    width: style.width,
    padding: style.padding,
    background: style.background_color,
    color: style.text_color,
    fontSize: style.font_size,
    fontWeight: style.font_weight,
    border: borderStyle,
    borderRadius: style.border_radius,
    textAlign: style.text_align,
    cursor: 'pointer',
    lineHeight: 1.6,
    transition: 'all 0.2s ease',
    display: 'block',
    textDecoration: normalized.display_type === 'link' ? 'underline' : 'none',
    boxSizing: 'border-box',
  };
};

const escapeJsString = (value) => String(value ?? '')
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\n/g, '\\n')
  .replace(/\r/g, '\\r');

const buildFindElementHelperJs = () => `
  function findCartLoginElement(mode, address) {
    if (!mode || !address) return null;
    switch (mode) {
      case ${SEARCH_MODES.ID}:
        return document.getElementById(address);
      case ${SEARCH_MODES.CSS_SELECTOR}:
        return document.querySelector(address);
      case ${SEARCH_MODES.XPATH}:
        return document.evaluate(address, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      default:
        return null;
    }
  }`;

const buildSelectorFindJs = (variableName, selector) => {
  const mode = selector?.search_mode ?? SEARCH_MODES.CSS_SELECTOR;
  const value = escapeJsString(selector?.search_value ?? '');
  return `var ${variableName} = findCartLoginElement(${mode}, '${value}');`;
};

export const buildCartLoginClickJs = (config) => {
  const normalized = normalizeCartLoginConfig(config);
  const { process_after_click: processAfterClick, process_after_click_config: processConfig } = normalized;

  if (processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.NONE) {
    return '';
  }

  if (processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_BOT_ONLY) {
    return '';
  }

  const delay = Number(processConfig.action_delay_ms) || 500;
  const scrollBehavior = escapeJsString(processConfig.scroll_behavior);
  const scrollBlock = escapeJsString(processConfig.scroll_block);

  if (processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_LOGIN) {
    return `(function() {
      ${buildFindElementHelperJs()}
      ${buildSelectorFindJs('scrollTarget', processConfig.scroll_target)}
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ behavior: '${scrollBehavior}', block: '${scrollBlock}' });
      }
    })();`;
  }

  if (processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_CLICK_LOGIN) {
    return `(function() {
      ${buildFindElementHelperJs()}
      ${buildSelectorFindJs('scrollTarget', processConfig.scroll_target)}
      ${buildSelectorFindJs('loginTrigger', processConfig.open_login_trigger)}
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ behavior: '${scrollBehavior}', block: '${scrollBlock}' });
      }
      setTimeout(function() {
        if (loginTrigger) loginTrigger.click();
      }, ${delay});
    })();`;
  }

  return '';
};

export const getCartLoginHoverBackgroundColor = (config) => normalizeCartLoginConfig(config).style.hover_background_color
  || DEFAULT_CART_LOGIN_CONFIG.style.hover_background_color;

export const shouldCloseBotAfterCartLoginClick = (config) => {
  const processAfterClick = normalizeCartLoginConfig(config).process_after_click;
  return processAfterClick !== CART_LOGIN_PROCESS_AFTER_CLICK.NONE;
};

export const getCartLoginCloseDelayMs = (config) => {
  const normalized = normalizeCartLoginConfig(config);
  if (normalized.process_after_click === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_BOT_ONLY) {
    return 0;
  }
  return Number(normalized.process_after_click_config.action_delay_ms) || 500;
};
