import { FUKUSHASHIKI_SEARCH_MODE_OPTIONS } from 'v2/variables/constants';
import {
  AMAZON_PAY_FIELDS_KEY,
  AMAZON_PAY_HTML_FIELD_LABELS,
  AMAZON_PAY_HTML_LABELS,
  AMAZON_PAY_HTML_TEXT_INPUT_LABELS,
  DEFAULT_FUKUSHASHIKI_SEARCH_MODE,
  USER_BELONG_TO,
} from '../constants/amazonPayHtmlLabels';

const ZIP_FIELD_PREFIXES = [
  'post_code',
  'post_code_left',
  'post_code_right',
  'prefecture',
  'municipality',
  'address',
  'building_name',
];

const SHIPPING_FIELD_PREFIXES = [
  'name_left',
  'name_right',
  'kana_left',
  'kana_right',
  'number1',
  'number2',
  'number3',
  'number',
  'post_code',
  'post_code_left',
  'post_code_right',
  'prefecture',
  'municipality',
  'address',
  'building_name',
  'initial_selection',
];

const CARD_FIELD_PREFIXES = [
  'card_number',
  'card_holder1',
  'card_holder2',
  'card_holder',
  'year',
  'month',
  'cvc',
  'card_number1',
  'card_number2',
  'card_number3',
  'card_number4',
  'installment',
  'initial_selection',
];

const modeKeyFromValueKey = (valueKey) => valueKey.replace(/_search_value$/, '_search_mode');

const buildField = (valueKey, label) => ({
  valueKey,
  modeKey: modeKeyFromValueKey(valueKey),
  label: label || AMAZON_PAY_HTML_FIELD_LABELS[valueKey] || AMAZON_PAY_HTML_FIELD_LABELS.fukushashiki_search_value,
});

const buildPrefixedFields = (prefixes) => prefixes.map((prefix) => (
  buildField(`${prefix}_fukushashiki_search_value`)
));

const listTextInputFields = (content) => {
  const inputType = content.text_input?.type;
  switch (inputType) {
    case 'text':
      if (content.text_input?.text?.isSplitInput) {
        return [
          buildField('left_fukushashiki_search_value'),
          buildField('right_fukushashiki_search_value'),
        ];
      }
      return [buildField(
        'fukushashiki_search_value',
        AMAZON_PAY_HTML_TEXT_INPUT_LABELS.text,
      )];
    case 'phone_number':
      if (content.text_input?.phone_number?.withHyphen === false) {
        return [buildField(
          'fukushashiki_search_value',
          AMAZON_PAY_HTML_TEXT_INPUT_LABELS.phone_number,
        )];
      }
      return [
        buildField('value1_fukushashiki_search_value'),
        buildField('value2_fukushashiki_search_value'),
        buildField('value3_fukushashiki_search_value'),
      ];
    case 'email_confirmation':
      return [
        buildField('value_fukushashiki_search_value'),
        buildField('valueConfirm_fukushashiki_search_value'),
      ];
    case 'password_confirmation':
      return [
        buildField(
          'fukushashiki_search_value',
          AMAZON_PAY_HTML_TEXT_INPUT_LABELS.password,
        ),
        buildField('confirm_fukushashiki_search_value'),
      ];
    case 'email_address':
    case 'urls':
    case 'password':
      return [buildField(
        'fukushashiki_search_value',
        AMAZON_PAY_HTML_TEXT_INPUT_LABELS[inputType],
      )];
    default:
      return [buildField('fukushashiki_search_value')];
  }
};

export const listAmazonPayHtmlFieldsForContent = (content) => {
  if (!content?.type) return [];

  switch (content.type) {
    case 'text_input':
      return listTextInputFields(content);
    case 'zip_code_address':
      return buildPrefixedFields(ZIP_FIELD_PREFIXES);
    case 'shipping_address':
      return buildPrefixedFields(SHIPPING_FIELD_PREFIXES);
    case 'card_payment_radio_button':
    case 'credit_card_payment':
      return buildPrefixedFields(CARD_FIELD_PREFIXES);
    case 'checkbox':
      return [buildField('checkedValue_fukushashiki_search_value')];
    case 'radio_button':
      return [buildField('initial_selection_fukushashiki_search_value')];
    case 'textarea':
    case 'pull_down':
    case 'product_purchase_select_option':
      return [buildField('fukushashiki_search_value')];
    default:
      return [];
  }
};

export const isAmazonPayUserMessage = (message) => {
  if (message?.belong_to !== USER_BELONG_TO) return false;
  if (message.is_used_when_amazon_pay) return true;
  return (message.message_content || []).some((content) => (
    !!content?.is_used_when_amazon_pay
    || Object.values(content?.[AMAZON_PAY_FIELDS_KEY] || {}).some(Boolean)
  ));
};

export const isAmazonPayFieldEnabled = (content, selectorKeyType) => {
  const fields = content?.[AMAZON_PAY_FIELDS_KEY];
  if (!fields || typeof fields !== 'object') return true;
  if (!Object.prototype.hasOwnProperty.call(fields, selectorKeyType)) return true;
  return fields[selectorKeyType] !== false;
};

export const amazonPayHtmlModeLabel = (mode) => {
  const option = FUKUSHASHIKI_SEARCH_MODE_OPTIONS.find((item) => item.key === Number(mode));
  return option?.value || AMAZON_PAY_HTML_LABELS.emptySelector;
};

const isGenericChatFieldLabel = (fieldLabel) => (
  fieldLabel === AMAZON_PAY_HTML_TEXT_INPUT_LABELS.text
  || fieldLabel === AMAZON_PAY_HTML_FIELD_LABELS.fukushashiki_search_value
);

const buildChatFieldLabel = (message, field) => {
  const messageName = (message?.message_name || '').trim();
  const fieldLabel = field.label;
  if (messageName && isGenericChatFieldLabel(fieldLabel)) {
    return messageName;
  }
  if (messageName && fieldLabel) {
    return `${messageName}${AMAZON_PAY_HTML_LABELS.labelSeparator}${fieldLabel}`;
  }
  if (fieldLabel && !isGenericChatFieldLabel(fieldLabel)) {
    return fieldLabel;
  }
  return messageName || AMAZON_PAY_HTML_LABELS.unnamedStep;
};

export const listAmazonPayHtmlRows = (dataMessages = []) => {
  const rows = [];
  dataMessages.forEach((message, messageIndex) => {
    if (message?.belong_to !== USER_BELONG_TO) return;
    if (!message.is_used_when_amazon_pay) return;
    (message.message_content || []).forEach((content, contentIndex) => {
      listAmazonPayHtmlFieldsForContent(content).forEach((field) => {
        rows.push({
          rowKey: `${message.id || messageIndex}-${contentIndex}-${field.valueKey}`,
          messageId: message.id,
          messageIndex,
          contentIndex,
          valueKey: field.valueKey,
          modeKey: field.modeKey,
          label: buildChatFieldLabel(message, field),
          mode: content[field.modeKey] || DEFAULT_FUKUSHASHIKI_SEARCH_MODE,
          value: content[field.valueKey] || '',
        });
      });
    });
  });
  return rows;
};
