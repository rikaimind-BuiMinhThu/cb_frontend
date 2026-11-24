import {
  AMAZON_SELECTOR_TO_VALUE_PATH,
  FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX,
  MESSAGE_CONTENT_TYPES,
  SEARCH_MODES,
} from "../constants.js";
import { getElementByAddress } from "../dom/lookup.js";

const ZIP_FIELD_TYPES = [
  "post_code",
  "post_code_left",
  "post_code_right",
  "prefecture",
  "municipality",
  "address",
  "building_name",
];

const SHIPPING_FIELD_TYPES = [
  "number1",
  "number2",
  "number3",
  "number",
  "name_left",
  "name_right",
  "kana_left",
  "kana_right",
  "building_name",
  "address",
  "municipality",
  "prefecture",
  "post_code",
  "post_code_left",
  "post_code_right",
  "initial_selection",
];

const CARD_PAYMENT_FIELD_TYPES = [
  "card_number",
  "card_holder1",
  "card_holder2",
  "card_holder",
  "year",
  "month",
  "cvc",
  "card_number1",
  "card_number2",
  "card_number3",
  "card_number4",
  "installment",
  "initial_selection",
];

const splitSourceSelectors = (rawValue) => {
  if (typeof rawValue !== "string") return [];
  return rawValue
    .split(",")
    .map((selector) => selector.trim())
    .filter(Boolean);
};

const resolveSearchMode = ({ content, selectorKeyType, searchMode }) => {
  if (searchMode !== undefined && searchMode !== null && searchMode !== "")
    return searchMode;
  if (!content || !selectorKeyType) return undefined;
  return content[selectorKeyType.replace(/_value$/, "_mode")];
};

export const buildBindingsFromSelectorKey = ({
  selectorKeyType,
  rawValue,
  valuePath,
  content,
  searchMode,
}) => {
  if (!selectorKeyType || !valuePath) return [];
  const resolvedMode = resolveSearchMode({
    content,
    selectorKeyType,
    searchMode,
  });
  return splitSourceSelectors(rawValue).map((sourceSelector) => ({
    selectorKeyType,
    sourceSelector,
    valuePath,
    searchMode: resolvedMode,
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
    bindings.push(
      ...buildBindingsFromSelectorKey({
        selectorKeyType,
        rawValue,
        valuePath,
        content,
      })
    );
  });
  return bindings;
};

const appendBinding = (bindings, seen, binding) => {
  if (
    !binding?.selectorKeyType ||
    !binding?.sourceSelector ||
    !binding?.valuePath
  )
    return;
  const dedupeKey = `${binding.selectorKeyType}::${binding.sourceSelector}`;
  if (seen.has(dedupeKey)) return;
  seen.add(dedupeKey);
  bindings.push(binding);
};

const appendBindings = (bindings, seen, newBindings) => {
  (newBindings || []).forEach((binding) =>
    appendBinding(bindings, seen, binding)
  );
};

const extractTextInputBindings = (content) => {
  const bindings = [];
  const inputType = content.text_input?.type;
  switch (inputType) {
    case "text":
      if (content.text_input?.text?.isSplitInput) {
        bindings.push(
          ...buildBindingsFromSelectorKey({
            selectorKeyType: "left_fukushashiki_search_value",
            rawValue: content.left_fukushashiki_search_value,
            valuePath: "text_input.text.valueLeft",
            content,
          }),
          ...buildBindingsFromSelectorKey({
            selectorKeyType: "right_fukushashiki_search_value",
            rawValue: content.right_fukushashiki_search_value,
            valuePath: "text_input.text.valueRight",
            content,
          })
        );
      }
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: "fukushashiki_search_value",
          rawValue: content.fukushashiki_search_value,
          valuePath: "text_input.text.value",
          content,
        })
      );
      break;
    case "phone_number":
      if (content.text_input?.phone_number?.withHyphen === false) {
        bindings.push(
          ...buildBindingsFromSelectorKey({
            selectorKeyType: "fukushashiki_search_value",
            rawValue: content.fukushashiki_search_value,
            valuePath: "text_input.phone_number.value",
            content,
          })
        );
        break;
      }
      bindings.push(
        ...bindingsFromFieldTypes({
          content,
          fieldTypes: ["value1", "value2", "value3"],
          getSelectorKeyType: (fieldType) =>
            `${fieldType}_fukushashiki_search_value`,
          getValuePath: (fieldType) => `text_input.phone_number.${fieldType}`,
        })
      );
      break;
    case "email_confirmation":
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: "value_fukushashiki_search_value",
          rawValue: content.value_fukushashiki_search_value,
          valuePath: `text_input.${inputType}.value`,
          content,
        }),
        ...buildBindingsFromSelectorKey({
          selectorKeyType: "valueConfirm_fukushashiki_search_value",
          rawValue: content.valueConfirm_fukushashiki_search_value,
          valuePath: `text_input.${inputType}.valueConfirm`,
          content,
        })
      );
      break;
    case "password_confirmation":
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: "fukushashiki_search_value",
          rawValue: content.fukushashiki_search_value,
          valuePath: "text_input.password_confirmation.value",
          content,
        }),
        ...buildBindingsFromSelectorKey({
          selectorKeyType: "confirm_fukushashiki_search_value",
          rawValue: content.confirm_fukushashiki_search_value,
          valuePath: "text_input.password_confirmation.valueConfirm",
          content,
        })
      );
      break;
    case "email_address":
    case "urls":
    case "password":
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: "fukushashiki_search_value",
          rawValue: content.fukushashiki_search_value,
          valuePath: `text_input.${inputType}.value`,
          content,
        })
      );
      break;
    default:
      break;
  }
  return bindings;
};

