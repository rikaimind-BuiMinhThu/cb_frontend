import {
  AMAZON_SELECTOR_TO_VALUE_PATH,
  FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX,
} from 'v2/variables/amazonPayConstants';
import {
  appendBindings,
  buildBindingsFromSelectorKey,
} from './FukushashikiBindingMetaUtils';
import { extractBindingsFromContent } from './AmazonPayBindingRegistry';

export const resolveValuePath = (selectorKeyType, content) => {
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

export const extractGenericFallbackBindings = (content) => {
  const bindings = [];

  Object.entries(content || {}).forEach(([selectorKeyType, rawValue]) => {
    if (!selectorKeyType.endsWith(FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX)) return;

    const valuePath = resolveValuePath(selectorKeyType, content);
    if (!valuePath) return;

    bindings.push(...buildBindingsFromSelectorKey({ selectorKeyType, rawValue, valuePath }));
  });

  return bindings;
};

export const extractSelectorBindingsFromMessages = (messages) => {
  const bindings = [];
  const seen = new Set();

  (messages || [])
    .filter((msg) => msg.belong_to === 'user' && msg.is_used_when_amazon_pay)
    .forEach((msg) => {
      (msg.message_content || []).forEach((content, contentIndex) => {
        const meta = { messageId: msg.id, contentIndex };

        appendBindings(
          bindings,
          seen,
          extractBindingsFromContent(content).map((binding) => ({ ...binding, ...meta })),
        );

        appendBindings(
          bindings,
          seen,
          extractGenericFallbackBindings(content).map((binding) => ({ ...binding, ...meta })),
        );
      });
    });

  return bindings;
};

export const collectSelectorValuesFromBindings = ({
  bindings = [],
  documentRef = typeof document !== 'undefined' ? document : null,
}) => {
  const selectorValues = [];

  bindings.forEach(({ selectorKeyType, sourceSelector, valuePath }) => {
    if (!documentRef || !sourceSelector || !valuePath) return;

    const el = documentRef.querySelector(sourceSelector);
    if (!el) return;

    const value = (el.value || '').trim();
    if (!value) return;

    selectorValues.push({ selectorKeyType, sourceSelector, valuePath, value });
  });

  return selectorValues;
};

export const normalizeEcchAmazonSelectorValues = (selectorValues = []) => {
  const normalized = [];

  selectorValues.forEach((item) => {
    const { selectorKeyType, sourceSelector, valuePath, value } = item || {};
    if (!selectorKeyType || !sourceSelector || !valuePath) {
      console.warn('[ecchAmazon] skip item missing selectorKeyType/sourceSelector/valuePath:', item);
      return;
    }

    normalized.push({ selectorKeyType, sourceSelector, valuePath, value });
  });

  return normalized;
};
