import {
  AMAZON_SELECTOR_TO_VALUE_PATH,
  FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX,
} from '../constants.js';

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

const splitSourceSelectors = (rawValue) => {
  if (typeof rawValue !== 'string') return [];
  return rawValue.split(',').map((selector) => selector.trim()).filter(Boolean);
};

export const buildBindingsFromSelectorKey = ({ selectorKeyType, rawValue, valuePath }) => {
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

const extractPullDownBindings = (content) => {
  const pullDownType = content.pull_down?.type;
  if (!pullDownType) return [];
  return buildBindingsFromSelectorKey({
    selectorKeyType: 'fukushashiki_search_value',
    rawValue: content.fukushashiki_search_value,
    valuePath: `pull_down.${pullDownType}.value`,
  });
};

const extractProductPurchaseSelectOptionBindings = (content) => buildBindingsFromSelectorKey({
  selectorKeyType: 'fukushashiki_search_value',
  rawValue: content.fukushashiki_search_value,
  valuePath: 'product_purchase_select_option.value',
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
    case 'pull_down': return extractPullDownBindings(content);
    case 'product_purchase_select_option': return extractProductPurchaseSelectOptionBindings(content);
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

export const extractSelectorBindingsFromMessages = (messages) => {
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

export const collectSelectorValuesFromBindings = (bindings) => {
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

export const buildAmazonSelectorPayload = ({ scenarioMessages, selectorBindings, cartSystem, domain }) => {
  const bindings = (selectorBindings && selectorBindings.length)
    ? selectorBindings
    : extractSelectorBindingsFromMessages(scenarioMessages);
  const selectorValues = collectSelectorValuesFromBindings(bindings);
  return {
    meta: { cartSystem, domain, configVersion: 1, source: 'sdk-v2' },
    selectorValues,
  };
};

export const normalizeEcchAmazonSelectorValues = (selectorValues) => {
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

export const safeGetAmazonPayload = async () => {
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

export const hasAmazonPayTargets = (messages) => (
  (messages || []).some((msg) => msg.belong_to === 'user' && msg.is_used_when_amazon_pay)
);

export const normalizeLpDomain = (input) => {
  if (!input || typeof input !== 'string') return '';
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0].split('?')[0].split('#')[0];
  domain = domain.replace(/^www\./, '');
  return domain;
};

export const isHostnameAllowedForLp = (hostname, allowedDomains) => {
  const host = normalizeLpDomain(hostname);
  if (!host) return false;
  return (allowedDomains || []).some((domain) => host === domain || host.endsWith(`.${domain}`));
};
