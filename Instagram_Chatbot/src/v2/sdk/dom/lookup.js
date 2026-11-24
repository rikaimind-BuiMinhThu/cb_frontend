import { SEARCH_MODES } from "../constants.js";

const LOOKUP_FAILED_LOG_PREFIX = "[lookup] getElementByAddress failed:";
const INVALID_SEARCH_MODE_PREFIX = "Invalid search mode ";

const evaluateXPath = (rootDocument, expression) =>
  rootDocument.evaluate(
    expression,
    rootDocument,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

export const getElementByAddress = (mode, address, rootDocument = document) => {
  if (!mode || !address || !rootDocument) return null;
  switch (mode) {
    case SEARCH_MODES.ID:
      return rootDocument.getElementById(address);
    case SEARCH_MODES.CSS_SELECTOR:
      return rootDocument.querySelector(address);
    case SEARCH_MODES.XPATH:
      return evaluateXPath(rootDocument, address);
    default:
      throw new Error(
        `${INVALID_SEARCH_MODE_PREFIX}${mode}, address: ${address}`
      );
  }
};

export const findElementByAddress = (mode, address, rootDocument) => {
  try {
    return getElementByAddress(mode, address, rootDocument);
  } catch (err) {
    console.warn(LOOKUP_FAILED_LOG_PREFIX, { mode, address }, err);
    return null;
  }
};

export const removeLeadingZero = (value) => {
  const strValue = value?.toString() || "";
  const result = strValue.replace(/^0+/, "");
  return typeof value === "number" ? Number(result) : result;
};
