import { ELEMENT_TAGS } from '../constants.js';
import { removeLeadingZero } from './lookup.js';

export const setCheckToCheckboxElement = (element, value) => {
  if (element.type !== 'checkbox') return;
  const currentValue = element.checked;
  if (currentValue === value) return;

  element.checked = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

export const setValueToElement = (element, value, disableRemoveLeadingZero = false) => {
  let newElementValue = value;

  if (element.tagName === ELEMENT_TAGS.SELECT) {
    const acceptableValues = disableRemoveLeadingZero
      ? [value.toString(), `20${value}`]
      : [value.toString(), removeLeadingZero(value).toString(), `20${value}`];
    newElementValue = acceptableValues.find((v) => Array.from(element.options).some((option) => option.value === v));

    if (!newElementValue && newElementValue !== '') {
      console.error(`Option not found: ${value}, element: ${element.id}`);
    }
  }

  element.value = newElementValue;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

export const setRadioValue = (element, value) => {
  const radioButtons = [...element.querySelectorAll('input[type="radio"]')];
  const selectedRadio = radioButtons.find((radio) => radio.value === value);
  if (!selectedRadio) return;
  selectedRadio.checked = true;
  selectedRadio.dispatchEvent(new Event('input', { bubbles: true }));
  selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
  selectedRadio.click();
};

export const setValuePaymentMethodToElement = (element, value) => {
  const radioButtons = [...element.querySelectorAll('input[type="radio"]')];

  if (radioButtons.length > 0) {
    setRadioValue(element, value);
  } else {
    setValueToElement(element, value);
  }
};
