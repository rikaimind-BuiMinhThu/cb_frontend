import { getParam } from '../config/environment.js';

export const isDisabledElement = (element) => {
  if (element.classList.contains('disabled-input-ec')) return true;

  if (getParam('amazonCheckoutSessionId') && element.getAttribute('disabled')) return true;

  return element.disabled;
};
