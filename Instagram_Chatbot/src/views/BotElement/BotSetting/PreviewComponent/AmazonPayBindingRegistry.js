import {
  bindingsFromFieldTypes,
  buildBindingsFromSelectorKey,
} from './FukushashikiBindingMetaUtils';

const ZIP_FIELD_TYPES = [
  'post_code',
  'post_code_left',
  'post_code_right',
  'prefecture',
  'municipality',
  'address',
  'building_name',
];

const SHIPPING_FIELD_TYPES = [
  'number1',
  'number2',
  'number3',
  'number',
  'name_left',
  'name_right',
  'kana_left',
  'kana_right',
  'building_name',
  'address',
  'municipality',
  'prefecture',
  'post_code',
  'post_code_left',
  'post_code_right',
  'initial_selection',
];

const CARD_PAYMENT_FIELD_TYPES = [
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

const extractTextInputBindings = (content) => {
  const bindings = [];
  const inputType = content.text_input?.type;

  switch (inputType) {
    case 'text': {
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
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: 'fukushashiki_search_value',
          rawValue: content.fukushashiki_search_value,
          valuePath: 'text_input.text.value',
        }),
      );
      break;
    }
    case 'phone_number': {
      if (content.text_input?.phone_number?.withHyphen === false) {
        bindings.push(
          ...buildBindingsFromSelectorKey({
            selectorKeyType: 'fukushashiki_search_value',
            rawValue: content.fukushashiki_search_value,
            valuePath: 'text_input.phone_number.value',
          }),
        );
        break;
      }
      bindings.push(
        ...bindingsFromFieldTypes({
          content,
          fieldTypes: ['value1', 'value2', 'value3'],
          getSelectorKeyType: (fieldType) => `${fieldType}_fukushashiki_search_value`,
          getValuePath: (fieldType) => `text_input.phone_number.${fieldType}`,
        }),
      );
      break;
    }
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
      bindings.push(
        ...buildBindingsFromSelectorKey({
          selectorKeyType: 'fukushashiki_search_value',
          rawValue: content.fukushashiki_search_value,
          valuePath: `text_input.${inputType}.value`,
        }),
      );
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

export const extractBindingsFromContent = (content) => {
  if (!content?.type) return [];

  switch (content.type) {
    case 'text_input':
      return extractTextInputBindings(content);
    case 'zip_code_address':
      return extractZipCodeAddressBindings(content);
    case 'shipping_address':
      return extractShippingAddressBindings(content);
    case 'card_payment_radio_button':
    case 'credit_card_payment':
      return extractCardPaymentBindings(content);
    case 'checkbox':
      return extractCheckboxBindings(content);
    case 'radio_button':
      return extractRadioButtonBindings(content);
    case 'textarea':
      return extractTextareaBindings(content);
    default:
      return [];
  }
};
