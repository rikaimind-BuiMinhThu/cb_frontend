import { SEARCH_MODES } from '../constants.js';

export const getElementByAddress = (mode, address, rootDocument = document) => {
  if (!mode || !address || !rootDocument) return null;
  switch (mode) {
    case SEARCH_MODES.ID:
      return rootDocument.getElementById(address);
    case SEARCH_MODES.CSS_SELECTOR:
      return rootDocument.querySelector(address);
    case SEARCH_MODES.XPATH:
      return rootDocument.evaluate(
        address,
        rootDocument,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
    default:
      throw new Error(`Invalid search mode ${mode}, address: ${address}`);
  }
};

export const removeLeadingZero = (value) => {
  const strValue = value?.toString() || '';
  const result = strValue.replace(/^0+/, '');
  return typeof value === 'number' ? Number(result) : result;
};
