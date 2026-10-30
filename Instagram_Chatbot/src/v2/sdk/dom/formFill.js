import {
  AWAIT_FILL_TYPE,
  ELEMENT_TAGS,
  EMPTY_VALUE,
  MESSAGE_CONTENT_TYPES,
  NULL_OPTION_VALUE,
  PAYMENT_METHOD_ID_TYPE,
  WAIT_OPTION_TYPES,
} from '../constants.js';
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

const FILL_SLEEP_MS = 1500;
const ELEMENT_NOT_FOUND_MESSAGE = 'Element not found for binding';
const ELEMENT_DISABLED_PREFIX = 'Element is disabled: ';
const FILL_ITEM_ERROR_PREFIX = 'Error processing item in fillDataFromMessage:';
const ELEMENT_NOT_FOUND_LOG_PREFIX = 'Element not found:';
const DISABLED_ELEMENT_LOG_PREFIX = 'Disabled element:';

export const movePaymentMethodToTop = (data) => {
  const paymentMethodIndex = data.findIndex((item) => item.type === PAYMENT_METHOD_ID_TYPE);
  if (paymentMethodIndex === -1) return data;

  const nextData = [...data];
  const [paymentMethod] = nextData.splice(paymentMethodIndex, 1);
  nextData.unshift(
    { additionalType: AWAIT_FILL_TYPE },
    paymentMethod,
    { additionalType: AWAIT_FILL_TYPE },
  );
  return nextData;
};

const PREFECTURE_SELECT_REAPPLY_DELAY_MS = 300;

const waitToSetValue = (item, bindingValue) => {
  const waitOpts = {
    type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE,
    value: bindingValue,
  };
  if (item.disableRemoveLeadingZero) {
    waitOpts.disableRemoveLeadingZero = true;
  }
  return waitForElement(item.bindingMode, item.bindingAddress, waitOpts);
};

const buildSelectBindingCandidates = (bindingValue) => {
  if (bindingValue == null || bindingValue === '') return [];
  const raw = bindingValue.toString();
  const candidates = new Set([raw, removeLeadingZero(bindingValue).toString()]);
  if (/^\d+$/.test(raw)) {
    candidates.add(raw.padStart(2, '0'));
  }
  return Array.from(candidates);
};

const resolveSelectBindingValue = (element, bindingValue) => {
  if (bindingValue == null || bindingValue === '') return EMPTY_VALUE;

  const acceptableValues = buildSelectBindingCandidates(bindingValue);
  const selectedOption = Array.from(element.options).find((option) => {
    const optionValue = option.value.toString();
    const optionText = (option.text || '').trim();
    return acceptableValues.includes(optionValue) || acceptableValues.includes(optionText);
  });
  return selectedOption ? selectedOption.value : EMPTY_VALUE;
};

const scheduleSelectValueReapply = (mode, address, value) => {
  if (value == null || value === '') return;

  const reapply = () => {
    const selectElement = getElementByAddress(mode, address);
    if (!selectElement || selectElement.tagName !== ELEMENT_TAGS.SELECT) return;
    if (selectElement.value === value.toString()) return;
    setValueToElement(selectElement, value);
  };

  if (document.readyState !== 'complete') {
    window.addEventListener('load', reapply, { once: true });
  }
  setTimeout(reapply, PREFECTURE_SELECT_REAPPLY_DELAY_MS);
};

export const fillDataFromMessage = async (data) => {
  for (const item of data) {
    if (item.additionalType === AWAIT_FILL_TYPE) {
      await sleep(FILL_SLEEP_MS);
      continue;
    }

    try {
      const element = getElementByAddress(item.bindingMode, item.bindingAddress);

      if (!element) {
        const err = new Error(ELEMENT_NOT_FOUND_MESSAGE);
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            level: 'warning',
            tags: { bindingMode: item.bindingMode, type: item.type },
            extra: { item },
          });
        }
        console.warn(ELEMENT_NOT_FOUND_LOG_PREFIX, item.bindingAddress);
        continue;
      }

      if (isDisabledElement(element)) {
        const err = new Error(`${ELEMENT_DISABLED_PREFIX}${item.bindingAddress}`);
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            level: 'info',
            tags: { bindingMode: item.bindingMode, type: item.type },
            extra: { item },
          });
        }
        console.warn(DISABLED_ELEMENT_LOG_PREFIX, item.bindingAddress);
        continue;
      }

      switch (item.type) {
        case 'zip_code_address':
        case 'card_number':
        case 'card_payment_radio_button':
        case 'credit_card_payment':
        case 'text_input':
        case 'textarea':
        case 'slider':
          waitToSetValue(item, item.bindingValue);
          break;

        case PAYMENT_METHOD_ID_TYPE:
          setValuePaymentMethodToElement(element, item.bindingValue);
          break;

        case 'dropdown_prefecture': {
          const prefectureValue = element.tagName === ELEMENT_TAGS.SELECT
            ? resolveSelectBindingValue(element, item.bindingValue)
            : item.bindingValue;
          waitForElement(
            item.bindingMode,
            item.bindingAddress,
            { type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: prefectureValue },
          );
          if (element.tagName === ELEMENT_TAGS.SELECT) {
            scheduleSelectValueReapply(item.bindingMode, item.bindingAddress, prefectureValue);
          }
          break;
        }

        case 'agree_term':
        case 'checkbox':
          setCheckToCheckboxElement(element, item.bindingValue);
          break;

        case 'pull_down': {
          const isLpIntegration = item.pulldownType === MESSAGE_CONTENT_TYPES.PULLDOWN.LP_INTEGRATION_OPTION;
          const pullDownValue = (isLpIntegration && item.bindingValue === NULL_OPTION_VALUE)
            ? EMPTY_VALUE
            : item.bindingValue;
          const hasOption = !isLpIntegration
            || Array.from(element.options).some((option) => option.value === pullDownValue);
          const bindingValue = hasOption ? pullDownValue : EMPTY_VALUE;
          waitForElement(
            item.bindingMode,
            item.bindingAddress,
            { type: WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE, value: bindingValue },
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

        case 'password':
          element.setRangeText(item.bindingValue, 0, element.value.length);
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(FILL_ITEM_ERROR_PREFIX, err);
      if (window.Sentry) {
        window.Sentry.captureException(err, {
          level: 'error',
          extra: { item },
        });
      }
    }
  }
};
