import { SEARCH_MODES } from "../constants.js";

const LOOKUP_FAILED_LOG_PREFIX = "[lookup] getElementByAddress failed:";
const INVALID_SEARCH_MODE_PREFIX = "Invalid search mode ";

export const getElementByAddress = (mode, address, rootDocument = document) => {
  if (!mode || !address || !rootDocument) return null;

  try {
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
          null
        ).singleNodeValue;
      default:
        throw new Error(
          `${INVALID_SEARCH_MODE_PREFIX}${mode}, address: ${address}`
        );
    }
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