const extractZipCodeAddressBindings = (content) =>
  bindingsFromFieldTypes({
    content,
    fieldTypes: ZIP_FIELD_TYPES,
    getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
    getValuePath: (fieldType) =>
      fieldType === "building_name"
        ? "zip_code_address.building_name"
        : `zip_code_address.value_${fieldType}`,
    shouldIncludeField: (fieldType) => fieldType !== "await",
  });

const extractShippingAddressBindings = (content) =>
  bindingsFromFieldTypes({
    content,
    fieldTypes: SHIPPING_FIELD_TYPES,
    getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
    getValuePath: (fieldType) => `shipping_address.value_${fieldType}`,
    shouldIncludeField: (fieldType, item) => {
      const bindingMode = item[`${fieldType}_fukushashiki_search_mode`];
      const bindingValue = item[`${fieldType}_fukushashiki_search_value`];
      return (
        bindingMode !== undefined &&
        bindingValue !== undefined &&
        bindingValue !== ""
      );
    },
  });

const extractCardPaymentBindings = (content) =>
  bindingsFromFieldTypes({
    content,
    fieldTypes: CARD_PAYMENT_FIELD_TYPES,
    getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
    getValuePath: (fieldType) => `${content.type}.${fieldType}`,
  });

const extractCheckboxBindings = (content) =>
  buildBindingsFromSelectorKey({
    selectorKeyType: "checkedValue_fukushashiki_search_value",
    rawValue: content.checkedValue_fukushashiki_search_value,
    valuePath: "checkbox.checkedValue",
    content,
  });

const extractRadioButtonBindings = (content) =>
  buildBindingsFromSelectorKey({
    selectorKeyType: "initial_selection_fukushashiki_search_value",
    rawValue: content.initial_selection_fukushashiki_search_value,
    valuePath: "radio_button.initial_selection",
    content,
  });

const extractTextareaBindings = (content) =>
  buildBindingsFromSelectorKey({
    selectorKeyType: "fukushashiki_search_value",
    rawValue: content.fukushashiki_search_value,
    valuePath: "textarea.text_input.value",
    content,
  });

