import { getParam } from '../config/environment.js';
import {
  AMAZON_MATCH_MODES,
  AMAZON_READY_CONDITION_TYPES,
  AMAZON_STRATEGY_TYPES,
  LP_RESOLVE_MODES,
} from '../constants.js';
import {
  extractSelectorBindingsFromMessages,
  hasAmazonPayTargets,
  isHostnameAllowedForLp,
} from './bindings.js';

const CUSTOM_JS_SENTRY_FAILED = 'Failed sending Amazon Pay custom_js error to Sentry';
const CUSTOM_JS_EVAL_FAILED = '[AmazonPay] custom_js evaluation failed:';

const evaluateCustomJsCode = (code) => {
  // Merchant LP custom_js is stored as source text and must run in the page.
  // eslint-disable-next-line no-new-func -- intentional LP custom JS evaluation
  const evaluate = new Function(code);
  return evaluate();
};

export const evaluateAmazonStrategy = (strategy) => {
  if (!strategy?.type) return false;

  switch (strategy.type) {
    case AMAZON_STRATEGY_TYPES.URL_PARAM: {
      const param = strategy.param;
      if (!param) return false;
      const value = getParam(param);
      return value != null && String(value).trim() !== '';
    }
    case AMAZON_STRATEGY_TYPES.DOM_SELECTOR: {
      const selector = strategy.selector;
      if (!selector) return false;
      return !!document.querySelector(selector);
    }
    case AMAZON_STRATEGY_TYPES.CUSTOM_JS: {
      const code = strategy.code;
      if (!code) return false;
      try {
        return !!evaluateCustomJsCode(code);
      } catch (error) {
        try {
          if (window.Sentry) {
            window.Sentry.captureException(error);
          }
        } catch (sentryError) {
          console.warn(CUSTOM_JS_SENTRY_FAILED, sentryError);
        }
        console.error(CUSTOM_JS_EVAL_FAILED, error);
        return false;
      }
    }
    default:
      return false;
  }
};

export const evaluateAmazonReadyCondition = (condition) => {
  if (condition?.type !== AMAZON_READY_CONDITION_TYPES.DOM_VALUE) return false;
  const selector = condition.selector;
  if (!selector) return false;
  const el = document.querySelector(selector);
  if (!el) return false;
  return String(el.value || '').trim() !== '';
};

export const isAmazonPayActive = (detection) => {
  const strategies = detection?.strategies || [];
  if (!strategies.length) return false;
  const match = detection?.match || AMAZON_MATCH_MODES.ANY;
  if (match === AMAZON_MATCH_MODES.ALL) {
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

export const resolveLpMode = ({ hostname, scenarioConfig }) => {
  const allowedDomains = scenarioConfig?.allowed_lp_domains || [];
  if (!allowedDomains.length) return LP_RESOLVE_MODES.DEFAULT;
  if (!isHostnameAllowedForLp(hostname, allowedDomains)) return LP_RESOLVE_MODES.DEFAULT;
  if (canRunGenericAmazon(hostname, scenarioConfig)) return LP_RESOLVE_MODES.GENERIC;
  return LP_RESOLVE_MODES.DEFAULT;
};
