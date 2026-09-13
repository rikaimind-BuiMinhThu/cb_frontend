import {
  NULL_OPTION_VALUE,
  WAIT_FOR_ELEMENT_INTERVAL_MS,
  WAIT_FOR_ELEMENT_MAX_COUNT,
  WAIT_OPTION_TYPES,
  YEAR_VALUE_PREFIX,
} from '../constants.js';
import { log } from '../config/environment.js';
import { getElementByAddress, removeLeadingZero } from './lookup.js';
import { setValueToElement } from './formValues.js';

const DEFAULT_WAIT_OPTIONS = Object.freeze({
  type: WAIT_OPTION_TYPES.WAIT_FOR_LOADING,
});

const INVALID_WAIT_OPTION_TYPE_PREFIX = 'Invalid wait option type ';

const isValueUnset = (element, waitOptions) => {
  const yearsValue = `${YEAR_VALUE_PREFIX}${waitOptions.value}`;
  const isNullOption = waitOptions.value === NULL_OPTION_VALUE;
  const altBinding = waitOptions.disableRemoveLeadingZero
    ? waitOptions.value
    : removeLeadingZero(waitOptions.value);

  return isNullOption
    || (element.value !== waitOptions.value
      && element.value !== altBinding
      && element.value !== yearsValue);
};

export const waitForElement = (mode, address, options, callback = () => {}) => {
  const waitOptions = options ?? DEFAULT_WAIT_OPTIONS;
  const tick = { count: 0 };

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      tick.count += 1;
      log(`Waiting for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(waitOptions)}: ${tick.count} times`);

      if (tick.count > WAIT_FOR_ELEMENT_MAX_COUNT) {
        clearInterval(intervalId);
        log(`Timeout for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(waitOptions)}`);
        resolve();
        return;
      }

      const element = getElementByAddress(mode, address);
      if (!element) return;

      switch (waitOptions.type) {
        case WAIT_OPTION_TYPES.WAIT_FOR_LOADING:
          clearInterval(intervalId);
          callback();
          resolve();
          break;
        case WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE:
          if (isValueUnset(element, waitOptions)) {
            setValueToElement(element, waitOptions.value, waitOptions.disableRemoveLeadingZero);
            break;
          }
          clearInterval(intervalId);
          callback();
          resolve();
          break;
        default: {
          clearInterval(intervalId);
          reject(new Error(`${INVALID_WAIT_OPTION_TYPE_PREFIX}${waitOptions.type}`));
        }
      }
    }, WAIT_FOR_ELEMENT_INTERVAL_MS);
  });
};
