import { WAIT_OPTION_TYPES } from '../constants.js';
import { log } from '../config/environment.js';
import { getElementByAddress, removeLeadingZero } from './lookup.js';
import { setValueToElement } from './formValues.js';

export const waitForElement = (mode, address, options = { type: 'WAIT_FOR_LOADING' }, callback = () => {}) => {
  let count = 0;
  const poops = setInterval(function () {
    count++;
    log(`Waiting for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(options)}: ${count} times`);
    if (count > 50) {
      clearInterval(poops);
      console.log(`Timeout for element address: ${address}, mode: ${mode}, options: ${JSON.stringify(options)}`);
      return;
    }

    const element = getElementByAddress(mode, address);
    if (!element) return;
    switch (options.type) {
      case WAIT_OPTION_TYPES.WAIT_FOR_LOADING:
        clearInterval(poops);
        callback();
        break;
      case WAIT_OPTION_TYPES.WAIT_FOR_SETTING_VALUE: {
        const yearsValue = `20${options.value}`;
        const isNullOption = options.value === 'NULL_OPTION';

        const altBinding = options.disableRemoveLeadingZero
          ? options.value
          : removeLeadingZero(options.value);

        if (isNullOption || (element.value !== options.value && element.value !== altBinding && element.value !== yearsValue)) {
          setValueToElement(element, options.value, options.disableRemoveLeadingZero);
          break;
        }

        clearInterval(poops);
        callback();
        break;
      }
      default:
        throw new Error(`Invalid wait option type ${options.type}`);
    }
  }, 500);
};
