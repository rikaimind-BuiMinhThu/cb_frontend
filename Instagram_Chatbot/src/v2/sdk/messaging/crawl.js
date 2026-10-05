import {
  CHATBOT_ACTIONS,
  CONVERSION_PARAMS_STORAGE_KEYS,
  CRAWL_ELEMENT_TYPES,
} from '../constants.js';
import { sendMessageToChatbot } from './bridge.js';
import { getElementByAddress } from '../dom/lookup.js';

export const excuteJSCode = (jscode) => {
  if (!jscode) return;
  // eslint-disable-next-line no-new-func -- intentional LP custom JS evaluation
  const func = new Function(jscode);
  func();
};

export const extractSelectOptions = (selectElement, options = {}) => {
  if (!selectElement || selectElement.tagName !== 'SELECT') return null;

  const result = Array.from(selectElement.options)
    .map((option, index) => ({
      id: index + 1,
      text: option.innerText || '指定なし',
      value: option.value || 'NULL_OPTION',
    }));

  if (options.dontDisplayEmptyOption) {
    return result.filter((option) => option.value !== 'NULL_OPTION');
  }

  return result;
};

export const extractFromJs = async (options) => {
  const { searchJsCode: jsCode } = options;
  if (!jsCode) return;

  try {
    // eslint-disable-next-line no-new-func -- intentional LP custom JS evaluation
    const func = new Function(jsCode);
    const result = await func();

    return result;
  } catch (error) {
    try {
      if (window.Sentry) {
        const ev = window.Sentry.captureException(error);
        console.log('Sentry.captureException eventId:', ev);
      }
    } catch (e) {
      console.warn('Failed sending EXTRACT_FROM_JS error to Sentry', e);
    }
    console.error('[EXTRACT_FROM_JS]', error);

    return null;
  }
};

export const transformJsResultArray = ({ data, fields, skipOnError = true }) => {
  if (!Array.isArray(fields) || !Array.isArray(data)) return [];

  const result = data.filter((item) => {
    const isValid = fields.every((field) => item[field]);
    return isValid || !skipOnError;
  });

  return skipOnError ? result : result.length === data.length ? result : [];
};

export const crawl = async (options) => {
  const targetElement = getElementByAddress(options.searchMode, options.searchAddress);
  if (!targetElement) {
    throw new Error('Element not found');
  }

  switch (options.targetElementType) {
    case CRAWL_ELEMENT_TYPES.SELECT:
      return extractSelectOptions(targetElement, options);
    case CRAWL_ELEMENT_TYPES.FROM_JS:
      return transformJsResultArray({
        data: await extractFromJs(options),
        fields: ['id', 'value', 'text'],
      });
    default:
      throw new Error(`Not support target element type ${options.targetElementType}`);
  }
};

export const crawlDataAndSendMessage = async (options) => {
  if (!options.searchAddress || !options.searchMode) return;

  const message = {
    ...options,
    result: await crawl(options),
  };

  sendMessageToChatbot(message, CHATBOT_ACTIONS.CRAWL_DATA);
};

export const processGetErrorMessage = (data) => {
  if (!data.isDisplay) return;

  const element = getElementByAddress(data.searchMode, data.searchValue);

  if (!element) {
    console.log(`Element ${data.searchValue} not found`);
    return;
  }
  sendMessageToChatbot(element.innerHTML, CHATBOT_ACTIONS.GET_ERROR_MESSAGE);
};

export const setChatbotConversionParamsToLocalStorage = (data) => {
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.SCENARIO_ID, data.scenarioId);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.BOT_TYPE, data.botType);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.USER_INPUT_ID, data.userInputId);
  localStorage.setItem(CONVERSION_PARAMS_STORAGE_KEYS.ENV, data.env);
};
