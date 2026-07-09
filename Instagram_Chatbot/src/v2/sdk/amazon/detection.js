import { getParam } from '../config/environment.js';
import {
  extractSelectorBindingsFromMessages,
  hasAmazonPayTargets,
  isHostnameAllowedForLp,
} from './bindings.js';
import { LP_INTEGRATION_MODES } from '../constants.js';
import {
  isBlissLp,
  isPhystechLp,
  isRoseMayLp,
  isTorizenLP,
  isYuwaeruLP,
} from '../lp/domains.js';

export const evaluateAmazonStrategy = (strategy) => {
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

export const evaluateAmazonReadyCondition = (condition) => {
  if (condition?.type !== 'dom_value') return false;
  const selector = condition.selector;
  if (!selector) return false;
  const el = document.querySelector(selector);
  if (!el) return false;
  return String(el.value || '').trim() !== '';
};

export const isAmazonPayActive = (detection) => {
  const strategies = detection?.strategies || [];
  if (!strategies.length) return false;
  const match = detection?.match || 'any';
  if (match === 'all') {
    return strategies.every((strategy) => evaluateAmazonStrategy(strategy));
  }
  return strategies.some((strategy) => evaluateAmazonStrategy(strategy));
};

export const isAmazonPayReady = (detection) => {
  const readyWhen = detection?.ready_when || [];
  if (!readyWhen.length) return true;
  return readyWhen.every((condition) => evaluateAmazonReadyCondition(condition));
};

export const canRunGenericAmazon = (hostname, scenarioConfig) => (
  isHostnameAllowedForLp(hostname, scenarioConfig?.allowed_lp_domains)
  && hasAmazonPayTargets(scenarioConfig?.messages)
  && extractSelectorBindingsFromMessages(scenarioConfig?.messages).length > 0
);

export const resolveLegacyLpMode = (href) => {
  if (isTorizenLP(href)) return 'LEGACY_TORIZEN';
  if (isYuwaeruLP(href)) return 'LEGACY_YUWAERU';
  if (isBlissLp(href) || isPhystechLp(href) || isRoseMayLp(href)) return 'LEGACY_ECFORCE';
  return 'DEFAULT';
};

export const resolveLpMode = ({ hostname, scenarioConfig }) => {
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
