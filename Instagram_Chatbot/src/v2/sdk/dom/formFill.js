import { ELEMENT_TAGS, WAIT_OPTION_TYPES } from '../constants.js';
import { sleep } from '../config/environment.js';
import { isDisabledElement } from './disabled.js';
import { getElementByAddress, removeLeadingZero } from './lookup.js';
import {
  setCheckToCheckboxElement,
  setRadioValue,
  setValuePaymentMethodToElement,
  setValueToElement,
} from './formValues.js';
import { waitForElement } from './wait.js';

export const movePaymentMethodToTop = (data) => {
  const index = data.findIndex((item) => item.type === 'payment_method_id');
  if (index !== -1) {
    const [paymentMethod] = data.splice(index, 1);
    data.unshift({ additionalType: 'await' }, paymentMethod, { additionalType: 'await' });
  }
  return data;
};

export const fillDataFromMessage = async (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    if (item.additionalType === 'await') {
      await sleep(1500);
      continue;
    }

    try {
      const element = getElementByAddress(item.bindingMode, item.bindingAddress);

      if (!element) {
        const err = new Error('Element not found for binding');
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            level: 'warning',
            tags: { bindingMode: item.bindingMode, type: item.type },
            extra: { item },
          });
        }
        console.warn('Element not found:', item.bindingAddress);
        continue;
      }

      if (isDisabledElement(element)) {
        const err = new Error(`Element is disabled: ${item.bindingAddress}`);
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            level: 'info',
            tags: { bindingMode: item.bindingMode, type: item.type },
            extra: { item },
          });
        }
        console.warn('Disabled element:', item.bindingAddress);
        continue;
      }

      switch (item.type) {
        case 'zip_code_address':
        case 'card_number':
        case 'card_payment_radio_button':
        case 'credit_card_payment':
        case 'text_input':
        case 'textarea':
        case 'slider': {
          const waitOpts = {
            type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE,
            value: item.bindingValue,
          };
          if (item.disableRemoveLeadingZero) {
            waitOpts.disableRemoveLeadingZero = true;
          }
          waitForElement(item.bindingMode, item.bindingAddress, waitOpts);
          break;
        }

        case 'payment_method_id': {
          setValuePaymentMethodToElement(element, item.bindingValue);
          break;
        }

        case 'dropdown_prefecture': {
          if (element.tagName === ELEMENT_TAGS.SELECT) {
            const acceptableValues = [item.bindingValue.toString(), removeLeadingZero(item.bindingValue).toString()];
            const selectedOption = Array.from(element.options).find((option) => acceptableValues.includes(option.value.toString()));
            if (!selectedOption) item.bindingValue = '';
          }
          waitForElement(
            item.bindingMode, item.bindingAddress,
            { type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue },
          );
          break;
        }

        case 'agree_term':
        case 'checkbox': {
          setCheckToCheckboxElement(element, item.bindingValue);
          break;
        }

        case 'pull_down': {
          if (item.pulldownType === 'lp_integration_option') {
            const isNullOption = item.bindingValue === 'NULL_OPTION';
            if (isNullOption) item.bindingValue = '';

            const hasOption = Array.from(element.options).some((option) => option.value === item.bindingValue);
            if (!hasOption) item.bindingValue = '';
          }

          waitForElement(
            item.bindingMode, item.bindingAddress,
            { type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: item.bindingValue },
          );
          break;
        }

        case 'radio_button': {
          if (element.tagName === ELEMENT_TAGS.SELECT) {
            setValueToElement(element, item.bindingValue, item.disableRemoveLeadingZero);
            break;
          }

          setRadioValue(element, item.bindingValue);
          break;
        }

        case 'password': {
          element.setRangeText(item.bindingValue, 0, element.value.length);
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error('Error processing item in fillDataFromMessage:', err);
      if (window.Sentry) {
        window.Sentry.captureException(err, {
          level: 'error',
          extra: { item },
        });
      }
    }
  }
};