const extractPullDownBindings = (content) => {
  const pullDownType = content.pull_down?.type;
  if (!pullDownType) return [];
  return buildBindingsFromSelectorKey({
    selectorKeyType: "fukushashiki_search_value",
    rawValue: content.fukushashiki_search_value,
    valuePath: `pull_down.${pullDownType}.value`,
    content,
  });
};

const extractProductPurchaseSelectOptionBindings = (content) =>
  buildBindingsFromSelectorKey({
    selectorKeyType: "fukushashiki_search_value",
    rawValue: content.fukushashiki_search_value,
    valuePath: "product_purchase_select_option.value",
    content,
  });

const extractBindingsFromContent = (content) => {
  if (!content?.type) return [];
  switch (content.type) {
    case MESSAGE_CONTENT_TYPES.TEXT_INPUT:
      return extractTextInputBindings(content);
    case MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS:
      return extractZipCodeAddressBindings(content);
    case MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS:
      return extractShippingAddressBindings(content);
    case MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON:
    case MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT:
      return extractCardPaymentBindings(content);
    case MESSAGE_CONTENT_TYPES.CHECKBOX:
      return extractCheckboxBindings(content);
    case MESSAGE_CONTENT_TYPES.RADIO_BUTTON:
      return extractRadioButtonBindings(content);
    case MESSAGE_CONTENT_TYPES.TEXT_AREA:
      return extractTextareaBindings(content);
    case MESSAGE_CONTENT_TYPES.PULL_DOWN:
      return extractPullDownBindings(content);
    case MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_SELECT_OPTION:
      return extractProductPurchaseSelectOptionBindings(content);
    default:
      return [];
  }
};

const resolveValuePath = (selectorKeyType, content) => {
  if (AMAZON_SELECTOR_TO_VALUE_PATH[selectorKeyType]) {
    return AMAZON_SELECTOR_TO_VALUE_PATH[selectorKeyType];
  }
  const inputType = content?.text_input?.type || "text";
  if (selectorKeyType === "value_fukushashiki_search_value") {
    return `text_input.${inputType}.value`;
  }
  if (selectorKeyType === "valueConfirm_fukushashiki_search_value") {
    return `text_input.${inputType}.valueConfirm`;
  }
  const phoneMatch = selectorKeyType.match(
    /^value([123])_fukushashiki_search_value$/
  );
  if (phoneMatch) {
    return `text_input.phone_number.value${phoneMatch[1]}`;
  }
  console.warn(
    "[AmazonPay] unresolved valuePath for selector key:",
    selectorKeyType
  );
  return null;
};

const extractGenericFallbackBindings = (content) => {
  const bindings = [];
  Object.entries(content || {}).forEach(([selectorKeyType, rawValue]) => {
    if (!selectorKeyType.endsWith(FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX)) return;
    const valuePath = resolveValuePath(selectorKeyType, content);
    if (!valuePath) return;
    bindings.push(
      ...buildBindingsFromSelectorKey({
        selectorKeyType,
        rawValue,
        valuePath,
        content,
      })
    );
  });
  return bindings;
};

const hasAmazonPayIncludeUrlCondition = (msg) =>
  (msg.conditions || []).some(
    (condition) =>
      condition.inputCondition === "is_using_amazon_pay" &&
      condition.nameCondition === "current_url" &&
      condition.condition === "include"
  );

const isAmazonPayUserMessage = (msg) => {
  if (msg?.belong_to !== "user") return false;
  if (msg.is_used_when_amazon_pay) return true;
  if (hasAmazonPayIncludeUrlCondition(msg)) return true;
  return (msg.message_content || []).some(
    (content) =>
      !!content?.is_used_when_amazon_pay ||
      Object.values(content?.amazon_pay_fields || {}).some(Boolean)
  );
};

const isAmazonPayFieldEnabled = (content, selectorKeyType) => {
  const fields = content?.amazon_pay_fields;
  if (!fields || typeof fields !== "object") return true;
  if (!Object.prototype.hasOwnProperty.call(fields, selectorKeyType))
    return true;
  return fields[selectorKeyType] !== false;
};

const filterEnabledBindings = (content, bindings) =>
  (bindings || []).filter((binding) =>
    isAmazonPayFieldEnabled(content, binding.selectorKeyType)
  );

export const extractSelectorBindingsFromMessages = (messages) => {
  const bindings = [];
  const seen = new Set();
  (messages || []).filter(isAmazonPayUserMessage).forEach((msg) => {
    (msg.message_content || []).forEach((content, contentIndex) => {
      const meta = { messageId: msg.id, contentIndex };
      appendBindings(
        bindings,
        seen,
        filterEnabledBindings(content, extractBindingsFromContent(content)).map(
          (binding) => ({ ...binding, ...meta })
        )
      );
      appendBindings(
        bindings,
        seen,
        filterEnabledBindings(
          content,
          extractGenericFallbackBindings(content)
        ).map((binding) => ({ ...binding, ...meta }))
      );
    });
  });
  return bindings;
};

export const collectSelectorValuesFromBindings = (bindings) => {
  const selectorValues = [];
  (bindings || []).forEach(
    ({ selectorKeyType, sourceSelector, valuePath, searchMode }) => {
      if (!sourceSelector || !valuePath) return;
      const el = getElementByAddress(
        searchMode || SEARCH_MODES.ID,
        sourceSelector
      );
      if (!el) return;
      const value = (el.value || "").trim();
      if (!value) return;
      selectorValues.push({
        selectorKeyType,
        sourceSelector,
        valuePath,
        value,
      });
    }
  );
  return selectorValues;
};

export const buildAmazonSelectorPayload = ({
  scenarioMessages,
  selectorBindings,
  cartSystem,
  domain,
}) => {
  const bindings =
    selectorBindings && selectorBindings.length
      ? selectorBindings
      : extractSelectorBindingsFromMessages(scenarioMessages);
  const selectorValues = collectSelectorValuesFromBindings(bindings);
  return {
    meta: { cartSystem, domain, configVersion: 1, source: "sdk-v2" },
    selectorValues,
  };
};

export const normalizeEcchAmazonSelectorValues = (selectorValues) => {
  const normalized = [];
  (selectorValues || []).forEach((item) => {
    const { selectorKeyType, sourceSelector, valuePath, value } = item || {};
    if (!selectorKeyType || !sourceSelector || !valuePath) {
      console.warn(
        "[ecchAmazon] skip item missing selectorKeyType/sourceSelector/valuePath:",
        item
      );
      return;
    }
    normalized.push({ selectorKeyType, sourceSelector, valuePath, value });
  });
  return normalized;
};

export const safeGetAmazonPayload = async () => {
  if (typeof window.ecchAmazon !== "function") return null;
  try {
    const payload = await window.ecchAmazon();
    if (!payload || !Array.isArray(payload.selectorValues)) return null;
    const selectorValues = normalizeEcchAmazonSelectorValues(
      payload.selectorValues
    );
    if (!selectorValues.length) return null;
    return { ...payload, selectorValues };
  } catch (err) {
    console.warn("[ecchAmazon] invalid contract:", err);
    return null;
  }
};

export const hasAmazonPayTargets = (messages) =>
  (messages || []).some(isAmazonPayUserMessage);

export const normalizeLpDomain = (input) => {
  if (!input || typeof input !== "string") return "";
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.split("/")[0].split("?")[0].split("#")[0];
  domain = domain.replace(/^www\./, "");
  return domain;
};

export const isHostnameAllowedForLp = (hostname, allowedDomains) => {
  const host = normalizeLpDomain(hostname);
  if (!host) return false;
  return (allowedDomains || []).some(
    (domain) => host === domain || host.endsWith(`.${domain}`)
  );
};
